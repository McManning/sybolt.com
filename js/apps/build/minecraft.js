(function () {
define('text!minecraft/templates/index.html',[],function () { return '<div class="full-page">\r\n    <div class="header-billboard">\r\n        <img id="calico-hero" src="/img/minecraft/calico-hero.jpg">\r\n    </div>\r\n    \r\n    <div class="content-container-top">\r\n\r\n        <!--div class="scroll-down"></div-->\r\n        \r\n        <div id="residents" class="content-left residents">\r\n            <h1>RESIDENTS</h1>\r\n            \r\n            <div class="residents-container">\r\n                <div class="head-icon"><img src="/img/minecraft/heads/head-64_arii.png"></div>\r\n                <div class="head-icon"><img src="/img/minecraft/heads/head-64_gfro.png"></div>\r\n                <div class="head-icon"><img src="/img/minecraft/heads/head-64_ichibod.png"></div>\r\n                <div class="head-icon"><img src="/img/minecraft/heads/head-64_jamacavoy.png"></div>\r\n                <div class="head-icon"><img src="/img/minecraft/heads/head-64_noligorithm.png"></div>\r\n                \r\n                <div class="extra-people">\r\n                    <div class="head-icon"><img src="/img/minecraft/heads/head-64_mrlisten.png"></div>\r\n                    <div class="head-icon"><img src="/img/minecraft/heads/head-64_phantom_theft.png"></div>\r\n                    <div class="head-icon"><img src="/img/minecraft/heads/head-64_deadfoam.png"></div>\r\n                </div>\r\n            </div>\r\n            <small><a href="#">See More</a></small>\r\n\r\n            <div class="clearfix"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class="residents-background-bottom"></div>\r\n\r\n<div class="content-container">\r\n    <div id="information" class="content-right information">\r\n        <h1>INFORMATION</h1>\r\n        \r\n        <div class="server-status-icon">\r\n            <a id="toggle-servers" href="#">\r\n                <img src="/img/minecraft/entities/clock_midnight.png">\r\n                <p>Server Is Offline</p>\r\n            </a>\r\n        </div>\r\n        \r\n        <div class="server-info">\r\n            <ul>\r\n                <li><strong>Server Status:</strong> <span class="pull-right">Offline</span></li>\r\n                <li><strong>Server IP:</strong> <span class="pull-right">127.0.0.1</span></li>\r\n                <li><strong>Client Version:</strong> <span class="pull-right">1.7.2</span></li>\r\n                <li><strong>Online Players:</strong> <span class="pull-right">0/10</span></li>\r\n            </ul>\r\n        </div>\r\n        \r\n        <div class="clearfix"></div>\r\n    </div>\r\n    \r\n    <div id="servers" class="hidden"></div>\r\n    \r\n    <div id="history" class="content-left history">\r\n        <h1>HISTORY</h1>\r\n        \r\n        <div id="event-log">\r\n            <ul>\r\n                <li><img src="/img/minecraft/entities/diamondsword32x32.png"/><p>Gfro got his ass smashed in</p></li>\r\n                <li><img src="/img/minecraft/entities/steve32x32.png"/><p>PhantomTheft has joined the world</p></li>\r\n                <li><img src="/img/minecraft/entities/creeper32x32.png"/><p>Creeper wrecked Chase\'s shit</p></li>\r\n                <li><img src="/img/minecraft/entities/creeper32x32.png"/><p>Creeper wrecked Moontrick\'s shit</p></li>\r\n            </ul>\r\n            <small><a href="/minecraft/events">Read More</a></small>\r\n        </div>\r\n        \r\n        <div class="history-icon">\r\n            \r\n            <a id="toggle-timeline" href="#">\r\n                <img src="/img/minecraft/entities/book_and_quill.png">\r\n                <p>Read The Lore</p>\r\n            </a>\r\n        </div>\r\n        \r\n        <div class="clearfix"></div>\r\n    </div>\r\n\r\n    <%= timeline_template %>\r\n    \r\n    <div id="dumb-things" class="content-right dumb">\r\n        <h1>DUMB THINGS</h1>\r\n        <div class="clearfix"></div>\r\n        \r\n        <div class="events-container">\r\n            <div class="dumb-event">\r\n                <div class="dumb-event-icon"><img src="/img/minecraft/entities/wood_oak.png"></div>\r\n                \r\n                <h2>Times "Getting Wood"</h2>\r\n                <span class="event-info">32</span>\r\n            </div>\r\n            \r\n            <div class="dumb-event">\r\n                <div class="dumb-event-icon"><img src="/img/minecraft/entities/chicken.png"></div>\r\n                \r\n                <h2>Explosive Accidents</h2>\r\n                <span class="event-info">217</span>\r\n            </div>\r\n            \r\n            <div class="dumb-event">\r\n                <div class="dumb-event-icon"><img src="/img/minecraft/entities/skeleton.png"></div>\r\n                \r\n                <h2>Unfortunate Deaths</h2>\r\n                <span class="event-info">8546</span>\r\n            </div>\r\n            \r\n            <div class="dumb-event">\r\n                <div class="dumb-event-icon"><img src="/img/minecraft/entities/heart-full.png"></div>\r\n                \r\n                <h2>Some Big Dumb Event</h2>\r\n                <span class="event-info">10/100</span>\r\n            </div>\r\n        </div>\r\n        \r\n        <div class="clearfix"></div>\r\n    </div>\r\n</div>\r\n\r\n<a class="scroll-up" href="#" title="Top"></a>\r\n';});


define('text!minecraft/templates/timeline.html',[],function () { return '\r\n<div id="timeline" class="timeline-container hidden">\r\n\r\n    <div class="parallax hoth">\r\n        \r\n        <div class="parallax-header">HOTH</div>\r\n        <div class="clearfix"></div>\r\n        \r\n        <div class="timeline-block timeline-start">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/ice32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>A World of Ice</h2>\r\n                <p>The world, in it\'s creation, began frozen. Mankind makes their home in glass domes beneath the earth, designed to magnify solar rays for warmth and agricultural use.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-faith">\r\n                <img src="/img/minecraft/entities/block_of_gold32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Golden Faith</h2>\r\n                <p>The first religion was established. Within the center of the capital, a towering golden beacon was built as an offering to the gods.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Great Divide</h2>\r\n                <p>An unknown force cracks the capital dome in half, exposing it to the harsh outside world. Blame is put on the golden faith. After many losses, the capital populace begin to rebuild.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n\r\n    <div class="parallax swagcraft">\r\n        \r\n        <div class="parallax-header">SWAGCRAFT</div>\r\n        <div class="clearfix"></div>\r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Crucible</h2>\r\n                <p>An unknown craft from another dimension appears above the new capital. Upon it\'s arrival unknown isolated human towns appear, given the name "Prefab Towns". Their purpose is unknown.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-sun">\r\n                <img src="/img/minecraft/entities/sun32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Warming</h2>\r\n                <p>Coinciding with the arrival of the Crucible, the sheets of ice engulfing the world begin to melt and it\'s inhabitants begin moving to the surface.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-faith">\r\n                <img src="/img/minecraft/entities/written_book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Rune Magic</h2>\r\n                <p>Religious practice moved away from construction of gold monuments and into a complicated system of rune magic. Experts in the craft helped shape the world at a much higher rate than previously thought possible.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n\r\n    <div class="parallax franken">\r\n        \r\n        <div class="parallax-header">FRANKEN PC</div>\r\n        <div class="clearfix"></div>\r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/german_french32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Opposing Towns</h2>\r\n                <p>German Town and French Town are established as the capital populace splits into two factions. The towns maintain an wary relationship.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-faith">\r\n                <img src="/img/minecraft/entities/blaze_powder32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Nether</h2>\r\n                <p>Natural ley lines run dry, inevitably causing rune practice to fade away. Once only whispers, Nether worship takes hold of the capital.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-war">\r\n                <img src="/img/minecraft/entities/crossing_swords34x34.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>War</h2>\r\n                <p>Peace between German Town and French Town comes to an end. German Town is found stockpiling explosives, as French Town increases it\'s control of resources for a cultural victory.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/tnt32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Obliteration and Redemption</h2>\r\n                <p>Negotiations fail. German Town detonates their stockpile of explosives and obliterates both towns. Survivors are led to Millenium Bay by the unsung hero, Rape.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n    \r\n    <div class="parallax calico">\r\n        \r\n        <div class="parallax-header">CALICO</div>\r\n        <div class="clearfix"></div>\r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Walled City</h2>\r\n                <p>Titans begin to walk the earth again. Millenium Bay is lost and humanity escapes retreats into the great walled city of Calico.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Cultural Boom</h2>\r\n                <p>With an population growing alarmingly fast, the people divide into new cultures and guilds. Guilds including Men of the Wall, Bounty Hunters, and the Bratva obtain political power.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-faith">\r\n                <img src="/img/minecraft/entities/ocelot32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>First Government</h2>\r\n                <p>The First Government is re-established under Mayor Arii to control the growing political turmoil. Mayor Arii suppresses Nether worship and enforces the common faith of Cats.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-war">\r\n                <img src="/img/minecraft/entities/crossing_swords34x34.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Veryyes</h2>\r\n                <p>A being from another realm enters the walled city and causes the spread of insanity. The city\'s most powerful Cat worshippers call upon ancient powers to seal the Veryyes away forever.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/skeleton32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Scandal</h2>\r\n                <p>Mayor Arii is found as the killer to the first known begins of the Horse Tribe; Adam, Eve, and Lilith. The scandal is quickly forgotten by most, as the capital\'s population decreases dramatically overnight. </p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n    </div>\r\n\r\n    <div class="parallax broville">\r\n        \r\n        <div class="parallax-header">BROVILLE</div>\r\n        <div class="clearfix"></div>\r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Cleansing</h2>\r\n                <p>The long campaign to wipe out the Titans is complete. The capital populace establishes Broville and The Citadel outside the walled city.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/redstone32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Science Boom</h2>\r\n                <p>Medical and Redstone technology peaks. Subway systems and automation expand throughout the cities.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-faith">\r\n                <img src="/img/minecraft/entities/chicken32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>Loss of The Citadel</h2>\r\n                <p>Mayor Arii ignores pleas for help from The Citadel and eventually communication is lost. The last words from the city reported sights of exploding chickens.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block right">\r\n            <div class="timeline-img timeline-war">\r\n                <img src="/img/minecraft/entities/crossing_swords34x34.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Undead Climb</h2>\r\n                <p>Flu spreads throughout the remaining city. What was thought to be a cure ends up animating the dead with powers much greater than the living. Broville is destroyed by it\'s own citizens.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-block">\r\n            <div class="timeline-img timeline-yellow">\r\n                <img src="/img/minecraft/entities/book32x32.png">\r\n            </div>\r\n\r\n            <div class="timeline-content">\r\n                <h2>The Fall</h2>\r\n                <p>Broville is burning. Brocorp tower falls. Nuclear reactors explode. The capital\'s population drops to the single digits. The capital populace once again become wanderers looking for a new home.</p>\r\n                \r\n                <span class="timeline-date">Feb 18</span>\r\n            </div>\r\n        </div>\r\n        \r\n        \r\n        <div class="timeline-end">\r\n            <a href="#" class="timeline-scroll-up">\r\n                <div class="timeline-img timeline-yellow">\r\n                    <img src="/img/minecraft/scroll-up-small.png" />\r\n                </div>\r\n            </a>\r\n        </div>\r\n    \r\n    </div>\r\n\r\n</div>\r\n';});


define('text!minecraft/templates/servers.html',[],function () { return '\r\n<% if (servers.length > 0) { %>\r\n    <% _.each(servers, function(server) { %>\r\n\r\n    <div class="server">\r\n        <img class="server-banner" src="<%= server.banner %>" />\r\n        <div class="server-content">\r\n            <h1><%- server.name.toUpperCase() %></h1>\r\n\r\n            <% if (server.online) { %>\r\n                <h2 class="green">ONLINE NOW</h2>\r\n            <% } %>\r\n\r\n            <div class="server-info">\r\n                <ul>\r\n                <% if (server.online) { %>\r\n                    <li>\r\n                        <strong>Status:</strong>\r\n                        <span class="green pull-right">ONLINE NOW</span>\r\n                    </li>\r\n                <% } else { %>\r\n                    <li>\r\n                        <strong>Last Online:</strong>\r\n                        <span class="pull-right"><%- App.getMoment(server.last_played) %></span>\r\n                    </li> \r\n                <% } %>\r\n\r\n                    <li>\r\n                        <strong>Client Version:</strong>\r\n                        <span class="pull-right"><%- server.client_version %></span>\r\n                    </li>\r\n                    <li>\r\n                        <button type="button" class="manage-server bordered purple"\r\n                            data-server-id="<%- server.id %>">MANAGE</button>\r\n\r\n                    <% if (server.online) { %>\r\n                        <button type="button" class="shutdown-server bordered red pull-right" \r\n                            data-server-id="<%- server.id %>">SHUTDOWN</button>\r\n                    <% } else { %>\r\n                        <button type="button" class="start-server bordered green pull-right"\r\n                            data-server-id="<%- server.id %>">START</button>\r\n                    <% } %>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <% }); %>\r\n<% } else { %>\r\n\r\n    LOADING YOUR FUCKING SERVERS\r\n<% } // servers.length == 0 %>\r\n\r\n<a id="prev-servers-page" href="#">Prev</a>\r\n<a id="next-servers-page" href="#">Next</a>';});


define('minecraft/views/servers',[
    'jquery',
    'underscore',
    'backbone',
    'text!minecraft/templates/servers.html',
], function($, _, Backbone, ServersTemplate) {
    'use strict';
    
    var ServersView = Backbone.View.extend({
        template: _.template(ServersTemplate),
        
        events: {
            'click #next-servers-page': 'onClickNextServersPage',
            'click #prev-servers-page': 'onClickPrevServersPage',
            'click .manage-server': 'onClickManageServer',
            'click .start-server': 'onClickStartServer',
            'click .shutdown-server': 'onClickShutdownServer'
        },

        onClickNextServersPage: function() {
            if (this.page < this.last_page) {
                this.page++;
                this.render();
            }
            return false;
        },

        onClickPrevServersPage: function() {
            if (this.page > 0) {
                this.page--;
                this.render();
            }
            return false;
        },

        onClickManageServer: function(e) {

            var serverId = $(e.currentTarget).attr('data-server-id');
            alert('@todo open up a management panel for ' + serverId);
            return false;
        },

        onClickStartServer: function(e) {

            var serverId = $(e.currentTarget).attr('data-server-id');
            alert('@todo fire off an API call to start ' + serverId);
            return false;
        },

        onClickShutdownServer: function(e) {

            var serverId = $(e.currentTarget).attr('data-server-id');
            alert('@todo fire off an API call to stop ' + serverId);
            return false;
        },

        initialize: function() {
            this.rendered = false;
            this.servers = [];
            this.page = 0;
            this.last_page = 0;
        },

        loadServers: function() {

            var self = this;
            $.getJSON('/servers.json')
                .success(function(json) {
                    self._parseServers(json);
                })
                .error(function() {
                    alert('Error contacting API: Could not retrieve servers.');
                });
        },

        _parseServers: function(json) {

            if ('servers' in json) {

                // Lazy. Just dump it and let the template render itself.
                this.servers = json.servers;

                // TODO: Re-order by online status so the online 
                // server is first, if not supplied.

                // Only show 5 servers per page
                this.last_page = Math.ceil(this.servers.length / 5) - 1;
                this.page = 0;
            }
            else {
                alert('Invalid servers response from API');

                this.servers = [];
                this.last_page = 0;
                this.page = 0;
            }

            // Redraw!
            this.render();
        },

        render: function() {
            this.rendered = true;
            
            this.$el.html(this.template({
                servers: this.servers.slice(this.page * 5, this.page * 5 + 5),
                page: this.page,
                last_page: this.last_page
            }));

            return this;
        }
    });
    
    return ServersView;
});


define('minecraft/views/index',[
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


define('minecraft',[
    'minecraft/views/index'
], function(IndexView) {

    var Minecraft = {
        getView: function() {
            return IndexView;
        }
    };
    
    return Minecraft;
});

}());