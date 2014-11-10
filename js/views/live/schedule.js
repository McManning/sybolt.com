
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/live/schedule.html'
], function($, _, Backbone, liveScheduleTemplate) {
    'use strict';
    
    var LiveScheduleView = Backbone.View.extend({
        template: _.template(liveScheduleTemplate),
        
        initialize: function() {
            // Collection stuff
        },
        
        close: function() {
            this.remove();
        },
        
        render: function() {
            
            this.$el.html(this.template({
                // ...
            }));
            
            return this;
        }
    });
    
    return LiveScheduleView;
});
