
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'tubular',
    'text!templates/notfound.html',
], function($, _, Backbone, App, tubular, notFoundTemplate) {
    'use strict';
    
    var NotFoundView = Backbone.View.extend({
        template: _.template(notFoundTemplate),
        
        close: function() {
            
            // Destroy any tubular content
            $('#tubular-container').remove();
            $('#tubular-shield').remove();

            this.remove(); // Destroy this
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            
            this.$el.html(this.template());

            var dio = [
                'iqXKFdcaYIg',
                'StFOzngm400',
                'XOKJth6BLK8',
                'm_8CBvRydW4',
                'AsqXoNvSDMk'
            ]

            var pickedDio = dio[_.random(0, dio.length-1)];

            $('#sybolt-app').tubular({
                videoId: pickedDio, 
                start: 3, 
                mute: false
            });

            // Certain Dio's will push our 404 box to the left. Thanks, Dio!
            if (pickedDio === 'iqXKFdcaYIg') {
                $('#not-found > .inner').addClass('left');
            }

           
       
            return this;
        }
    });
    
    return NotFoundView;
});
