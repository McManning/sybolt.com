
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/minecraft/index.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            "click .scroll-up": "scrollUp"
        },
        
        initialize: function() {
            
            $(window).on('resize.calico-hero', _.bind(this.onWindowResize, this));
            $(window).on('scroll.minecraft-header', _.bind(this.onWindowScroll, this));

            // Since we're a full page view, force the window to the top.
            $(window).scrollTop(0);
        },

        close: function() {
            $(window).off('resize.calico-hero');
            $(window).off('scroll.minecraft-header');
            this.remove();
        },
        
        /** 
         * Action for clicking the arrow up at the bottom of the page.
         * Performs a gradual scroll back to the top.
         */
        scrollUp: function() {
            $('html, body').animate({
                scrollTop: $(".content-left.residents").offset().top - 60
            }, 800);

            return false;
        },
        
        /**
         * JS hack to ensure the calico hero is repositioned accordingly when
         * the page aspect ratio changes too dramatically. I would MUCH rather this
         * be a pure CSS option, but I haven't figured out a solution yet :(
         */
        onWindowResize: function() {

            var calicoImageRatio = (790/1672);
            
            var desiredCalicoHeight = $('.full-page').width() * calicoImageRatio;
            var top = $('.content-container-top').position().top;
            
            console.log('Desired: ' + desiredCalicoHeight + ' Actual: ' + $('.calico').height() + ' Top: ' + top);
            
            if (top > desiredCalicoHeight) {
                $('.calico').parent().addClass('centerer');
            } else {
                $('.calico').parent().removeClass('centerer');
            }

            // Also fire off the scroll watcher to check for any positional changes
            this.onWindowScroll();
        },

        /**
         * Modify the opacity of the header based on our current scroll position
         */
        onWindowScroll: function() {

            var eTop = $('.content-container-top').offset().top; //get the offset top of the element
            
            var top = eTop - $(window).scrollTop();
            
            if (top < 80) {
                $('#header').removeClass('transparent');
            } else {
                $('#header').addClass('transparent');
            }
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('minecraft');
            
            this.$el.html(this.template({
                // vars here...
            }));

            // Ensure our elements are positioned accordingly
            this.onWindowResize();
            
            return this;
        }
    });
    
    return View;
});
