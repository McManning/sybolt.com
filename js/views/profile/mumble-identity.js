
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/profile/mumble-identity.html',
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            "click .save-changes": "onSaveChangesClick"
        },

        onSaveChangesClick: function() {

            var $form = this.$el.find('.edit-identity form');

            var type = 'POST';
            var url = App.getApiBaseUrl() + '/identity/mumble';

            // If we're actually updating an existing model, change request
            if (this.model.id) {
                type = 'PUT';
                url += '/id/' + this.model.id;
            }

            // If the validator passes, push up the changes to our API
            $form.validate(function(success) {
                if (success) {
                    
                    // Push identity changes
                    $.ajax({
                        type: type,
                        url: url,
                        data: $form.serializeJSON(),
                        dataType: 'json',
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(json) {
                            console.log('success', json);
                            alert('Mumble identity Saved!');
                        },
                        error: function(jqXHR) {
                            if (jqXHR.responseJSON) {
                                alert(jqXHR.responseJSON.message);
                            }
                            else {
                                alert('An unspecified error has occurred while trying to save your mumble identity.');
                            }
                        }
                    });
                }
            });

            return false;
        },
        
        initialize: function() {
            
        },
        
        render: function() {
            this.$el.html(this.template({
                id: this.model.id,
                nickname: this.model.nickname,
                password: this.model.password,
                channel: this.model.channel,
                avatar_url: this.model.avatar_url
            }));

            this.$el.find('.edit-identity form').verify();

            return this;
        }
    });
    
    return View;
});
