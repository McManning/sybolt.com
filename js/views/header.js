
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html'
], function($, _, Backbone, headerTemplate) {
    'use strict';
    
    var HeaderView = Backbone.View.extend({
        
        el: $('#header'),
        template: _.template(headerTemplate),
        style: 'default',
        
        render: function() {
            
            var data = {style: this.style};
            var compiled = this.template(data);
            
            this.$el.html(compiled);
            
            return this;
        },
        
        setStyle: function(style) {
            console.log('Setting style to ' + style);
            
            // Swap style CSS
            this.$el
                .removeClass(this.style + '-style')
                .addClass(style + '-style');
            
            this.style = style;
            
            this.render();
            return this;
        }
    });
    
    return HeaderView;
});
