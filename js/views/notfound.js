
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/notfound.html',
], function($, _, Backbone, App, notFoundTemplate) {
    'use strict';
    
    var NotFoundView = Backbone.View.extend({
        template: _.template(notFoundTemplate),
        
        close: function() {
            
            this.remove(); // Destroy this
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            
            this.$el.html(this.template({
                'location': Backbone.history.location
            }));
            
            return this;
        }
    });
    
    return NotFoundView;
});
