
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html',
    'verify'
], function($, _, Backbone, Template) {
    'use strict';

    var HeaderView = Backbone.View.extend({
        
        el: $('#header'),
        template: _.template(Template),
        style: 'default',
        
        events: {
            "click .header-logo": "onHeaderLogoClick",
            "click #mmm-hamburgers": "onHamburgerClick",
            "click .login-button": "onLoginClick",
            "click .logout-button": "onLogoutClick",
        },

        onLogoutClick: function() {

            // Push logout attempt
            $.ajax({
                type: 'DELETE',
                url: App.getApiBaseUrl() + '/authenticate',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(json) {
                    console.log('success', json);
                    //var profile = new SyboltProfile(json);
                    //window.App.clearProfile();
                    //window.App.router.navigate('home', {trigger: true});

                    // Force our application to reload entirely,
                    // in case there are needs to be content/permission changes after login.
                    window.location.reload();
                },
                error: function(jqXHR) {
                    alert(jqXHR.responseJSON.message);
                    //window.App.clearProfile();
                    //window.App.router.navigate('home', {trigger: true});

                    // Force our application to reload entirely,
                    // in case there are needs to be content/permission changes after login.
                    window.location.reload();
                }
            });
        },

        onLoginClick: function() {

            var $form = $('form.login-form');

            // Run one more validator pass.
            // If all looks good on the front end, pass to the server for a login attempt.
            $form.validate(function(success) {
                if (success) {
                    // Push login attempt
                    $.ajax({
                        type: 'POST',
                        url: App.getApiBaseUrl() + '/authenticate',
                        data: $form.serialize(),
                        dataType: 'json',
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(json) {
                            console.log('success', json);

                            // Force our application to reload entirely, 
                            // in case there needs to be content/permission changes after login.
                            window.location.reload();
                        },
                        error: function(jqXHR) {
                            if (jqXHR.responseJSON) {
                                alert(jqXHR.responseJSON.message);
                            }
                            else {
                                alert('An unspecified error has occurred while trying to login.');
                            }
                        }
                    });
                }
            });
           
            return false;
        },

        onHamburgerClick: function() {
            this.toggleNavigation();
            return false;
        },

        onHeaderLogoClick: function() {
            // Navigate back to the home page
            App.router.navigate("home", {trigger: true});
            return false;
        },

        toggleNavigation: function() {

            // Delegate to hide/show so we can apply additional rules 
            // on events if necessary
            if ($('#header').hasClass('open')) {
                this.hideNavigation();
            } else {
                this.showNavigation();
            }

            return false;
        },

        showNavigation: function() {
            $('#header').addClass('open');
            $('#header').removeClass('closed');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').addClass('open');
            $('#mmm-hamburgers').addClass('open');

            return false;
        },

        hideNavigation: function() {
            $('#header').removeClass('open');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').removeClass('open');
            $('#mmm-hamburgers').removeClass('open');

            // Hide any errors in the login form
            $('.login .validation-error').addClass('hidden');
            $('.login .error').removeClass('error');

            // Wait until the closing animation is complete until we consider
            // ourselves closed
            window.setTimeout(function(){
                $('#header').addClass('closed');
            }, 500);

            return false;
        },

        render: function() {

            this.$el.html(this.template({
                style: this.style,
                profile: window.App.profile
            }));

            // Hook verify.js to the login form, if it exists
            $('form.login-form').verify();
            
            return this;
        },
        
        setStyle: function(style) {
            console.log('Setting style to ' + style);
            
            // Perform an animated transition, rather than re-rendering
            
            // Swap style CSS
            this.$el
                .removeClass(this.style + '-style')
                .addClass(style + '-style');
            
            this.style = style;

            this.hideNavigation();

            return this;
        }
    });
    
    return HeaderView;
});
