
// Bootstrap config with the minimal necessities
require.config({
    //baseUrl: '../',
    paths: {
        'jquery': 'vendor/jquery-2.1.1',
        'underscore': 'vendor/underscore',
        'backbone': 'vendor/backbone',
        'text': 'vendor/text',
        'verify': 'vendor/verify',
        'notify': 'vendor/notify-custom',
        'serializejson': 'vendor/jquery.serializejson',
        'tubular': 'vendor/jquery.tubular',
        'isotope': 'vendor/isotope.pkgd.no-amd',
        'packerymode': 'vendor/packery-mode.pkgd.no-amd',
        'jquery.select2': 'vendor/select2',
        'flowplayer': '//releases.flowplayer.org/js/flowplayer-3.2.13',

        // Applications
        'test': 'apps/test', //'apps/build/test.min',
        'live': 'apps/live', //'apps/build/live.min'
    },
    shim: {
        // Non-AMD scripts wrapped with the shim
        'flowplayer': {
            exports: 'Flowplayer'
        },
        'notify': {
            deps: ['jquery'],
            exports: '$.notify',
            init: function($) {
                $.notify.addStyle("sybolt", {
                  html: "<div>\n<span data-notify-text></span>\n</div>",
                  classes: {
                    base: {
                      "padding": "3px 10px",
                      "background-color": "#fcf8e3",
                      "border": "1px solid #fbeed5",
                      "border-radius": "4px",
                      "white-space": "nowrap",
                      "background-repeat": "no-repeat",
                      "background-position": "3px 7px"
                    },
                    error: {
                      "color": "#FFFFFF",
                      "background-color": "#9D2B2B",
                      "border-color": "#9D2B2B",
                      "background": ""
                    },
                    success: {
                      "color": "#FFFFFF",
                      "background-color": "#09AD7E",
                      "border-color": "#09AD7E",
                      "background": ""
                    },
                    info: {
                      "color": "#FFFFFF",
                      "background-color": "#977FA6",
                      "border-color": "#977FA6",
                      "background": ""
                    },
                    warn: {
                      "color": "#FFFFFF",
                      "background-color": "#FF9815",
                      "border-color": "#FF9815",
                      "background": ""
                    }
                  }
                });

                $.notify.defaults({
                    style: "sybolt"
                });
            }
        },
        'serializejson': {
            deps: ['jquery'],
            exports: '$.serializeJSON',
            init: function($) {
                // See: https://github.com/marioizquierdo/jquery.serializeJSON
                $.serializeJSON.defaultOptions.parseAll = true;
                $.serializeJSON.defaultOptions.checkboxUncheckedValue = "false";
                $.serializeJSON.defaultOptions.useIntKeysAsArrayIndex = true;
            }
        },
        'tubular': {
            deps: ['jquery'],
            exports: '$.tubular',
            init: function($) {}
        },
        'isotope': { // No-AMD mod to resolve AMD require issues
            deps: ['jquery'],
            exports: '$.isotope'
        },
        'packerymode': { // No-AMD mod to work with no-amd modded Isotope
            deps: ['jquery', 'isotope']
        },
        'verify': {
            deps: ['jquery', 'notify'],
            init: function($, notifyScoped) {
                // Configure verify.js for a sybolt style
                // TODO: Perform this configuration elsewhere? It needs to be done whenever
                // verify.js is first generated...
                $.verify({
                    debug: false,
                    autoInit: true,
                    validationEventTrigger: "blur", // Name of the event triggering field validation
                    scroll: true, // Automatically scroll viewport to the first error
                    focusFirstField: true,
                    hideErrorOnChange: false,
                    skipHiddenFields: true,
                    skipDisabledFields: true,
                    showPrompt: true,
                    prompt: function(element, text, opts) {

                        // TODO: better selector, maybe. 
                        var $ele = element.parent().find('div.validation-error[data-for="' + element.attr('id') + '"]');
                        
                        if (text) {
                            $ele.html(text).removeClass('hidden');
                        } 
                        else {
                            $ele.addClass('hidden');
                        }
                        
                        /*console.log('VALIDATION ERROR: ' + text);

                        $.notify(element, text, {
                            position: 'right',
                            autoHide: false,
                            showAnimation: 'fadeIn',
                            showDuration: 400,
                            hideAnimation: 'fadeOut',
                            hideDuration: 400,
                            gap: 10 // padding between element and notification
                        });
                        */
                    }
                });
    
                // Custom password-confirm (second password input) verifier. 
                // Reason this is not a rule group is that the main login form
                // switches between login/register modes. In login mode, it doesn't
                // behave well with one input being a group with another hidden input.
                $.verify.addRules({
                    newPasswordConfirm: function(r) {
                        // Assumption is that r is the second password field, and the first to
                        // compare against is just named "password" within the same form
                        var first = r.form.find('input[name="password"]').val();
                        var second = r.val();

                        if (first !== second) {
                            return "Passwords do not match";
                        }

                        return true;
                    }
                });
            }
        }
    }
});

