
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/profile/index.html',
    'views/profile/minecraft-identity',
    'views/profile/steam-identity',
    'views/profile/mumble-identity',
    'serializejson'
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
            "click .add-gravitar": "onAddGravitarClick",
            "click #save-sybolt-profile": "onSaveChangesClick"
        },

        onSaveChangesClick: function() {

            var $form = $('#sybolt-profile');

            // If our new password field has content, make it (and the copy) required prior to validating
            var $newPassword = $form.find('input[name="password"]');
            var $newPassword2 = $form.find('input[name="password2"]');
            
            if ($newPassword.val().length > 0) {
                // Password filled out, apply validation rules
                $newPassword.attr('data-validate', 'required,min(8)');
                $newPassword2.attr('data-validate', 'required,min(8),newPasswordConfirm');
            } 
            else {
                // Clear validation rules
                $newPassword.attr('data-validate', '');
                $newPassword2.attr('data-validate', '');
            }

            // If the validator passes, push up the changes to our API
            $form.validate(function(success) {
                if (success) {

                    // Push profile changes
                    $.ajax({
                        type: 'PUT',
                        url: App.getApiBaseUrl() + '/api/profile',
                        data: $form.serializeJSON(),
                        dataType: 'json',
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(json) {
                            console.log('success', json);
                            alert('Profile Saved!');

                            // Update application profile
                            App.setProfile(json);
                        },
                        error: function(jqXHR) {
                            if (jqXHR.responseJSON) {
                                alert(jqXHR.responseJSON.message);
                            }
                            else {
                                alert('An unspecified error has occurred while trying to save the profile.');
                            }
                        }
                    });
                }
            });

            return false;
        },
        
        onDeleteAccountClick: function() {
            if (confirm('Are you sure you want to delete your account? All information associated with your Sybolt Profile will be removed.')) {
                alert('Yea, right.');
                // TODO: API Call: DELETE /api/profile [with auth]
                // followed by a redirect to /home and deletion of the cached token
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

            if (!App.profile) {
                App.router.navigate('home', {trigger: true});
            }

            // TODO: Do a thing with loading from sybolt
            // Presumably, the original API call /api/profile should also return
            // the subset of identities we can modify. Should be able to just tie
            // into App.profile 
            this.identityViews = [];
        },
        
        close: function() {

            $('#email').off('keyup.toggle-additional-fields');
            this.remove();
        },

        render: function() {
            
            if (!App.profile) {
                return this;
                // TODO: Better alternate renderer. 
                // Should actually automatically redirect, or require
                // authorization before even loading. 
            }

            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            // TODO: render identityViews

            this.$el.html(this.template({
                profile: App.profile
            }));

            $('#email').on('keyup.toggle-additional-fields', function(e) {
                if ($(this).val().length < 1) {
                    $(this).parent().find('.checkbox').addClass('hidden');
                } else {
                    $(this).parent().find('.checkbox').removeClass('hidden');
                }
            });

            $('#sybolt-profile').verify();

            return this;
        }
    });
    
    return View;
});
