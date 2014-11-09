
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
            polling_interval: 5000,
        },
        
        initialize: function() {
        
            this.polling = false;
            this.publisher = new ProfileModel();
            this.viewers = new ProfilesCollection();
            
            // Get underscore to force our onFetch to stay in scope of the model when
            // called via setTimeout
            _.bindAll(this, 'executePolling', 'onFetch', 'onFetchError');
        },
        
        isPublishing: function() {
            return !this.hasError() && this.get('publishing') === true;
        },
        
        hasError: function() {
            return this.get('error') !== undefined;
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
            this.fetch({
                success: this.onFetch,
                error: this.onFetchError
            });
        },
        
        onFetchError: function(xhr) {
            this.set('error', 'Error while syncing to Live API');
            
            // Delegate to onFetch so we can keep polling
            this.onFetch();
        },
        
        onFetch: function() {
            if (this.polling) {
                setTimeout(this.executePolling, this.get('polling_interval'));
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
                this.publisher.set(response.publisher);
            } else {
                this.publisher.set('online', false);
            }
            
            if ('clients' in response) {
                // Merge our new ProfileModels with the viewers, firing
                // off add/remove/change events as necessary.
                var profiles = this.viewers.parse(response.clients);
                this.viewers.set(profiles);
            } else {
                // Clear viewers
                this.viewers.reset();
            }
            
            return {
                publishing: response.publishing,
                rtmp_url: response.rtmp_url,
                stream_path: response.stream_path,
                error: response.error
            };
        }
        
    });
    
    return LiveModel;
});
