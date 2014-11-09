
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'flowplayer',
    'models/live',
    'views/live/viewers',
    'views/live/schedule',
    'text!templates/live.html'
], function($, _, Backbone, App, Flowplayer, LiveModel,
            LiveViewersView, LiveScheduleView, liveTemplate) {
            
    'use strict';
    
    var LiveView = Backbone.View.extend({
        template: _.template(liveTemplate),
        
        initialize: function() {
            this.model = new LiveModel();
            
            // Sub-views associated with our Live page
            // Each acting independently of the main page.
            this.liveViewersView = new LiveViewersView();
            this.liveScheduleView = new LiveScheduleView();
            
            $(window).on('resize', this.onWindowResize);
        },
        
        close: function() {
            
            $(window).off('resize', this.onWindowResize);
            
            // Destroy sub views
            this.liveViewersView.close();
            this.liveScheduleView.close();
            
            this.remove(); // Destroy this
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('live');
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            this
                .renderSubview(this.liveViewersView, '.viewers')
                .renderSubview(this.liveScheduleView, '.schedule');
            
            // Rescale players
            this.onWindowResize();
            
            return this;
        },
        
        renderSubview: function(view, selector) {
        
            // See: http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
            view.setElement(this.$(selector)).render();
            return this;
        },
        
        onWindowResize: function() {
            
          //  $('#player-container')
           //     .height($(window).width() / 1.778);
                
          //  $('#live-player-container')
           //     .css('max-width', $('#sybolt-app').height() * 1.778);
           
            var wh = $(window).height();
            var ww = $(window).width();

            if ((ww / wh) > 1.7778) {
                // it's widescreen, max height to window height
                $('#player-container')
                    .height(wh)
                    .width(ww);
                    
                // Inner video player must maintain aspect ratio
                $('#live-player-container')
                    .height(wh)
                    .width(wh * 1.7778);
                    
            } else {
                // If smaller, ensure the container has a 1.7778 ratio
                $('#player-container')
                    .height(ww / 1.7778)
                    .width(ww);
                    
                // Inner video player matches container dimensions
                $('#live-player-container')
                    .height(ww / 1.7778)
                    .width(ww);
            }

        },
        
        /**
         * Start our player as an RTMP stream. If the player has not been 
         * initialized yet, this'll initialize. Otherwise, this will change 
         * the stream clip to our RTMP source.
         *
         * @param string streamPath 
         * @param string rtmpUrl
         */
        startRtmpPlayback: function(streamPath, rtmpUrl) {
            
            // Hide any error messages, and activate our player
            $('#live-error').hide();
            $('#live-offline').hide();
            $('#live-player').show();

            if (!$f('live-player') || !$f('live-player').isLoaded()) {
                // If we're not loaded yet, configure a new player instance
                            
                $f('live-player', "http://releases.flowplayer.org/swf/flowplayer-3.2.16.swf", {
                    clip: {
                        url: streamPath,
                        live: true,
                        scaling: "fit",
                        provider: "rtmp",
                        autoPlay: true
                    },
                    onBeforePause: function() {
                        return false;
                    },
                    plugins: {
                        rtmp: {
                            url: "flowplayer.rtmp-3.2.12.swf",
                            netConnectionUrl: rtmpUrl,
                            inBufferSeek: false
                        },
                        controls: {
                            backgroundColor: 'transparent',
                            backgroundGradient: 'none',
                            progressColor:'#685475',
                            bufferColor: '#dfcd6a',
                            autoHide: true,
                            
                            // Control hiding 
                            all: false,
                            play: false,
                            volume: true,
                            mute: true,
                            time: false,
                            fullscreen: true,
                            scrubber: true,
                            scrubberHeightRatio: 0.1,
                            scrubberBarHeightRatio: 0.1,
                            sliderColor: '#ffffff'
                        }
                        
                    },
                    canvas: {
                        backgroundColor: '#2e2c2a',
                        backgroundGradient: 'none'
                    }
                });
                
            } else if (!$f('live-player').isPlaying()) {
                // @todo source switching, if the new stream_path is different
                
                // If it's already loaded, just play the specified stream
                $f('live-player').play({url: streamPath});
            }
            
            // @todo update viewer count and icons
            /*if (response.clients.length < 1) { 
                viewersString = "NO VIEWERS";
            } else if (response.clients.length == 1) {
                viewersString = "1 VIEWER";
            } else {
                viewersString = response.clients.length + " VIEWERS";
            }
            $('div.schedule > h1').html(viewersString);
            */
                    
        },
        
        /**
         * Throw our player into an error state, displaying the error
         * message in replace of the stream player. 
         *
         * @param string error
         */ 
        showPlayerError: function(error) {
            // Show an error message
            $('#live-offline').hide();
            $('#live-player').hide();
            $('#live-error')
                .show()
                .find('h1')
                    .html('Connection Error: ' + error);
      
            // Stop playback
            if ($f('live-player')) {
                $f('live-player').stop();
            }
        },
        
        /**
         * Throw our player into an "offline" state. This would occur
         * when there are no RTMP stream publishers detected.
         */
        stopPlayback: function() {
            // @todo stop calling this if we're already offline
        
            // Hide any error/player, and show the generic offline message
            $('#live-error').hide();
            $('#live-player').hide();
            $('#live-offline').show();
            
            // Stop playback
            if ($f('live-player')) {
                $f('live-player').stop();
            }
            
            // @todo update viewer count and icons
        }
        
    });
    
    return LiveView;
});
