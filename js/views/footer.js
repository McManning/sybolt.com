
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/footer.html'
], function($, _, Backbone, footerTemplate) {
    'use strict';
    
    var FooterView = Backbone.View.extend({
        
        el: $('#footer'),
        template: _.template(footerTemplate),
        
        initialize: function() {
            this.leftTitle = '';
            this.leftMessage = '';
            this.centerTitle = '';
            this.centerMessage = '';
        },
        
        render: function() {
            
            this.$el.html(this.template({
                'leftTitle': this.leftTitle,
                'leftMessage': this.leftMessage,
                'centerTitle': this.centerTitle,
                'centerMessage': this.centerMessage
            }));
            
            return this;
        },
        
        setLeftMessage: function(title, message) {
            this.leftTitle = title;
            this.leftMessage = message;
            return this;
        },
        
        setCenterMessage: function(title, message) {
            this.centerTitle = title;
            this.centerMessage = message;
            return this;
        },
        
        setStyle: function(style) {
            // Perform an animated transition, rather than re-rendering
            
            // Swap style CSS
            this.$el
                .removeClass(this.style + '-style')
                .addClass(style + '-style');

            this.style = style;
            return this;
        }
    });
    
    return FooterView;
});
