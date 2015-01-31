
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
            "click .new-user-button": "onNewUserClick",
            "click .login-button": "onLoginClick",
            "click .logout-button": "onLogoutClick"
        },
        
        onNewUserClick: function() {

            // Toggle based on current visibility
            if ($('.register-fields').hasClass('hidden')) {
                this.showRegistrationForm();
            } 
            else {
                this.hideRegistrationForm();
            }

            return false;
        },

        hideRegistrationForm: function() {

            // Switch back to Login form
            $('.register-fields').addClass('hidden');
            $('.login h1').html('Login');
            $('.new-user-button').html('NEW HERE?');
            $('.login-button').html('LOGIN');
        },

        showRegistrationForm: function() {

            // If we're not on the home page, we need to navigate there
            // to show the full registration form. Otherwise, it won't
            // fit in the pulldown header.
            var route = Backbone.history.fragment;
            if (route !== 'home' && route !== 'home/register') {
                App.router.navigate('home/register', {trigger: true});
            }

            $('.register-fields').removeClass('hidden');
            $('.login h1').html('Register');
            $('.new-user-button').html('NEVERMIND!');
            $('.login-button').html('REGISTER');
        },

        onLogoutClick: function() {

            // Push logout attempt
            $.ajax({
                type: 'DELETE',
                url: 'http://local.sybolt.com:8888/api/authenticate',
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

            if ($('.register-fields').hasClass('hidden')) {
                // If registration fields are hidden, run one more validator pass.
                // If all looks good on the front end, pass to the server for a login attempt.
                $form.validate(function(success) {
                    if (success) {

                        // Push login attempt
                        $.ajax({
                            type: 'POST',
                            url: 'http://local.sybolt.com:8888/api/authenticate',
                            data: $form.serialize(),
                            dataType: 'json',
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function(json) {
                                console.log('success', json);
                                //var profile = new SyboltProfile(json);
                                //window.App.setProfile(json);

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
                                // window.App.clearProfile();
                                
                                // Force our application to reload entirely,
                                // in case there are needs to be content/permission changes after login.
                                window.location.reload();
                            }
                        });
                    }
                });
            }
            else {
                // If registration fields are visible, run one more validator pass.
                // If all looks good on the front end, pass to the server for a registration attempt.
                $form.validate(function(success) {
                    if (success) {
                        alert('Register no worko');
                    }
                });
            }

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

            // Wait until the closing animation is complete until we consider
            // ourselves closed
            //$('#header').delay(2000).addClass('closed');

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

            if (style !== 'home') {
                this.hideRegistrationForm();
            }
            
            //this.render();
            return this;
        }
    });
    
    return HeaderView;
});
