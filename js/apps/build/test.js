(function () {
define('test/models/TestModel',[
    'underscore',
    'backbone',
], function(_, Backbone) {

    var TestModel = Backbone.Model.extend({
        urlRoot: '/test',
    });
    
    return TestModel;
});


define('text!test/templates/index.html',[],function () { return '\r\nHi!\r\n';});


define('test/views/index',[
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


define('test',[
    'test/views/index'
], function(IndexView) {

    var Test = {
        getView: function() {
            return IndexView;
        }
    };
    
    return Test;
});

}());