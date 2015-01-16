
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/home/index.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        initialize: function() {
            
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('home');
            App.footerView.setStyle('home');
            
            App.headerView.showNavigation();
            
            var data = {};
            var compiled = this.template(data);
            
            this.$el.html(compiled);
            
            return this;
        }
    });
    
    return View;
});
