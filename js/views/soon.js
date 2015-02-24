
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/soon.html',
], function($, _, Backbone, App, Template) {
    'use strict';
    


    var PrivacyView = App.View.extend({
        template: _.template(Template),
        
        events: {
            'click #show-more-info': 'onClickShowMoreInfo'
        },

        onClickShowMoreInfo: function() {

            this.$el.find('#more-info').show('slow');

            return false;
        },

        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            
            this.$el.html(this.template({
                // ...
            }));
            
            return this;
        }
    });
    
    return PrivacyView;
});
