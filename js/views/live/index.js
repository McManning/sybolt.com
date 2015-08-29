
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'flowplayer',
    'models/live',
    'views/live/viewers',
    'views/live/schedule',
    'views/live/request',
    'text!templates/live/index.html'
], function($, _, Backbone, App, Flowplayer, LiveModel,
            LiveViewersView, LiveScheduleView, LiveRequestView, liveTemplate) {
            
    'use strict';
    
    var LiveView = App.View.extend({
        template: _.template(liveTemplate),
        
        events: {
            'click .show-schedule': 'onClickShowSchedule',
            'click .show-request': 'onClickShowRequest'
        },

        initialize: function() {
            this.model = new LiveModel();
            this.model
                .on('change:publishing', this.onPublish, this)
                .on('change:error', this.onError, this);
            
            this.model.publisher.on('change', this.onUpdatePublisher, this);
            
            // Sub-views associated with our Live page
            // Each acting independently of the main page.
            this.liveViewersView = new LiveViewersView({model: this.model });
            this.liveScheduleView = new LiveScheduleView({model: this.model });
                     
            $(window).on('resize.live-feed', _.bind(this.onWindowResize, this));
            $(window).on('scroll.live-feed', _.bind(this.onWindowScroll, this));

            this.model.startPolling();

        },
        
        close: function() {
            $(window).off('resize.live-feed');
            $(window).off('scroll.live-feed');

            this.model.stopPolling();

            // Destroy sub views
            this.liveViewersView.close();
            this.liveScheduleView.close();
            
            // TODO: Remove this placement. Transparent transitions should be general purpose
            $('#header').removeClass('transparent'); // In case they leave the page prior to scrolling

            this.remove();
        },
        
        onClickShowRequest: function() {

            // Load the view into memory, if not already and call render() once
            if (!this.liveRequestView) {
                this.liveRequestView = new LiveRequestView({model: this.model });
                this.renderSubview(this.liveRequestView, '#request-view-container');
            }
            
            // Hide schedule and show request
            this.$el.find('#schedule-view-container').hide();
            this.$el.find('#request-view-container').show();
            return false;
        },  

        onClickShowSchedule: function() {

            // Load the view into memory, if not already and call render() once
            if (!this.liveScheduleView) {
                this.liveScheduleView = new LiveScheduleView({model: this.model });
                this.renderSubview(this.liveScheduleView, '#schedule-view-container');
            }
            
            // Hide request and show schedule
            this.$el.find('#request-view-container').hide();
            this.$el.find('#schedule-view-container').show();
            return false;
        },

        /**
         * Event listener for when the stream publisher updates.
         * This should update the UI display of the person publishing
         */
        onUpdatePublisher: function(profile) {
            
            if (profile.get('online') === true) {
                // @todo impl. For now, a simple update of the publisher's name.
                this.$('.live-publisher')
                    .removeClass('hidden');
                    //.html(profile.get('name'));
                
            } else {
                // Hide publisher
                this.$('.live-publisher')
                    .addClass('hidden');
                
            }
        },
            
        onPublish: function() {
            console.log('ON PUBLISH: ', this.model.get('publishing'));
            
            if (this.model.get('publishing') === true) {
                // Turn on the stream
                this.startRtmpPlayback(
                    this.model.get('stream_path'), 
                    this.model.get('rtmp_url')
                );
                
            } else {
                // Shut down the stream
                this.stopPlayback();
            }
        },
        
        onError: function() {
            console.log('ON ERROR: ', this.model.get('error'));
            
            if (this.model.get('error') !== undefined) {
                // Kill playback and show the error message
                this.showPlayerError(this.model.get('error'));
                
            } else {
                // Hide error
                this.stopPlayback();
            }
        },
        
        /**
         * Modify the opacity of the header based on our current scroll position
         */
        onWindowScroll: function() {
            /* Unused, we have a fixed header .. :\
            var scrollTop = $(window).scrollTop();
            
            if (scrollTop < 100) {
                $('#header').removeClass('transparent');
            } else {
                $('#header').addClass('transparent');
            }*/
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('live');
            App.footerView.setStyle('default');
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            this
                .renderSubview(this.liveViewersView, '#viewers-view-container')
                .renderSubview(this.liveScheduleView, '#schedule-view-container');
            
            // Note the call here happens twice because the first call
            // will end up resizing the browser past the window height, thus forcing
            // a scrollbar to appear if not already, and changing the actual dimensions.
            // The second call is made to correct the player size based on these new dimensions.
            this.onWindowResize();
            this.onWindowResize();
            
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

            // Also fire off the scroll watcher to check for any positional changes
            this.onWindowScroll();
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
            $('#live-error').addClass('hidden');
            $('#live-offline').addClass('hidden');
            $('#live-player-container').removeClass('hidden');

            if (!$f('live-player') || !$f('live-player').isLoaded()) {
                // If we're not loaded yet, configure a new player instance
                console.log('Initializing player');
                
                $f('live-player', {
                    src:"http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf",
                    wmode: "opaque" // This allows the HTML to hide the flash content
                }, {
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
                            url: "flowplayer.rtmp-3.2.13.swf",
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
                
                // FORCE clip playback (as sometimes it doesn't auto-play when loaded)
                $f('live-player').play({url: streamPath});
                
            } else if (!$f('live-player').isPlaying()) {
                // @todo source switching, if the new stream_path is different
                console.log('Loading Source playback');
                
                // If it's already loaded, just play the specified stream
                $f('live-player').play({url: streamPath});
            }
        },
        
        /**
         * Throw our player into an error state, displaying the error
         * message in replace of the stream player. 
         *
         * @param string error
         */ 
        showPlayerError: function(error) {
            // Show an error message
            $('#live-offline').addClass('hidden');
            $('#live-player-container').addClass('hidden');
            $('#live-error')
                .removeClass('hidden')
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
            $('#live-error').addClass('hidden');
            $('#live-player-container').addClass('hidden');
            $('#live-offline').removeClass('hidden');
            
            // Stop playback
            if ($f('live-player')) {
                $f('live-player').stop();
            }
            
            // @todo update viewer count and icons
        }
        
    });
    
    return LiveView;
});
