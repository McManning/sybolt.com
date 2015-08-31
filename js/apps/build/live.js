(function () {
define('live/models/live',[
    'underscore',
    'backbone',
], function(_, Backbone) {
    'use strict';
    
    /**
     * Polls the RTMP live stream service and checks for 
     * changes to the stream url, publisher, viewers, etc
     */
    var LiveModel = Backbone.Model.extend({
        urlRoot: 'http://dev.sybolt.com:25554/live',
        
        defaults: {
            polling_interval: 5000,
        },
        
        initialize: function() {
        
            this.polling = false;
            this.publisher = null;
            this.viewers = [];
            
            // Get underscore to force our onFetch to stay in scope of the model when
            // called via setTimeout
            _.bindAll(this, 'executePolling', 'onFetch', 'onFetchError');
        },
        
        isPublishing: function() {
            return !this.hasError() && this.get('publishing') === true;
        },
        
        hasError: function() {
            return this.get('error') !== undefined;
        },
        
        /* Methods for the model constantly poll for updates from the server */
        
        startPolling: function() {
            this.polling = true;
            this.executePolling();
        },
        
        stopPolling: function() {
            this.polling = false;
        },
        
        executePolling: function() {
            this.fetch({
                success: this.onFetch,
                error: this.onFetchError
            });
        },
        
        onFetchError: function(xhr) {
            this.set('error', 'Error while syncing to Live API');
            
            // Delegate to onFetch so we can keep polling
            this.onFetch();
        },
        
        onFetch: function() {
            if (this.polling) {
                setTimeout(this.executePolling, this.get('polling_interval'));
            }
        },
        
        /**
         * Override of Model.parse. Reads response and returns the attribute
         * array that should be set for this model, as well as applying
         * custom changes to sub-models and collections.
         */
        parse: function(response, xhr) {

            if ('publisher' in response) {
                this.publisher = response.publisher;
            } else {
                // Clear publisher
                this.publisher = null;
            }
            
            /* TODO: Rewrite! Less backbone collections please!
            if ('clients' in response) {
                
                // Merge our new ProfileModels with the viewers, firing
                // off add/remove/change events as necessary.
                var merged = this.viewers.set(response.clients, {parse: true, merge:true, remove: false});
                
                // Bug workaround: Removals via collection.set are causing an issue where collection.length
                // is no longer models.length (that is, something was deleted from the collection and left 
                // untracked). Not really finding anything online about this, and I seem to be using collection
                // as documented by Backbone examples. But in any case, it works by not using the built-in
                // remove logic in collection.set and instead creating our own queue for removal after the merge.
                
                var toRemove = [];
                
                // Go through current cached clients and add to the remove 
                // queue if they aren't in our updated list of clients
                this.viewers.each(function(model) {
                    var found = false;
                    
                    for (var i in response.clients) {
                        if (response.clients[i].id == model.id) {
                            found = true;
                            break;
                        }
                    }
                    
                    if (!found) {
                        toRemove.push(model);
                    }
                });
                
                this.viewers.remove(toRemove);
                
            } else {
                // Clear viewers
                this.viewers.reset();
            }
            */

            return {
                publishing: response.publishing,
                rtmp_url: response.rtmp_url,
                stream_path: response.stream_path,
                error: response.error
            };
        }
        
    });
    
    return LiveModel;
});


define('text!live/templates/viewers.html',[],function () { return '\r\n<div class="content-left">\r\n    <% if (viewers.length === 1) { %>\r\n        <h1 class="full-width">1 VIEWER</h1>\r\n    <% } else { %>\r\n        <h1 class="full-width"><%= viewers.length %> VIEWERS</h1>\r\n    <% } %>\r\n\r\n    <div class="profiles-collection">\r\n        <% _.each(viewers, function(profile) { %>            \r\n            <div class="profile-icon"><img src="/img/default-profile-icon.png"/></div>\r\n        <% }); %>\r\n    </div>\r\n\r\n    <div class="clearfix"></div>\r\n</div>\r\n';});


define('live/views/viewers',[
    'jquery',
    'underscore',
    'backbone',
    'text!live/templates/viewers.html'
], function($, _, Backbone, Template) {

    var LiveViewersView = Backbone.View.extend({
        template: _.template(Template),
        
        initialize: function() {
            // Collection stuff
            
            // TODO: Fix!
           /* this.model.viewers
                .on('add', this.onAddViewer, this)
                .on('remove', this.onRemoveViewer, this)
                .on('change', this.onUpdateViewer, this)
                .on('reset', this.onClearViewers, this); */
        },
        
        close: function() {
            
            // TODO: Fix!
           /* this.model.viewers
                .off('add', this.onAddViewer)
                .off('remove', this.onRemoveViewer)
                .off('change', this.onUpdateViewer)
                .off('reset', this.onClearViewers);*/
        
            this.remove();
        },
        
        onAddViewer: function(profile) {
            console.log('ADD VIEWER: ', profile);
            
            // Redraw updated list
            this.render();
        },
        
        onRemoveViewer: function(profile) {
            console.log('REMOVE VIEWER: ', profile);
            
            // Redraw updated list
            this.render();
        },
        
        onUpdateViewer: function(profile) {
            console.log('UPDATE VIEWER: ', profile);
            
            // Redraw updated list
            this.render();
        },
        
        onClearViewers: function() {
            
            this.render();
        },
        
        render: function() {
            
            // If we have no viewers, hide container element
            if (!this.model.viewers || this.model.viewers.length < 1) {
                this.$el.addClass('hidden');
            } 
            else {
                this.$el.removeClass('hidden').html(this.template({
                    viewers: this.model.viewers,
                    publisher: this.model.publisher
                }));    
            }

            return this;
        }
    });
    
    return LiveViewersView;
});


define('text!live/templates/schedule.html',[],function () { return '\r\n<div class="content-left">\r\n    <h1 class="full-width">SCHEDULE <button class="show-request bordered">Request a movie</button></h1>\r\n\r\n    <!--h2>THEME: <%- theme %></h2-->\r\n\r\n    <div class="nav">\r\n        <% if (last_month !== null && last_month.length > 0) { %>\r\n        <button id="last-month" type="button" class="bordered large"><%- last_month %> </button>\r\n        <% } %>\r\n\r\n        <span id="this-month"><%- this_month %></span>\r\n\r\n        <% if (next_month !== null && next_month.length > 0) { %>\r\n        <button id="next-month" type="button" class="bordered large"><%- next_month %></button>\r\n        <% } %>\r\n    </div>\r\n\r\n    <% if (movie_dates.length < 1) { %>\r\n        <div class="no-schedule">\r\n            <h1>No movies have been scheduled for this month</h1>\r\n        </div>\r\n    <% } else { %>\r\n\r\n        <!-- Render containers for each schedule-card to render in via their own views -->\r\n        <% _.each(movie_dates, function(date) { %>    \r\n        <div id="schedule-card-<%= date %>" class="schedule-card-container"></div>    \r\n        <% }); %>\r\n\r\n    <% } %>\r\n\r\n    <% if (profile) { %>\r\n        <a id="add-schedule-card" href="#">Add New Movie</a>\r\n    <% } %>\r\n</div>\r\n';});


define('text!live/templates/schedulecard.html',[],function () { return '\r\n<div class="schedule-card">\r\n    <!-- Card with picker icon, date, and movie title -->\r\n    <div class="title">\r\n\r\n        <% if (movie.profile !== null) { %>  \r\n            <img src="<%- movie.profile.avatar_url %>" />\r\n        <% } else { %>\r\n            \r\n        <% } %>\r\n\r\n        <h2><%- movie.date_fmt %></h2>\r\n\r\n        <% if (movie.title !== null && movie.title.length > 0) { %>\r\n            <p><%- movie.title %></p>\r\n        <% } else { %> \r\n            <p><i>Not yet announced</i></p>\r\n        <% } %>\r\n    </div>\r\n\r\n    <!-- Card with poster, synopsis, and links -->\r\n    <div class="details">\r\n        <div class="poster-container">\r\n            <% if (movie.poster !== null && movie.poster.length > 0) { %>\r\n                <img class="poster" src="<%- movie.poster %>" />\r\n            <% } else { %>\r\n                <img class="poster" src="/img/movie-tba.png" />\r\n            <% } %>\r\n        </div>\r\n\r\n        <div class="content">\r\n            <% if (movie.synopsis !== null && movie.synopsis.length > 0) { %>\r\n            <strong>Synopsis</strong>\r\n            <p class="synopsis">\r\n                <%- movie.synopsis %>\r\n            </p>\r\n            <% } %>\r\n\r\n            <% if (movie.profile !== null) { %>  \r\n                <strong>Picked By</strong>\r\n                <p class="picked-by">\r\n                    <%- movie.profile.username %>\r\n                </p>\r\n            <% } else { %>\r\n                <strong>Not yet assigned to a member</strong>\r\n            <% } %>\r\n\r\n            <ul class="links">\r\n                <% if (movie.trailer !== null && movie.trailer.length > 0) { %> \r\n                    <li>\r\n                        <a class="trailer" data-bypass="true" target="_BLANK" href="<%- movie.trailer %>">Watch the Trailer</a>\r\n                    </li> \r\n                <% } %>\r\n\r\n                <% if (movie.imdb !== null && movie.imdb.length > 0) { %> \r\n                    <li>\r\n                        <a class="imdb" data-bypass="true" target="_BLANK" href="<%- movie.imdb %>">View on IMDb</a>\r\n                    </li> \r\n                <% } %>\r\n            </ul>\r\n            <div class="clearfix"></div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Editor to modify movie details -->\r\n    <div class="editor hidden">\r\n        <form class="small">\r\n            <fieldset class="full">\r\n                <div class="text">\r\n                    <label for="date-<%- movie.id %>">DATE</label>\r\n                    <input type="text" id="date-<%- movie.id %>" name="date" value="<%- movie.date %>" />\r\n                </div>\r\n                <div class="text">\r\n                    <label for="title-<%- movie.id %>">TITLE</label>\r\n                    <input type="text" id="title-<%- movie.id %>" name="title" value="<%- movie.title %>" />\r\n                </div>\r\n                <div class="textarea">\r\n                    <label for="synopsis-<%- movie.id %>">SYNOPSIS</label>\r\n                    <textarea id="synopsis-<%- movie.id %>" name="synopsis" rows="4"><%- movie.synopsis %></textarea>\r\n                </div>\r\n                <div class="text">\r\n                    <label for="trailer-<%- movie.id %>">TRAILER</label>\r\n                    <input type="text" id="trailer-<%- movie.id %>" name="trailer" value="<%- movie.trailer %>" />\r\n                </div>\r\n                <div class="text">\r\n                    <label for="imdb-<%- movie.id %>">IMDB</label>\r\n                    <input type="text" id="imdb-<%- movie.id %>" name="imdb" value="<%- movie.imdb %>" />\r\n                </div>\r\n                <div class="text">\r\n                    <label for="poster-<%- movie.id %>">POSTER</label>\r\n                    <input type="text" id="poster-<%- movie.id %>" name="poster" value="<%- movie.poster %>" />\r\n                </div>\r\n                <div class="text">\r\n                    <label for="profile-<%- movie.id %>">USER</label>\r\n                    <input type="text" id="profile-<%- movie.id %>" name="profile" value="<%- (movie.profile) ? movie.profile.username : \'\' %>" />\r\n                </div>\r\n            </fieldset>\r\n\r\n            <div class="controls">\r\n                <button type="button" class="cancel-edit">Cancel</button>\r\n                <button type="submit" class="save-edit bordered green">Save Changes</button>\r\n            </div>\r\n\r\n            <div class="clearfix"></div>\r\n        </form>\r\n    </div>\r\n\r\n</div>\r\n';});


define('live/views/schedulecard',[
    'jquery',
    'underscore',
    'backbone',
    'text!live/templates/schedulecard.html'
], function($, _, Backbone, Template) {

    var ScheduleCardView = Backbone.View.extend({
        template: _.template(Template),
        
        events: {
            'click .poster': 'onClickEditMovie',
            'click .cancel-edit': 'onClickCancelEditMovie',
            'click .save-edit': 'onClickSaveEditMovie'
        },

        /**
         * Action to hide the details view of a schedule card
         * and show the editor form.
         */
        onClickEditMovie: function(e) {
            var $card = $(e.target).closest('.schedule-card');

            // TOOD: Check for access rights, not just an existing profile
            if (App.profile) {
                $card.find('.details').addClass('hidden');
                $card.find('.editor').removeClass('hidden');
            } 
           // else {
           //     alert('You do not have permission to edit this movie');
           // }
            
            return false;
        },

        /**
         * Action to hide the editor form of a schedule card
         * and show the details view. 
         */
        onClickCancelEditMovie: function(e) {
            var $card = $(e.target).closest('.schedule-card');

            $card.find('.details').removeClass('hidden');
            $card.find('.editor').addClass('hidden');

            return false;
        },

        onClickSaveEditMovie: function(e) {
            this.onClickCancelEditMovie(e);

            var $card = $(e.target).closest('.schedule-card');
            var $form = $card.find('.editor form');

            var type = 'POST';
            var url = App.getApiBaseUrl() + '/live/schedule';

            // If it's an existing model, change the submission parameters 
            if (this.model.id !== null) {
                type = 'POST'; // TODO: See API for why PUT is failing with Tornado
                url = App.getApiBaseUrl() + '/live/schedule/id/' + this.model.id;
            }

            // Post our serialized form to the web service behind the scenes as well
            var self = this;
            $.ajax({
                type: type,
                url: url,
                data: $form.serialize(),
                dataType: 'json',
                success: function(response) {
                    // Set the updated model to whatever the server tells us
                    self.model = response
                    self.render();
                }
            })

            return false;
        },

        initialize: function() {

        },

        render: function() {
            this.$el.html(this.template({
                movie: this.model
            }));
            
            return this;
        }
    });
    
    return ScheduleCardView;
});


define('live/views/schedule',[
    'jquery',
    'underscore',
    'backbone',
    'text!live/templates/schedule.html',
    'live/views/schedulecard'
], function($, _, Backbone, Template, ScheduleCard) {

    var LiveScheduleView = Backbone.View.extend({
        template: _.template(Template),
        
        events: {
            'click #next-month': 'onClickNextMonth',
            'click #last-month': 'onClickLastMonth',
            'click #add-schedule-card': 'onClickAddScheduleCard'
        },

        onClickNextMonth: function() {

            // Paginate to the next month's schedule
            var self = this;
            $.getJSON(this.next_month.link, function(data) {
                console.log(data);
                self.updateMovies(data);
            });

            return false;
        },

        onClickLastMonth: function() {
            
            // Paginate to the last month's schedule
            var self = this;
            $.getJSON(this.last_month.link, function(data) {
                console.log(data);
                self.updateMovies(data);
            });

            return false;
        },

        onClickAddScheduleCard: function() {

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();

            var model = {
                date: yyyy + '-' + mm + '-' + dd,
                date_fmt: 'UNK',
                id: null,
                imdb: null,
                poster: null,
                profile: null,
                synopsis: null,
                title: null,
                trailer: null
            };

            var view = new ScheduleCard({ model: model });
            this.movieViews.push(view);
            this.render();

            return false;
        },

        initialize: function() {
            // Collection stuff

            this.movieViews = [];
            this.rendered = false;

            console.log('init schedule view');

            var self = this;
            // Retrieve our current schedule
            var now = new Date();
            /* TODO: Fix!
            $.getJSON(App.getApiBaseUrl() + '/live/schedule/year/' + now.getFullYear() + '/month/' + (now.getMonth() + 1))
                .success(function(json) {
                    self.updateMovies(json);
                })
                .error(function() {
                    alert('Error contacting API: Could not retrieve schedule.');
                });
            */
        },

        updateMovies: function(json) {

            this.theme = json.theme;
            this.this_month = json.title;
            this.next_month = json.links.next_month;
            this.last_month = json.links.last_month;

            // Cleanly close all old views
            _.each(this.movieViews, function(view) {
                view.setElement(null);
                view.close();
            }, this);

            this.movieViews = [];
            
            // Generate new views + models for each movie 
            _.each(json.movies, function(movieJson) { 
                var view = new ScheduleCardView({ model: movieJson });
                this.movieViews.push(view);
            }, this);

            // Redraw
            // TODO: Not actually do this and properly do the JSON
            // call after first render... :|
            if (this.rendered) {
                this.render();
            }
        },

        close: function() {
            this.remove();
        },
        
        render: function() {
            this.rendered = true;
            
            // Compile a list of movie dates for our view to construct containers
            var movieDates = [];
            _.each(this.movieViews, function(view) {
                movieDates.push(view.model.date);
            });

            this.$el.html(this.template({
                theme: this.theme,
                movie_dates: movieDates,
                profile: {}, //App.profile,
                this_month: this.this_month,
                next_month: (this.next_month) ? this.next_month.title : null,
                last_month: (this.last_month) ? this.last_month.title : null
            }));

            // Render each movie view into a container, designated by it's attached model.id
            _.each(this.movieViews, function(view) {
                view.setElement(this.$('#schedule-card-' + view.model.date)).render();
            }, this);
            
            return this;
        }
    });
    
    return LiveScheduleView;
});


define('text!live/templates/request.html',[],function () { return '\r\n<a id="trailer-anchor" href="#" class="hidden" target="_BLANK"></a>\r\n\r\n<div class="content-left">\r\n\r\n    <h1 class="full-width">SEARCH FOR A MOVIE <button class="show-schedule bordered">Show schedule</button></h1>\r\n\r\n    <form id="tmdb-search">\r\n        <input type="text" value="" placeholder="Search..." />\r\n        <button class="bordered green large">Search</button>\r\n    </form>\r\n\r\n    <div id="search-error" style="display: none"></div>\r\n\r\n    <div id="search-results" style="display: none">\r\n        <h2>SEARCH RESULTS <span style="color:#666">(<span id="search-result-count"></span>)</span></h2>\r\n\r\n        <div class="posters-container" style="display: none">\r\n            <!-- The actual isotope container for posters to be sorted -->\r\n            <div class="isotope-container"></div>\r\n        </div>\r\n\r\n        <!-- details view container -->\r\n        <div class="movie-details-container" style="display: none"></div>\r\n\r\n        <div id="too-many-results-warning" style="display:none">YOU HAVE TOO MANY RESULTS, NARROW YOUR SEARCH FOOL.</div>\r\n\r\n        <!--a id="search-next-page" href="#" style="display: none">Load Next Page</a-->\r\n    </div>\r\n</div>\r\n\r\n<div class="content-left">\r\n\r\n    <h1 class="full-width">MY MOVIES</h1>\r\n\r\n    <div id="favorites-list">\r\n\r\n        <div class="posters-container">\r\n        <% if (favorites.length > 0) { %>\r\n            <% _.each(favorites, function(movie, index) { %>\r\n                <div class="favorite-movie" data-favorite-index="<%- index %>">\r\n                    <img src="http://image.tmdb.org/t/p/w154/<%- movie.poster_path %>" \r\n                        alt="<%- movie.title %>" title="<%- movie.title %>" />\r\n                </div>\r\n            <% }) %>\r\n        <% } else { %>\r\n            No favorites!\r\n        <% } %>\r\n        </div>\r\n\r\n        <div class="movie-details-container" style="display: none"></div>\r\n    </div>\r\n\r\n</div>';});


define('text!live/templates/details.html',[],function () { return '\r\n<div class="movie-details" \r\n    data-search-result="<%- isSearchResult %>" \r\n    data-results-index="<%- index %>" \r\n    data-tmdb-id="<%- id %>"\r\n    style="background-image: url(\'<%- backdrop %>\')">\r\n    \r\n    <div class="left-controls">\r\n        <img class="poster" src="<%- poster %>">\r\n\r\n        <% if (isFavorited) { %>\r\n            <button class="bordered red">Remove</button>\r\n        <% } else { %> \r\n            <button class="bordered">Add to my list</button>\r\n        <% } %>\r\n    </div>\r\n\r\n    <a href="#" class="show-posters">Back to list</a>\r\n\r\n    <div class="details">\r\n        <h1>\r\n            <%- title %> \r\n            <span class="year">(<%- releaseDate %>)</span>\r\n        </h1>\r\n        \r\n        <dl>\r\n            <dt>Synopsis</dt>\r\n            <dd class="overview"><%- overview %></dd>\r\n\r\n            <dt>Voter Average</dt>\r\n            <dd class="vote-average">\r\n                <% for (var i = 0; i < 5; i++) { %>\r\n                    <% if (Math.ceil(voteAverage * 0.5) <= i) { %>\r\n                        &#9734;\r\n                    <% } else { %>\r\n                        &#9733;\r\n                    <% } %>\r\n                <% } %>\r\n            </dd>\r\n        </dl>\r\n\r\n    </div>\r\n\r\n    <div class="bottom-controls">\r\n        <button class="view-trailer bordered">Watch Trailer</button>\r\n        <button class="request-movie bordered green">Request this movie</button>\r\n    </div>\r\n</div>\r\n\r\n<% if (index > 0) { %>\r\n<a href="#" class="movie-details-prev">&lt;</a>\r\n<% } %>\r\n\r\n<% if (index < total - 1) { %>\r\n<a href="#" class="movie-details-next">&gt;</a>\r\n<% } %>\r\n\r\n\r\n';});


define('live/views/request',[
    'jquery',
    'underscore',
    'backbone',
    'isotope',
    'text!live/templates/request.html',
    'text!live/templates/details.html'
], function($, _, Backbone, Isotope, Template, DetailsTemplate) {
    'use strict';
    
    var LiveRequestView = Backbone.View.extend({
        template: _.template(Template),
        detailsTemplate: _.template(DetailsTemplate),

        // Do stuff. Fake isotope results.
        // TODO: Don't hardcode this key.
        TMDB_API_KEY: '7e02a059c9c5cc263b4db5f4ea7f9222',

        /* Also defined:
            favorites - array of movies
            results - array of movies
            searchPagesLoaded - int
            totalSearchPages - int
            currentSearchIndex - int - current index of this.results we're viewing details
        */

        events: {
            'click #tmdb-search > button': 'onSearch',
            'enter #tmdb-search > input' : 'onSearch',
            'click .search-result': 'onClickSearchResult',
            'click .favorite-movie': 'onClickFavoriteMovie',
            'click .movie-details-next': 'onClickNextMovie',
            'click .movie-details-prev': 'onClickPrevMovie',
            'click .show-posters': 'onClickShowPosters',
            'click .view-trailer': 'onClickViewTrailer'
        },

        initialize: function() {
            this.favorites = [
                /*{
                    id: 49049, // TMDB ID
                    title: 'Dredd',
                    poster_path: '/71fkYuMVMtdbREh9Mp3gTFmI8Bv.jpg',
                    release_date: '2012',
                    overview: 'In the future, America is a dystopian wasteland. The latest scourge is Ma-Ma, a prostitute-turned-drug pusher with a dangerous new drug and aims to take over the city. The only possibility of stopping her is an elite group of urban police called Judges, who combine the duties of judge, jury and executioner to deliver a brutal brand of swift justice. But even the top-ranking Judge, Dredd, discovers that taking down Ma-Ma isn’t as easy as it seems in this explosive adaptation of the hugely popular comic series.',
                    vote_average: 6.3,
                    backdrop_path: null
                }*/
                {
                    adult: false,
                    backdrop_path: "/8EQg8fsxEElycBPSb0JszATwm1l.jpg",
                    id: 246403,
                    original_language: "en",
                    original_title: "Tusk",
                    overview: "When his best friend and podcast co-host goes missing in the backwoods of Canada, a young guy joins forces with his friend's girlfriend to search for him.",
                    popularity: 2.808169,
                    poster_path: "/ntxILPesM4IRumijc1DRJQTks9t.jpg",
                    release_date: "2014-09-19",
                    title: "Tusk",
                    video: false,
                    vote_average: 5,
                    vote_count: 82
                }
            ];
        },

        close: function() {
            this.remove();
        },

        loadTrailer: function(id) {

            var jqxhr = $.getJSON('http://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + this.TMDB_API_KEY)
                .done(function(data) {
                    console.log(data);

                    var youTubeUri = null;

                    // Hunt for a YouTube URI
                    for (var i in data.results) {
                        if (data.results[i].site == 'YouTube') {
                            youTubeUri = data.results[i].key;
                        }
                    }

                    // If we couldn't find a youtube link, 
                    if (!youTubeUri) {
                        alert('Could not retrieve a valid YouTube link from the TMDB API.');
                    } else {
                        
                        // Generate a url in a hidden anchor and simulate a 
                        // click (so we can open a new tab)
                        /*$('#trailer-anchor')
                            .attr('href', 'https://www.youtube.com/watch?v=' + youTubeUri)
                            .click();*/

                        // TODO: Either embed or figure out another solution (like a double click to open, or 
                        // opening in an embedded player)
                        alert('Found URI ' + youTubeUri + ' but I can\'t open a new tab from JS. (lol popup blockers)');
                    }
                })
                .fail(function() {
                    alert('An error occurred while contacting the TMDB API');
                });
        },
        
        onSearch: function() {

            var query = $('#tmdb-search > input').val();
            $('#tmdb-search > input').val('');
            if (query.length < 1) {
                return false;
            }

            // Clear any old search
            this.clearSearchResults();

            var self = this;
            var jqxhr = $.getJSON('http://api.themoviedb.org/3/search/movie?api_key=' + this.TMDB_API_KEY + '&query=' + query)
                .done(function(data) {
                    console.log(data);

                    if (data.total_results > 0) {
                        self.addSearchResults(data);
                    }
                    else {
                        // TODO: Randomize
                        self.displaySearchError('No results. ' + self.getRandomPhrase());
                    }
                    
                })
                .fail(function() {
                    self.displaySearchError('An error occurred while contacting the TMDB API');
                });

            return false;
        },

        getRandomPhrase: function() {

            var phrases = [
                'Did you mean to type "Tusk"?',
                'Were you looking for <a href="https://www.youtube.com/watch?v=vUp5hU7W2_I" target="_BLANK">this</a>?', // Unlimited Essay Works
                'Were you looking for <a href="https://www.youtube.com/watch?v=BCUvx2BExZI" target="_BLANK">this</a>?', // Average Lalafell Day
                'How about a <a href="https://www.youtube.com/watch?v=4_vHQOc4hUM" target="_BLANK">ggglygy video</a> instead?',
                'Are you sure you weren\'t looking for the true death note?',
                'Does this thing even work?',
                'Maybe only Blockbuster carried it?',
            ];

            return _.sample(phrases);
        },

        displaySearchError: function(message) {

            $('#search-error').show().html(message);
            $('#search-results').hide();
        },

        clearSearchResults: function() {
            $('#search-results .isotope-container').html();
            
            this.currentSearchIndex = 0;
            this.results = [];
            this.searchPagesLoaded = 0;
            this.totalSearchPages = 0;

            // Use isotope to reflow
            this.isotope.remove(this.isotope.getItemElements());
            this.isotope.layout();
        },

        addSearchResults: function(data) {
            this.results = this.results.concat(data.results);

            this.totalSearchPages = data.total_pages;
            this.page = data.page;

            $('#search-result-count').html(
                data.total_results + ' match' + ((data.total_results > 1) ? 'es' : '')
            );

            // If we're on the last page, hide the load more link.
            if (data.page == data.total_pages) {
                $('#search-next-page').hide();
            } else {
                $('#search-next-page').show();
            }

            $('#search-error').hide();

            var domElements = [];

            _.each(data.results, function(movie, index) {
                console.log(movie);

                var poster = movie.poster_path;
                if (!poster) {
                    // TODO: Use some default
                    poster = '/img/movie-tba.png';

                } else { // resolve to a full URL
                    poster = 'http://image.tmdb.org/t/p/w154/' + poster
                }

                // Add base container
                var element = $('<div/>')
                    .addClass('search-result')
                    .data('results-index', index)
                    .html('<img src="' + poster + '" alt="' + movie.title + '" title="' + movie.title + '" />'
                );

                // Just make some static thing, for now
                element.css({
                    width: '154px',
                    height: '231px'
                });

                // Push the DOM object for Isotope (not the jquery selector)
                domElements.push(element[0]);

            });

            // Replace old results with the new ones
            $('#search-results .isotope-container').html(domElements);
            
            // Append to isotope
            this.isotope.appended(domElements);

            $('#search-results').show();

            // If we have more than one result, show the posters list
            if (data.total_results > 1) {
                this.$el.find('#search-results .movie-details-container').hide();
                this.$el.find('#search-results .posters-container').show();


            } else if (data.total_results == 1) {
                // Otherwise, if it's one movie, go straight to details.
                
                this.currentSearchIndex = 0;
                this.displayMovieDetails(this.$searchResults, data.results, 0);
            }

            // Reflow after displaying.
            this.isotope.layout();
        },

        displayMovieDetails: function($container, movies, index) {

            var movie = movies[index];

            var poster = movie.poster_path;
            if (!poster) {
                // TODO: Use some default
                poster = '/img/movie-tba.png';

            } else { // resolve to a full URL
                poster = 'http://image.tmdb.org/t/p/w154/' + poster
            }

            var backdrop = movie.backdrop_path;
            if (!backdrop) {
                // TODO: Use some default

            } else { // resolve to a full URL
                backdrop = 'http://image.tmdb.org/t/p/w780/' + backdrop
            }

            // Check if we got back a malformed release date
            var releaseDate = movie.release_date;
            if (!releaseDate || releaseDate.length < 4) {
                releaseDate = '????';
            } else {
                releaseDate = releaseDate.substr(0, 4);
            }

            // TODO: Speed up this lookup!!!

            // Get whether this movie has already been favorited by the user
            var isFavorited = false;
            for (var i in this.favorites) {
                if (this.favorites[i].id == movie.id) {
                    isFavorited = true;
                    break;
                }
            }

            // hide posters view
            $container.find('.posters-container').hide();

            // Populate details and display
            $container.find('.movie-details-container').html(
                this.detailsTemplate({
                    isSearchResult: true,
                    title: movie.title,
                    id: movie.id,
                    releaseDate:  releaseDate,
                    overview: movie.overview,
                    voteAverage: movie.vote_average,
                    poster: poster,
                    backdrop: backdrop,
                    index: index,
                    total: movies.length,
                    isFavorited: isFavorited
                })
            ).show();
        },

        onClickSearchResult: function(e) {

            var index = $(e.currentTarget).data('results-index');
            this.currentSearchIndex = index;

            this.displayMovieDetails(this.$searchResults, this.results, index);
            return false;
        },

        onClickFavoriteMovie: function(e) {

            var index = $(e.currentTarget).data('favorite-index');
            this.displayMovieDetails(this.$favoritesList, this.favorites, index);
            return false;
        },

        onClickNextMovie: function(e) {
            if (this.currentSearchIndex < this.results.length - 1) {
                this.currentSearchIndex++;
                this.displayMovieDetails(
                    this.$searchResults,
                    this.results,
                    this.currentSearchIndex
                );
            }
            return false;
        },

        onClickPrevMovie: function() {
            if (this.currentSearchIndex > 0) {
                this.currentSearchIndex--;
                this.displayMovieDetails(
                    this.$searchResults,
                    this.results,
                    this.currentSearchIndex
                );
            }
            return false;
        },

        onClickShowPosters: function(e) {
            
            var $parent = $(e.currentTarget).closest('.movie-details-container').parent();
            $parent.find('.movie-details-container').hide();
            $parent.find('.posters-container').show();
            return false;
        },

        onClickViewTrailer: function(e) {

            var id = $(e.currentTarget).closest('.movie-details').data('tmdb-id');
            this.loadTrailer(id);
        },

        render: function() {

            this.$el.html(this.template({
                favorites: this.favorites
            }));

            // Configure Isotope on first run
            if (!this.isotope) {
                this.isotope = new window.Isotope( $('#search-results .isotope-container')[0], {
                    itemSelector: '.search-result',
                    layoutMode: 'masonry',
                });
            }

            // Add some shortcut selectors
            this.$searchResults = $('#search-results');
            this.$favoritesList = $('#favorites-list');

            return this;
        }
    });
    
    return LiveRequestView;
});


define('text!live/templates/index.html',[],function () { return '\r\n<!--div class="live-publisher hidden">\r\n    <div class="profile-icon small">\r\n        <img src="/img/default-profile-icon.png" />\r\n    </div>\r\n</div-->\r\n\r\n<div id="player-container">\r\n    <div id="live-offline"><h1>OFFLINE</h1></div>\r\n    <div id="live-error" class="hidden"><h1>Unknown Error</h1></div>\r\n    <div id="live-player-container" class="hidden">\r\n        <div id="live-player"><!-- Contents will be overwritten by Flowplayer --></div>\r\n    </div>\r\n</div>\r\n\r\n<div class="viewers"></div>\r\n<div id="schedule-view-container"></div>\r\n<div id="request-view-container"></div>';});


define('live/views/index',[
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


define('live',[
    'live/views/index'
], function(IndexView) {

    var Live = {
        getView: function() {
            return IndexView;
        }
    };
    
    return Live;
});

}());