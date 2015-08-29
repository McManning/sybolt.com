
define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var TestModel = Backbone.Model.extend({
        urlRoot: '/test',
    });
    
    return TestModel;
});
