
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/home.html'
], function($, _, Backbone, App, homeTemplate) {
    'use strict';
    
    var HomeView = Backbone.View.extend({
        template: _.template(homeTemplate),
        
        initialize: function() {
            
            // Will have sub-views associated with it. Or something.
        },
        
        close: function() {
            
            // See: http://andrewhenderson.me/tutorial/how-to-detect-backbone-memory-leaks/
            // And: http://metametadata.wordpress.com/2013/06/17/backbone-js-1-0-0-nested-view-memory-leak/
            console.log('Kill: ', this);
            
            this.remove(); // Destroy this
        },
        
        render: function() {
            
            var data = {};
            var compiled = this.template(data);
            
            this.$el.html(compiled);
            
            return this;
        }
    });
    
    return HomeView;
});
