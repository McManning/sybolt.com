
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'views/live/viewers',
    'views/live/schedule',
    'text!templates/live/index.html'
], function($, _, Backbone, App, LiveViewersView, LiveScheduleView, liveTemplate) {
    'use strict';
    
    var LiveView = Backbone.View.extend({
        template: _.template(liveTemplate),
        
        initialize: function() {
            
            // Sub-views associated with our Live page
            // Each acting independently of the main page.
            this.liveViewersView = new LiveViewersView();
            this.liveScheduleView = new LiveScheduleView();
        },
        
        close: function() {
            
            // See: http://andrewhenderson.me/tutorial/how-to-detect-backbone-memory-leaks/
            // And: http://metametadata.wordpress.com/2013/06/17/backbone-js-1-0-0-nested-view-memory-leak/
            console.log('Kill: ', this);
            
            // Destroy sub views
            this.liveViewersView.close();
            this.liveScheduleView.close();
            
            this.remove(); // Destroy this
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('live');
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            this
                .renderSubview(this.liveViewersView, '.viewers')
                .renderSubview(this.liveScheduleView, '.schedule');
            
            return this;
        },
        
        renderSubview: function(view, selector) {
        
            // See: http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
            view.setElement(this.$(selector)).render();
            return this;
        }
    });
    
    return LiveView;
});
