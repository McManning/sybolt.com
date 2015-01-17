
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'isotope',
    'packerymode',
    'text!templates/mumble/index.html'
], function($, _, Backbone, App, Isotope, PackeryMode, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
         
        events: {
            "click #load-more-images": "onLoadMoreImagesClick"
        },

        initialize: function() {

        },
        
        onLoadMoreImagesClick: function() {
            var domElements = [];
            for (var i = 0; i < 10; i++) {
                var width = _.random(100, 500);
                var height = _.random(100, 270);
                var r = _.random(0, 255);
                var g = _.random(0, 255);
                var b = _.random(0, 255);
                
                var element = $('<div/>')
                    .addClass('isotope-item')
                    .css({
                        width: width+'px', 
                        height: height+'px',
                        background: 'rgb('+r+','+g+','+b+')'
                    });

                // Push the DOM object for Isotope (not the jquery selector)
                domElements.push(element[0]);
            }

            // Inject the new elements into our isotope container
            $('.isotope-container').append(domElements);
            
            // Use isotope to reflow
            this.isotope.appended(domElements);

            return false;
        },

        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            this.$el.html(this.template({
                // vars here...
            }));

            // Configure Isotope for the container
            this.isotope = new window.Isotope( $('.isotope-container')[0], {
                itemSelector: '.isotope-item',
                layoutMode: 'packery',
                stamp: '.stamp'
            });

            // Emulate a click to load the first set of images
            this.onLoadMoreImagesClick();

            return this;
        }
    });
    
    return View;
});
