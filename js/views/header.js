
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html',
    'verify'
], function($, _, Backbone, headerTemplate) {
    'use strict';



    var HeaderView = Backbone.View.extend({
        
        el: $('#header'),
        template: _.template(headerTemplate),
        style: 'default',
        
        events: {
            "click .header-logo": "goHomeAction",
            "click #mmm-hamburgers": "toggleNavigation",
            "click .new-user-button": "onNewUserClick",
            "click .login-button": "onLoginClick"
        },
        
        onNewUserClick: function() {
            
            // Toggle visiblity of the registration section of the form
            $('.register-fields').toggleClass('hidden');

            // Adjust button text based on form visibility
            if ($('.register-fields').hasClass('hidden')) {
                $('.new-user-button').html('NEW HERE?');
                $('.login-button').html('LOGIN');

            } 
            else {
                $('.new-user-button').html('NEVERMIND!');
                $('.login-button').html('REGISTER');

            }

            return false;
        },

        onLoginClick: function() {

            if ($('.register-fields').hasClass('hidden')) {
                // If registration fields are hidden, run one more validator pass.
                // If all looks good on the front end, pass to the server for a login attempt.
                $('form.login-form').validate(function(success) {
                    if (success) {
                        alert('Login no worko');
                    }
                });
            }
            else {
                // If registration fields are visible, run one more validator pass.
                // If all looks good on the front end, pass to the server for a registration attempt.
                $('form.login-form').validate(function(success) {
                    if (success) {
                        alert('Register no worko');
                    }
                });
            }

            return false;
        },

        goHomeAction: function() {
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
            
            var data = {style: this.style};
            var compiled = this.template(data);
            
            this.$el.html(compiled);

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
            
            //this.render();
            return this;
        }
    });
    
    return HeaderView;
});
