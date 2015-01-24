
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/live/schedule.html',
    'views/live/schedulecard'
], function($, _, Backbone, liveScheduleTemplate, ScheduleCardView) {
    'use strict';
    
    var LiveScheduleView = Backbone.View.extend({
        template: _.template(liveScheduleTemplate),
        
        events: {
            'click #next-month': 'onClickNextMonth',
            'click #last-month': 'onClickLastMonth',
            'click .poster': 'onClickEditMovie',
            'click .cancel-edit': 'onClickCancelEditMovie',
            'click .save-edit': 'onClickSaveEditMovie'
        },

        onClickNextMonth: function() {
            alert('Next month! ' + this.next_month.link);
            return false;
        },

        onClickLastMonth: function() {
            alert('Last Month! ' + this.last_month.link);
            return false;
        },

        initialize: function() {
            // Collection stuff

            this.movieViews = [];
            this.rendered = false;

            console.log('init schedule view');

            var self = this;
            // Retrieve our current schedule
            $.getJSON('/january-schedule.json', function(data) {
                console.log(data);
                self.updateMovies(data);
            });
        },

        updateMovies: function(json) {

            this.theme = json.theme;
            this.month = json.month;
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
            
            // Compile a list of movie IDs for our view to construct containers
            var movieIds = [];
            _.each(this.movieViews, function(view) {
                movieIds.push(view.model.id);
            });

            this.$el.html(this.template({
                theme: this.theme,
                movie_ids: movieIds,
                this_month: this.month,
                next_month: (this.next_month) ? this.next_month.title : 'NOP',
                last_month: (this.last_month) ? this.last_month.title : 'NOP'
            }));

            // Render each movie view into a container, designated by it's attached model.id
            _.each(this.movieViews, function(view) {
                view.setElement(this.$('#schedule-card-' + view.model.id)).render();
            }, this);
            
            return this;
        }
    });
    
    return LiveScheduleView;
});
