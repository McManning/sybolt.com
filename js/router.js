
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    'use strict';

    // Configure a router for page navigation
    var Router = Backbone.Router.extend({
    
        initialize: function() {
            console.log('router init');
        },
    
        routes: {
            '': 'home',
            'test': 'test',
            'live': 'live',
            'home': 'home',
            'test/:slug': 'testslug',
            
            
            // Default (unrecognized route)
            '*actions': 'notfound'
        },
        
        home: function() {
            require(['views/home', 'app'], function(HomeView, App) {
            
                console.log('loading home view');
                App.setContentView(new HomeView());
            });
        },
        
        live: function() {
            require(['views/live', 'app'], function(LiveView, App) {
            
                console.log('loading live view');
                App.setContentView(new LiveView());
            });
        },
        
        test: function() {
            require(['views/test', 'app'], function(TestView, App) {
            
                console.log('loading test view');
                App.setContentView(new TestView());
            });
        },
        
        notfound: function() {
            require(['views/notfound', 'app'], function(NotFoundView, App) {
            
                console.log('loading 404 view');
                App.setContentView(new NotFoundView());
            });
        },
        
        testslug: function(slug) {
        
            require(['views/test'], function(TestView) {
                
                var testView = new TestView(slug);
                testView.render();
            });
        }
    });
    
    return Router;
});
