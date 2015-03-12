
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/minecraft/servers.html',
], function($, _, Backbone, App, ServersTemplate) {
    'use strict';
    
    var ServersView = App.View.extend({
        template: _.template(ServersTemplate),
        
        events: {
            'click #next-servers-page': 'onClickNextServersPage',
            'click #prev-servers-page': 'onClickPrevServersPage',
            'click .manage-server': 'onClickManageServer',
            'click .start-server': 'onClickStartServer',
            'click .shutdown-server': 'onClickShutdownServer'
        },

        onClickNextServersPage: function() {
            if (this.page < this.last_page) {
                this.page++;
                this.render();
            }
            return false;
        },

        onClickPrevServersPage: function() {
            if (this.page > 0) {
                this.page--;
                this.render();
            }
            return false;
        },

        onClickManageServer: function(e) {

            var serverId = $(e.currentTarget).attr('data-server-id');
            alert('Manage server ' + serverId);
            return false;
        },

        onClickStartServer: function(e) {

            var serverId = $(e.currentTarget).attr('data-server-id');
            alert('Start server ' + serverId);
            return false;
        },

        onClickShutdownServer: function(e) {

            var serverId = $(e.currentTarget).attr('data-server-id');
            alert('Shutdown server ' + serverId);
            return false;
        },

        initialize: function() {
            this.rendered = false;
            this.servers = [];
            this.page = 0;
            this.last_page = 0;
        },

        loadServers: function() {

            var self = this;
            $.getJSON('/servers.json')
                .success(function(json) {
                    self._parseServers(json);
                })
                .error(function() {
                    alert('Error contacting API: Could not retrieve servers.');
                });
        },

        _parseServers: function(json) {

            if ('servers' in json) {

                // Lazy. Just dump it and let the template render itself.
                this.servers = json.servers;

                // TODO: Re-order by online status so the online 
                // server is first, if not supplied.

                // Only show 5 servers per page
                this.last_page = Math.ceil(this.servers.length / 5) - 1;
                this.page = 0;
            }
            else {
                alert('Invalid servers response from API');

                this.servers = [];
                this.last_page = 0;
                this.page = 0;
            }

            // Redraw!
            this.render();
        },

        render: function() {
            this.rendered = true;
            
            this.$el.html(this.template({
                servers: this.servers.slice(this.page * 5, this.page * 5 + 5),
                page: this.page,
                last_page: this.last_page
            }));

            return this;
        }
    });
    
    return ServersView;
});
