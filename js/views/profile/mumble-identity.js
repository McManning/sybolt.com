
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
            
        },

        initialize: function() {

        },
        
        render: function() {
            
            this.$el.html(this.template({
                // vars here...
            }));

            return this;
        }
    });
    
    return View;
});
