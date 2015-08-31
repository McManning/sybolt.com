
define([
    'jquery',
    'underscore',
    'backbone',
    'text!minecraft/templates/timeline.html'
], function($, _, Backbone, Template) {
    'use strict';
    
    var View = Backbone.View.extend({
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
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            return this;
        }
    });
    
    return View;
});
