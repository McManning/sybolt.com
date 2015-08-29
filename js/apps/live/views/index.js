
define([
    'jquery',
    'underscore',
    'backbone',
    'flowplayer',
    'live/models/live',
    'live/views/viewers',
    'live/views/schedule',
    'live/views/request',
    'text!live/templates/index.html'
], function($, _, Backbone, Flowplayer, LiveAPI,
            Viewers, Schedule, Request, Template) {

    var LiveView = Backbone.View.extend({
        template: _.template(Template),
        
        events: {
            'click .show-schedule': 'onClickShowSchedule',
            'click .show-request': 'onClickShowRequest'
        },

        initialize: function() {
            this.model = new LiveAPI();
            this.model
                .on('change:publishing', this.onPublish, this)
                .on('change:error', this.onError, this);
            
            // TODO: Fix this. Publisher starts null!
            //this.model.publisher.on('change', this.onUpdatePublisher, this);
            
            // Sub-views associated with our Live page
            // Each acting independently of the main page.
            this.Viewers = new Viewers({model: this.model });
            this.Schedule = new Schedule({model: this.model });
                     
            $(window).on('resize.live', _.bind(this.onWindowResize, this));

            this.model.startPolling();

        },
        
        close: function() {
            // Unbind events
            $(window).off('resize.live');
            $(window).off('scroll.live');

            this.model.stopPolling();

            // Destroy sub views
            this.Viewers.close();
            this.Schedule.close();
            
            // TODO: Remove this placement. Transparent transitions should be general purpose
            $('#header').removeClass('transparent'); // In case they leave the page prior to scrolling

            this.remove(); // finally destroy this
        },
        
        onClickShowRequest: function() {

            // Load the view into memory, if not already and call render() once
            if (!this.Request) {
                this.Request = new Request({model: this.model });
                this.Request.setElement(
                    this.$('#request-view-container')
                ).render();
            }
            
            // Hide schedule and show request
            this.$el.find('#schedule-view-container').hide();
            this.$el.find('#request-view-container').show();
            return false;
        },  

        onClickShowSchedule: function() {

            // Load the view into memory, if not already and call render() once
            if (!this.Schedule) {
                this.Schedule = new Schedule({model: this.model });
                this.Schedule.setElement(
                    this.$('#schedule-view-container')
                ).render();
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
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            Sybolt.header.setStyle('live');
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            // Render sub views 
            this.Viewers.setElement(
                this.$('#viewers-view-container')
            ).render();

            this.Schedule.setElement(
                this.$('#schedule-view-container')
            ).render();

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
