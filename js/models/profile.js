
define([
    'underscore',
    'backbone',
], function(_, Backbone) {
    'use strict';
    
    var ProfileModel = Backbone.Model.extend({
        urlRoot: '/api/v1/profile',
        
        defaults: {
            name: 'Unknown',
            ip: '',
            avatar: 'default_avatar.png',
            online: false
        },
        
        initialize: function(attributes, options) {
            this.cid = this.id;
            console.log('NEW PROFILE: ', attributes);
        }
    });
    
    return ProfileModel;
});
