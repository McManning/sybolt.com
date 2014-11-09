
require.config({
    //baseUrl: '../',
    paths: {
        jquery: 'libs/jquery-2.1.1',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/text',
        templates: '../templates',
        flowplayer: '//releases.flowplayer.org/js/flowplayer-3.2.13'
    },
    shim: {
        // Non-AMD scripts wrapped with the shim
        'flowplayer': {
            exports: 'Flowplayer'
        }
    }
});

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'views/header',
    'views/footer'
], function($, _, Backbone, Router, HeaderView, FooterView) {
    'use strict';
    
    window.App = {
        
        initialize: function() {
        
            // Setup Header/Footer views
            this.headerView = new HeaderView();
            this.footerView = new FooterView();
            
            console.log('starting router');
            
            // Set up router to switch between content views
            this.router = new Router;
            
            if (!Backbone.history.start({
                pushState: true, 
                root: '/' // '/sybolt-backbone/'
            })) {
                console.log('Initial url does not match in router');
            }
            
            // Draw header
            this.headerView.render();
        
            // Draw footer
            this.footerView.render();
        
            // Override anchors to utilize Backbone's navigation
            $(document).on("click", "a:not([data-bypass])", function(e) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
                var root = location.protocol + "//" + location.host + Backbone.history.options.root;

                if (href.prop && href.prop.slice(0, root.length) === root) {
                    e.preventDefault();
                    Backbone.history.navigate(href.attr, true);
                }
            });
        },
        
        setContentView: function(view) {
            
            if (this.contentView) {
                this.contentView.setElement(null);
                this.contentView.close();
            }
            
            this.contentView = view;
            this.contentView.setElement($('#content')).render();
            
            // @todo whatever post-processing that we must perform after changing the page
        }
    };
    
    App.initialize();
    
    return App;
});
