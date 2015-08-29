
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/register/index.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            "click #register": "onRegisterClick"
        },

        onRegisterClick: function() {

            var $form = $('#registration-form');

            $form.validate(function(success) {
                if (success) {

                    // Push register attempt
                    $.ajax({
                        type: 'POST',
                        url: App.getApiBaseUrl() + '/profile',
                        data: $form.serialize(),
                        dataType: 'json',
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(json) {

                            // Load the home page as a logged in user
                            App.router.navigate('home', {trigger: false});
                            window.location.reload();
                        },
                        error: function(jqXHR) {
                            if (jqXHR.responseJSON) {
                                alert(jqXHR.responseJSON.message);
                            }
                            else {
                                alert('An unspecified error has occurred while trying to login.');
                            }
                        }
                    });
                }
            });

            return false;
        },
        
        initialize: function() {

            // TODO: Better security. I don't even want them loading this script
            if (App.profile) {
                App.router.navigate('profile', {trigger: true});
            }
        },
        
        close: function() {
            this.remove();
        },

        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            // Render form
            this.$el.html(this.template({
                
            }));

            // Hook rendered form to use the validator
            $('#registration-form').verify();
            return this;
        }
    });
    
    return View;
});
