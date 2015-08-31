
define([
    'jquery',
    'underscore',
    'backbone',
    'text!minecraft/templates/index.html',
    'text!minecraft/templates/timeline.html',
    'minecraft/views/servers',
], function($, _, Backbone, Template, TimelineTemplate, ServersView) {
    'use strict';
    
    var View = Backbone.View.extend({
        template: _.template(Template),
        timelineTemplate: _.template(TimelineTemplate),
        
        events: {
            "click .scroll-up": "scrollUp",
            "click .timeline-scroll-up": "scrollUp",
            "click #toggle-timeline": "toggleTimeline",
            "click #toggle-servers": "toggleServers"
        },
        
        initialize: function() {

            this.serversView = new ServersView();
            
            $(window).on('resize.calico-hero', _.bind(this.onWindowResize, this));
            $(window).on('scroll.minecraft-header', _.bind(this.onWindowScroll, this));
        },

        close: function() {
            $(window).off('resize.calico-hero');
            $(window).off('scroll.minecraft-header');

            // TODO: Remove this placement. Transparent transitions should be general purpose
            $('header').removeClass('transparent'); // In case they leave the page prior to scrolling

            this.remove();
        },

        toggleTimeline: function() {

            var $timeline = $('#timeline');

            if ($timeline.hasClass('hidden')) {
                // Show timeline! @todo animate it to high heaven!
                $timeline.removeClass('hidden');

                // Hide all the other crap!
                //$('#information').addClass('hidden');
                //$('.full-page').addClass('hidden');
                //$('.residents-background-bottom').addClass('hidden');
                //$('#dumb-things').addClass('hidden');
                //$('.scroll-up').addClass('hidden');
            } 
            else {
                // Hide it! @todo animate it 'n shit
                $timeline.addClass('hidden');

                // Bring back all the other crap!
                //$('#information').removeClass('hidden');
                //$('.full-page').removeClass('hidden');
                //$('.residents-background-bottom').removeClass('hidden');
                //$('#dumb-things').removeClass('hidden');
                //$('.scroll-up').removeClass('hidden');
            }

            return false;
        },

        toggleServers: function() {

            var $servers = $('#servers');

            if ($servers.hasClass('hidden')) {
                // Show timeline! @todo animate it to high heaven!
                $servers.removeClass('hidden');
                
                // Also notify the view to retrieve a list of servers
                // @todo this could probably go somewhere better...
                this.serversView.loadServers();
            } 
            else {
                // Hide it! @todo animate it 'n shit
                $servers.addClass('hidden');
            }

            return false;
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
            
            console.log('Desired: ' + desiredCalicoHeight + ' Actual: ' + $('#calico-hero').height() + ' Top: ' + top);
            
            if (top > desiredCalicoHeight) {
                $('#calico-hero').parent().addClass('centerer');
            } else {
                $('#calico-hero').parent().removeClass('centerer');
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
            Sybolt.header.setStyle('minecraft');
            //App.footerView.setStyle('default');
            
            this.$el.html(this.template({
                timeline_template: this.timelineTemplate({

                })
            }));

            // Render our servers out. First call, we won't have data, but that's okay!
            this.serversView.setElement(
                this.$('#servers')
            ).render();

            // Ensure our elements are positioned accordingly
            this.onWindowResize();
            
            return this;
        }
    });
    
    return View;
});
