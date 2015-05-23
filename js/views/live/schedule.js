
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/live/schedule.html',
    'views/live/schedulecard'
], function($, _, Backbone, App, liveScheduleTemplate, ScheduleCardView) {
    'use strict';
    
    var LiveScheduleView = Backbone.View.extend({
        template: _.template(liveScheduleTemplate),
        
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

            var view = new ScheduleCardView({ model: model });
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
            $.getJSON(App.getApiBaseUrl() + '/live/schedule/year/' + now.getFullYear() + '/month/' + (now.getMonth() + 1))
                .success(function(json) {
                    self.updateMovies(json);
                })
                .error(function() {
                    alert('Error contacting API: Could not retrieve schedule.');
                });
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
                profile: App.profile,
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
