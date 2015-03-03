
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/minecraft/timeline.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            "click .timeline-scroll-up": "scrollUp"
        },
        
        initialize: function() {
         
        },
        
        /** 
         * Action for clicking the arrow up at the bottom of the page.
         * Performs a gradual scroll back to the top.
         */
        scrollUp: function() {
            $('html, body').animate({
                scrollTop: 0
            }, 800);

            return false;
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('minecraft');
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            return this;
        }
    });
    
    return View;
});
