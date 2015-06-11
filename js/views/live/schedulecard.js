
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
