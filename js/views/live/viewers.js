
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    'use strict';
    
    var LiveViewersView = Backbone.View.extend({
        
        initialize: function() {
            // Collection stuff
        },
        
        close: function() {
            this.remove();
        },
        
        render: function() {
            
            console.log(this.$el);
            this.$el.html('Live Viewers (inline html)');
            
            return this;
        }
    });
    
    return LiveViewersView;
});
