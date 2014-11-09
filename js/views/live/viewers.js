
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    'use strict';
    
    var LiveViewersView = Backbone.View.extend({
        
        initialize: function() {
            // Collection stuff
            
            this.model.viewers
                .on('add', this.onAddViewer, this)
                .on('remove', this.onRemoveViewer, this)
                .on('change', this.onUpdateViewer, this);
        },
        
        onAddViewer: function(profile) {
            console.log('ADD VIEWER: ', profile);
        },
        
        onRemoveViewer: function(profile) {
            console.log('REMOVE VIEWER: ', profile);
        },
        
        onUpdateViewer: function(profile) {
            console.log('UPDATE VIEWER: ', profile);
        },
        
        close: function() {
            
            this.model.viewers.off('add', this.onAddViewer);
        
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
