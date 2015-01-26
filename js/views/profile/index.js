
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/profile/index.html',
    'views/profile/minecraft-identity',
    'views/profile/steam-identity',
    'views/profile/mumble-identity'
], function($, _, Backbone, App, Template, MinecraftIdentityView, SteamIdentityView, MumbleIdentityView) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            //"click .scroll-up": "scrollUp"
            "click .delete-account": "onDeleteAccountClick",
            "click .add-minecraft": "onAddMinecraftClick",
            "click .add-steam": "onAddSteamClick",
            "click .add-mumble": "onAddMumbleClick",
            "click .add-gravitar": "onAddGravitarClick"
        },
        
        onDeleteAccountClick: function() {
            if (confirm('Are you sure? This action cannot be undone')) {
                alert('Yea, right.');
            }

            return false;
        },

        onAddMinecraftClick: function() {
        
            var view = new MinecraftIdentityView();

            this.identityViews.push(view);
            
            var element = $('<div/>')
                .addClass('identity')
                .addClass('minecraft');

            // Render the new view to the top of our identities list
            this.$('.identities').prepend(element);
            view.setElement(element).render();

            return false;
        },

        onAddSteamClick: function() {

            // Make sure they can only add one identity of this type
            if (this.$('.identity.steam').length > 0) {
                alert('You can only have one Steam account associated with your profile.');
                return false;
            }

            var view = new SteamIdentityView();

            this.identityViews.push(view);
            
            var element = $('<div/>')
                .addClass('identity')
                .addClass('steam');

            // Render the new view to the top of our identities list
            this.$('.identities').prepend(element);
            view.setElement(element).render();

            return false;
        },

        onAddMumbleClick: function() {
            
            // Make sure they can only add one identity of this type
            if (this.$('.identity.mumble').length > 0) {
                alert('You can only have one Mumble account associated with your profile.');
                return false;
            }

            var view = new MumbleIdentityView();

            this.identityViews.push(view);
            
            var element = $('<div/>')
                .addClass('identity')
                .addClass('mumble');

            // Render the new view to the top of our identities list
            this.$('.identities').prepend(element);
            view.setElement(element).render();

            return false;
        },

        onAddGravitarClick: function() {
            
            return false;
        },

        initialize: function() {

            // TODO: Do a thing with loading from sybolt
            this.identityViews = [];
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            // TODO: render identityViews

            this.$el.html(this.template({
                // vars here...
            }));

            $('#email').on('keyup.toggle-additional-fields', function(e) {
                if ($(this).val().length < 1) {
                    $(this).parent().find('.checkbox').addClass('hidden');
                } else {
                    $(this).parent().find('.checkbox').removeClass('hidden');
                }
            });

            return this;
        }
    });
    
    return View;
});
