
define([
    'underscore',
    'backbone',
], function(_, Backbone) {
    'use strict';
    
    /**
     * Polls the RTMP live stream service and checks for 
     * changes to the stream url, publisher, viewers, etc
     */
    var LiveModel = Backbone.Model.extend({
        urlRoot: 'http://dev.sybolt.com:25554/live',
        
        defaults: {
            polling_interval: 5000,
        },
        
        initialize: function() {
        
            this.polling = false;
            this.publisher = null;
            this.viewers = [];
            
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
        },
        
        /**
         * Override of Model.parse. Reads response and returns the attribute
         * array that should be set for this model, as well as applying
         * custom changes to sub-models and collections.
         */
        parse: function(response, xhr) {

            if ('publisher' in response) {
                this.publisher = response.publisher;
            } else {
                // Clear publisher
                this.publisher = null;
            }
            
            /* TODO: Rewrite! Less backbone collections please!
            if ('clients' in response) {
                
                // Merge our new ProfileModels with the viewers, firing
                // off add/remove/change events as necessary.
                var merged = this.viewers.set(response.clients, {parse: true, merge:true, remove: false});
                
                // Bug workaround: Removals via collection.set are causing an issue where collection.length
                // is no longer models.length (that is, something was deleted from the collection and left 
                // untracked). Not really finding anything online about this, and I seem to be using collection
                // as documented by Backbone examples. But in any case, it works by not using the built-in
                // remove logic in collection.set and instead creating our own queue for removal after the merge.
                
                var toRemove = [];
                
                // Go through current cached clients and add to the remove 
                // queue if they aren't in our updated list of clients
                this.viewers.each(function(model) {
                    var found = false;
                    
                    for (var i in response.clients) {
                        if (response.clients[i].id == model.id) {
                            found = true;
                            break;
                        }
                    }
                    
                    if (!found) {
                        toRemove.push(model);
                    }
                });
                
                this.viewers.remove(toRemove);
                
            } else {
                // Clear viewers
                this.viewers.reset();
            }
            */

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
