
define([
    'underscore',
    'backbone',
], function(_, Backbone) {
    'use strict';
    
    var ProfileModel = Backbone.Model.extend({
        urlRoot: '/api/v1/profile',
        
        defaults: {
            name: 'Unknown',
            avatar: 'default_avatar.png',
            online: false
        }
    });
    
    return ProfileModel;
});
