
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
            "click .header-logo": "goHomeAction",
            "click #mmm-hamburgers": "toggleNavigation"
        },
        
        goHomeAction: function() {
            // Navigate back to the home page
            App.router.navigate("home", {trigger: true});
            return false;
        },

        toggleNavigation: function() {
            $('#header').toggleClass('open');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').toggleClass('open');
            $('#mmm-hamburgers').toggleClass('open');

            return false;
        },

        showNavigation: function() {
            $('#header').addClass('open');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').addClass('open');
            $('#mmm-hamburgers').addClass('open');

            return false;
        },

        hideNavigation: function() {
            $('#header').removeClass('open');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').removeClass('open');
            $('#mmm-hamburgers').removeClass('open');

            return false;
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

            this.hideNavigation();
            
            //this.render();
            return this;
        }
    });
    
    return HeaderView;
});
