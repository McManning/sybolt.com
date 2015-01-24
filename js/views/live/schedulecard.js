
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/live/schedulecard.html'
], function($, _, Backbone, Template) {
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

            $card.find('.details').addClass('hidden');
            $card.find('.editor').removeClass('hidden');

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

            // TODO: Post back to the web service 

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
