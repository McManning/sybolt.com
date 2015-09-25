/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var    token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var    _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};


$(function() {
    var currentScheduleDate = new Date();
    var publishing = false;

    loadScheduleMonth(currentScheduleDate);

    $('.modal-trigger').leanModal();
    $('.modal-trigger').click(function(e) {
        e.preventDefault();
        return false;
    });

    function updateHeader() {
        if (window.scrollY > $('#player-container').height() - 100) {
            $('header').removeClass('transparent');
        } else {
            $('header').addClass('transparent');
        }
    }

    function startStream(json) {
        publishing = true;

        // Hide any error messages, and activate our player
        $('#live-error').hide();
        $('#live-offline').hide();
        $('#live-player-container').show();

        if (!$f('live-player') || !$f('live-player').isLoaded()) {
            // If we're not loaded yet, configure a new player instance
            console.log('Initializing player');
            
            $f('live-player', {
                src:"http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf",
                wmode: "opaque" // This allows the HTML to hide the flash content
            }, {
                clip: {
                    url: json.stream_path,
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
                        netConnectionUrl: json.rtmp_url,
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
            $f('live-player').play({url: json.stream_path});
            
        } else if (!$f('live-player').isPlaying()) {
            // @todo source switching, if the new stream_path is different
            console.log('Loading Source playback');
            
            // If it's already loaded, just play the specified stream
            $f('live-player').play({url: json.stream_path});
        }
    }

    function stopStream() {

        if (publishing) {
            publishing = false;
            // @todo stop calling this if we're already offline
        
            // Hide any error/player, and show the generic offline message
            $('#live-error').hide();
            $('#live-player-container').hide();
            $('#live-offline').show();
            
            // Stop playback
            if ($f('live-player')) {
                $f('live-player').stop();
            }
        }
        
        // @todo update viewer count and icons
    }   

    function updateViewers(viewers) {

        if (viewers.length > 0) {
            $('header .logo-badge')
                .show()
                .html(viewers.length + ' viewer' + (viewers.length > 1 ? 's' : ''));
        } else {
            $('header .logo-badge').hide();
        }
    }

    function setStreamError(error) {
        // Show an error message
        $('#live-offline').hide();
        $('#live-player-container').hide();
        $('#live-error')
            .show()
            .find('h1')
                .html('Connection Error: ' + error);
  
        // Stop playback
        if ($f('live-player')) {
            $f('live-player').stop();
        }
    }

    function onWindowResize() {
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
    }

    function updateLiveStatus() {
        
        $.getJSON('http://dev.sybolt.com:25554/live')
            .done(function(json) {
                console.log(json);

                // {"publishing": false, "rtmp_url": "rtmp://dev.sybolt.com:1935/live"}
                // {"publisher": {"ip": "75.118.83.160", "online": true, "id": "11266045856", "name": "Publisher"}, "publishing": true, "rtmp_url": "rtmp://dev.sybolt.com:1935/live", "clients": [], "stream_path": "test", "video": {"width": "1280", "codec": "H264", "frame_rate": "25", "height": "720"}, "audio": {"channels": "2", "profile": "LC", "codec": "AAC", "sample_rate": "48000"}}
                // {"publisher": {"ip": "75.118.83.160", "online": true, "id": "21266045856", "name": "Publisher"}, "publishing": true, "rtmp_url": "rtmp://dev.sybolt.com:1935/live", "clients": [{"ip": "73.178.208.242", "online": true, "id": "11236455666", "name": "Viewer 73.178.208.242"}], "stream_path": "test", "video": {"width": "1280", "codec": "H264", "frame_rate": "25", "height": "720"}, "audio": {"channels": "2", "profile": "LC", "codec": "AAC", "sample_rate": "48000"}}
                if (json.error) {
                    setStreamError(json.error);
                } else {

                    if (json.publishing && !publishing) {
                        startStream(json);
                    }

                    if (!json.publishing && publishing) {
                        stopStream();
                        updateViewers([]);
                    }

                    if (json.clients) {
                        updateViewers(json.clients);
                    }
                }
            })
            .fail(function() {
                setStreamError('Error while syncing to Live API');
            });

        setTimeout(updateLiveStatus, 5000);
    }

    $(window).on('resize.live', onWindowResize);

    // Note: we run onWindowResize() twice at startup because the first
    // calculates container size without browser scrollbars, and the
    // second factors in the new scrollbar size and resizes correctly
    onWindowResize();
    onWindowResize();
    updateLiveStatus();

    // TODO: optimize!
    $(window).scroll(function() {
        updateHeader();
    });
    updateHeader();

    /**
     *
     * @param {Date} date being displayed
     * @param {html} html body content
     */
    function updateSchedule(date, html) {
        currentScheduleDate = new Date(date.getTime());

        // TODO: Some animation crap to update the body and links

        // Trash the old page 
        var $oldPage = $('.schedule-page');

        $oldPage.parent().append(html);
        $oldPage.slideUp(200, function() { $(this).remove(); });

        // Update navigation buttons
        $('#this-month').html(date.format('mmmm yyyy'));

        date.setMonth(date.getMonth() + 1);
        $('#next-month').html(date.format('mmmm yyyy'));

        date.setMonth(date.getMonth() - 2);
        $('#last-month').html(date.format('mmmm yyyy'));
    
    }

    /**
     * Request HTML partial from 
     */
    function loadScheduleMonth(date) {

        $.get('/live/schedule/' + (date.getMonth() + 1) + '/' + (date.getFullYear()))
            .done(function(content) {
                updateSchedule(date, content);
            })
            .fail(function() {
                alert('Failed to load schedule page');
            })
            .always(function() {
                // nop
            });
    }

    // Schedule navigation
    $('#next-month').click(function() {

        var date = new Date(currentScheduleDate.getTime());
        date.setMonth(date.getMonth() + 1);

        loadScheduleMonth(date);
        return false;
    });

    $('#last-month').click(function() {

        var date = new Date(currentScheduleDate.getTime());
        date.setMonth(date.getMonth() - 1);

        loadScheduleMonth(date);
        return false;
    });

});
