
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'collections/profiles',
    'text!templates/test.html',
], function($, _, Backbone, App, ProfilesCollection, testTemplate) {
    'use strict';
    
    var TestView = Backbone.View.extend({
        template: _.template(testTemplate),

        events: {
            "click #testLink": "testLinkAction"
        },
        
        testLinkAction: function() {
            alert('test link!');
        },
        
        initialize: function() {
            
            this.collection = new ProfilesCollection();
            //this.collection.add({ id: 1, name: 'Chase' });
            //this.collection.add({ id: 2, name: 'Mark Meltzer' });
            
            // Force a redraw of the view whenever our collection changes
            this.collection.bind("change add remove reset", this.render, this);
            
            this.collection.fetch({
                success: function(collection, response) {
                
                    // Redraw our view with the updated collection
                   //self.render();
                },
                error: function(collection, response) {
                    alert('shit went wrong');
                }
            });
        },
        
        close: function() {
            
            // See: http://andrewhenderson.me/tutorial/how-to-detect-backbone-memory-leaks/
            // And: http://metametadata.wordpress.com/2013/06/17/backbone-js-1-0-0-nested-view-memory-leak/
            console.log('Kill: ', this);
            
            this.collection.reset(); // Clear collection of profiles
            this.remove(); // Destroy this
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            
            var data = {}; // do stuff
            var compiled = this.template({
                message: 'Hello world!',
                profiles: this.collection.models
            });
            
            this.$el.html(compiled);
            return this;
        }
    });
    
    return TestView;
});
