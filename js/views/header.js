
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html'
], function($, _, Backbone, headerTemplate) {
    'use strict';
    
    var HeaderView = Backbone.View.extend({
        
        el: $('#header'),
        template: _.template(headerTemplate),
        style: 'default',
        
        events: {
            "click .header-logo": "goHomeAction"
        },
        
        goHomeAction: function() {
            // Navigate back to the home page
            App.router.navigate("home", {trigger: true});
        },
        
        render: function() {
            
            var data = {style: this.style};
            var compiled = this.template(data);
            
            this.$el.html(compiled);
            
            return this;
        },
        
        setStyle: function(style) {
            console.log('Setting style to ' + style);
            
            // Perform an animated transition, rather than re-rendering
            
            // Swap style CSS
            this.$el
                .removeClass(this.style + '-style')
                .addClass(style + '-style');
            
            if (style == 'live') {
                this.$('.header-logo').css('margin-left', '35px');
            } else {
                this.$('.header-logo').css('margin-left', '');
            }
            
            this.style = style;
            
            //this.render();
            return this;
        }
    });
    
    return HeaderView;
});
