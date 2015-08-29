
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'isotope',
    'text!templates/live/request.html',
    'text!templates/live/details.html'
], function($, _, Backbone, App, Isotope, liveRequestTemplate, requestDetailsTemplate) {
    'use strict';
    
    var LiveRequestView = Backbone.View.extend({
        template: _.template(liveRequestTemplate),
        detailsTemplate: _.template(requestDetailsTemplate),

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
