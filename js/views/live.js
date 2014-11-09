
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'flowplayer',
    'views/live/viewers',
    'views/live/schedule',
    'text!templates/live/index.html'
], function($, _, Backbone, App, Flowplayer, LiveViewersView, LiveScheduleView, liveTemplate) {
    'use strict';
    
    var LiveView = Backbone.View.extend({
        template: _.template(liveTemplate),
        
        initialize: function() {
            
            // Sub-views associated with our Live page
            // Each acting independently of the main page.
            this.liveViewersView = new LiveViewersView();
            this.liveScheduleView = new LiveScheduleView();
            
            $(window).on('resize', this.onWindowResize);
            
            // @todo move this to whenever render() is first called.
            // Otherwise we're trying to access elements that don't exist.
            var self = this;
            this.updateInterval = setInterval(function() {
                self.updateLiveStatus();
            }, 5000);
        },
        
        close: function() {
            
            $(window).off('resize', this.onWindowResize);
            clearInterval(this.updateInterval);
            
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
        
        updateLiveStatus: function() {
            
            $.getJSON('http://mumble.sybolt.com:25554/live', function(response) {
               
                if ('error' in response) { // Connection failure with the RTMP status service
                    // Show an error message
                    $('#live-offline').hide();
                    $('#live-player').hide();
                    $('#live-error')
                        .show()
                        .find('h1')
                            .html('Connection Error: ' + response.error);
              
                    // Stop playback
                    if (window.$f('live-player')) {
                        window.$f('live-player').stop();
                    }
                    
                } else if (response.publishing) { // Stream is online! :D
                    
                    // Hide any error messages, and activate our player
                    $('#live-error').hide();
                    $('#live-offline').hide();
                    $('#live-player').show();

                    flowplayer(function (api, root) { 
                        api.bind("ready", function () { 
                            root.off("click"); 
                        }); 
                    });
                    
                    if (!window.$f('live-player') || !window.$f('live-player').isLoaded()) {
                        // If we're not loaded yet, configure a new player instance
                                    
                        window.$f('live-player', "http://releases.flowplayer.org/swf/flowplayer-3.2.16.swf", {
                            clip: {
                                url: response.stream_path,
                                live: true,
                                scaling: "fit",
                                provider: "rtmp",
                                autoPlay: true
                            },
                            /*onError: function (errorCode, errorMessage) {
                                alert(errorMessage);
                            },
                            onBufferEmpty: function() {
                                alert('bufemp');
                            },*/
                            plugins: {
                                rtmp: {
                                    url: "flowplayer.rtmp-3.2.12.swf",
                                    netConnectionUrl: response.rtmp_url,
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
                                    play: true,
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
                        
                    } else if (!window.$f('live-player').isPlaying()) {
                        // @todo source switching, if the new stream_path is different
                        
                        // If it's already loaded, just play the specified stream
                        window.$f('live-player').play({url: response.stream_path});
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
                    
                } else { // Stream is offline 
                    
                    // Hide any error/player, and show the generic offline message
                    $('#live-error').hide();
                    $('#live-player').hide();
                    $('#live-offline').show();
                    
                    // Stop playback
                    if (window.$f('live-player')) {
                        window.$f('live-player').stop();
                    }
                    
                    // @todo update viewer count and icons
                }
            })
            .error(function() {
                // Show an error message
                $('#live-offline').hide();
                $('#live-player').hide();
                $('#live-error')
                    .show()
                    .find('h1')
                        .html('Connection Error: Could not connect to the Sybolt Live API');
          
                // Stop playback
                if (window.$f('live-player')) {
                    window.$f('live-player').stop();
                }
            });
        }
    });
    
    return LiveView;
});
