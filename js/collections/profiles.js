
define([
    'underscore',
    'backbone',
    'models/profile'
], function(_, Backbone, ProfileModel) {
    'use strict';
    
    var ProfilesCollection = Backbone.Collection.extend({
        url: "/testprofiles.json", //"/api/v1/testprofiles",
        model: ProfileModel
    });
    
    return ProfilesCollection;
});
