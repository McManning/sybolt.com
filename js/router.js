
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
            'privacy': 'privacy',
            ':section(/:subsection)': 'generic',

            // Default (unrecognized route)
            '*actions': 'notfound'
        },

        /**
         * Generic route that'll take any one or two-level flat url and 
         * route it to the appropriate view.
         */
        generic: function(section, subsection) {

            // translate the request into a view js file
            var view = 'views/' + section;
            if (subsection) {
                view += '/' + subsection;
            } 
            else { // Without a subsection, assume index.
                view += '/index';
            }

            // Require the desired view
            // TODO: Catch script load errors. 
            require([view, 'app'], function(View, App) {

                if (View) {
                    App.setContentView(new View());
                } 
                else {

                    // Invalid view, go to the 404 page.
                    require(['views/notfound', 'app'], function(NotFoundView, App) {
            
                        console.log('loading 404 view');
                        App.setContentView(new NotFoundView());
                    });
                }
            });
        },
        
        privacy: function() {
            require(['views/privacy', 'app'], function(View, App) {
                App.setContentView(new View());
            });
        },
        
        notfound: function() {
            require(['views/notfound', 'app'], function(View, App) {
                App.setContentView(new View());
            });
        }
    });
    
    return Router;
});
