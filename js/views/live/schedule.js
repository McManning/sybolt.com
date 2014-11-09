
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    'use strict';
    
    var LiveScheduleView = Backbone.View.extend({
        
        initialize: function() {
            // Collection stuff
        },
        
        close: function() {
            this.remove();
        },
        
        render: function() {
            
            this.$el.html('Schedule (inline html)!');
            
            return this;
        }
    });
    
    return LiveScheduleView;
});
