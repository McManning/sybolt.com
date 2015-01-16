
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/profile/index.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            //"click .scroll-up": "scrollUp"
        },
        
        initialize: function() {
            
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            this.$el.html(this.template({
                // vars here...
            }));

            return this;
        }
    });
    
    return View;
});
