
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/live/schedulecard.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var ScheduleCardView = App.View.extend({
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
            else {
                alert('You do not have permission to edit this movie');
            }
            
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

            var form = $card.find('.editor form');
            var props = form.serializeArray();

            // Copy the updated properties back onto our model
            _.each(props, function(prop) {
                if (prop.value.length < 1) {
                    this.model[prop.name] = null;
                } else {
                    this.model[prop.name] = prop.value;  
                }
            }, this);

            // Re-render our model
            this.render();

            // Post our serialized form to the web service behind the scenes as well
            $.ajax({
                type: 'POST', // TODO: Make this a PUT for RESTful-ness...
                url: 'http://local.sybolt.com:8888/api/live/schedule/id/' + this.model.id,
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    alert('Posted!');
                    console.log(response);
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
