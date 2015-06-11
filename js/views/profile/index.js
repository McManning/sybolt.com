
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/profile/index.html',
    'serializejson'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            //"click .scroll-up": "scrollUp"
            "click .delete-account": "onDeleteAccountClick",
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
                        url: App.getApiBaseUrl() + '/profile',
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

        initialize: function() {

            // TODO: Better security. I don't even want them loading this script.
            if (!App.profile) {
                App.router.navigate('home', {trigger: true});
            }
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
            
            // Render base profile html
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
