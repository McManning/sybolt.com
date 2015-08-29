
define([
    'jquery',
    'underscore',
    'backbone',
    'test/models/TestModel',
    'text!test/templates/index.html'
], function($, _, Backbone, TestModel, Template) {

    var View = Backbone.View.extend({
        template: _.template(Template),
        
        initialize: function() {
            this.model = new TestModel();
        },

        close: function() {
            this.remove();
        },
        
        render: function() {
            
            this.$el.html(this.template({
                // vars here...
            }));
            
            return this;
        }
    });
    
    return View;
});
