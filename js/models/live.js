
define([
    'underscore',
    'backbone',
    'models/profile',
    'collections/profiles'
], function(_, Backbone, ProfileModel, ProfilesCollection) {
    'use strict';
    
    /**
     * Polls the RTMP live stream service and checks for 
     * changes to the stream url, publisher, viewers, etc
     */
    var LiveModel = Backbone.Model.extend({
        urlRoot: 'http://mumble.sybolt.com:25554/live',
        
        defaults: {
            pollingInterval: 5000,
        },
        
        initialize: function() {
        
            this.polling = false;
            this.publisher = new ProfileModel();
            this.viewersCollection = new ProfilesCollection();
            
            _.bindAll(this);
        },
        
        /* Methods for the model constantly poll for updates from the server */
        
        startPolling: function() {
            this.polling = true;
            this.executePolling();
        },
        
        stopPolling: function() {
            this.polling = false;
        },
        
        executePolling: function() {
            this.fetch({success: this.onFetch});
        },
        
        onFetch: function() {
            if (this.polling) {
                setTimeout(this.executePolling, this.get('pollingInterval'));
            }
            
            // Debug model changes
            console.log(this);
        },
        
        /**
         * Override of Model.parse. Reads response and returns the attribute
         * array that should be set for this model, as well as applying
         * custom changes to sub-models and collections.
         */
        parse: function(response, xhr) {
            
            if ('publisher' in response) {
                this.publisher.parse(response.publisher, xhr);
            }
            
            if ('viewers' in response) {
                this.viewersCollection.parse(response.clients, xhr);
            }
            
            return {
                publishing: response.publishing,
                rtmp_url: response.rtmp_url,
                stream_path: response.stream_path
            };
        }
        
    });
    
    return LiveModel;
});
