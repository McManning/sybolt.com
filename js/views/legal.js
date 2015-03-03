
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/legal.html',
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        subsection: 'terms',
        
        setSubsection: function(subsection) {
            if (subsection) {
                this.subsection = subsection;
            }
        },

        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            
            this.$el.html(this.template({
                subsection: this.subsection
            }));
            
            return this;
        }
    });
    
    return View;
});
