
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/live/viewers.html'
], function($, _, Backbone, liveViewersTemplate) {
    'use strict';
    
    var LiveViewersView = Backbone.View.extend({
        template: _.template(liveViewersTemplate),
        
        initialize: function() {
            // Collection stuff
            
            this.model.viewers
                .on('add', this.onAddViewer, this)
                .on('remove', this.onRemoveViewer, this)
                .on('change', this.onUpdateViewer, this)
                .on('reset', this.onClearViewers, this);
        },
        
        close: function() {
            
            this.model.viewers
                .off('add', this.onAddViewer)
                .off('remove', this.onRemoveViewer)
                .off('change', this.onUpdateViewer)
                .off('reset', this.onClearViewers);
        
            this.remove();
        },
        
        onAddViewer: function(profile) {
            console.log('ADD VIEWER: ', profile);
            
            // Redraw updated list
            this.render();
        },
        
        onRemoveViewer: function(profile) {
            console.log('REMOVE VIEWER: ', profile);
            
            // Redraw updated list
            this.render();
        },
        
        onUpdateViewer: function(profile) {
            console.log('UPDATE VIEWER: ', profile);
            
            // Redraw updated list
            this.render();
        },
        
        onClearViewers: function() {
            
            this.render();
        },
        
        render: function() {
            
            // If we have no viewers, hide container element
            if (!this.model.viewers.models || this.model.viewers.models.length < 1) {
                this.$el.addClass('hidden');
            } 
            else {
                this.$el.removeClass('hidden').html(this.template({
                    viewers: this.model.viewers.models,
                    publisher: this.model.publisher
                }));    
            }

            return this;
        }
    });
    
    return LiveViewersView;
});