define([
    'jquery',
    'underscore',
    'backbone',
    'verify' // for $.validate
], function($, _, Backbone) {

    // Configure a router for accessing apps
    var Router = Backbone.Router.extend({
        routes: {
            ':app(/:section)': 'app'
        },

        app: function(app, section) {
            require([app], function(App) {
                if (App) {
                    Sybolt.loadApp(App);
                } 
                else {
                    // 404 bs
                    alert('App [' + app + '] not found');
                }
            });
        }
    });
    
    // View for the header, to handle various interactive events
    var HeaderView = Backbone.View.extend({
        el: $('header'),
        
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
            Sybolt.router.navigate("home", {trigger: true});
            return false;
        },

        toggleNavigation: function() {

            // Delegate to hide/show so we can apply additional rules 
            // on events if necessary
            if ($('header').hasClass('open')) {
                this.hideNavigation();
            } else {
                this.showNavigation();
            }

            return false;
        },

        showNavigation: function() {
            $('header').addClass('open').removeClass('closed');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').addClass('open');
            $('#mmm-hamburgers').addClass('open');

            return false;
        },

        hideNavigation: function() {
            $('header').removeClass('open');

            // TODO: Reduce these to just checking for #header.open
            $('.header-navigation').removeClass('open');
            $('#mmm-hamburgers').removeClass('open');

            // Hide any errors in the login form
            $('.login .validation-error').addClass('hidden');
            $('.login .error').removeClass('error');

            // Wait until the closing animation is complete until we consider
            // ourselves closed
            window.setTimeout(function(){
                $('header').addClass('closed');
            }, 500);

            return false;
        },

        render: function() {

            this.$el.html(this.template({
                style: this.style,
                profile: Sybolt.profile
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
    
    var Sybolt = {
        
        initialize: function() {
        
            // Set up router to switch between content views
            this.router = new Router;
            this.header = new HeaderView();
            this.app = null; 
            
            if (!Backbone.history.start({
                pushState: true, 
                root: '/'
            })) {
                console.log('Initial url does not match in router');
            }
            
            // Override anchors to utilize Backbone's navigation
            $(document).on("click", "a:not([data-bypass])", function(e) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
                var root = location.protocol + "//" + location.host + Backbone.history.options.root;

                if (href.prop && href.prop.slice(0, root.length) === root) {
                    e.preventDefault();
                    Backbone.history.navigate(href.attr, true);
                }
            });

            // Fire off an enter event whenever we click enter on an input element (for backbone)
            $('input').keyup(function(e) {
                if (e.keyCode == 13) {
                    $(this).trigger('enter');
                }
            });
        },

        loadApp: function(app) {

            this.app = app;
            var view = app.getView();

            this.setContentView(new view());
            this.header.hideNavigation();
        },
        
        setContentView: function(view) {
            
            // Close the old content view
            if (this.contentView) {
                this.contentView.setElement(null);
                this.contentView.close();
            }
            
            this.contentView = view;
            this.contentView.setElement($('main')).render();
            
            // Scroll to the top of the page
            $(window).scrollTop(0);
        },

        getApiBaseUrl: function() {
            // TODO: Clean this up!
            // Need a proper service discovery method.
            return '//' + document.domain + ':8888/api';
        },
    };

    Sybolt.initialize();
    
    window.Sybolt = Sybolt;
    return Sybolt;
});
