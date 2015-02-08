
require.config({
    //baseUrl: '../',
    paths: {
        'jquery': 'libs/jquery-2.1.1',
        'underscore': 'libs/underscore',
        'backbone': 'libs/backbone',
        'text': 'libs/text',
        'verify': 'libs/verify',
        'notify': 'libs/notify-custom',
        'serializejson': 'libs/jquery.serializejson',
        'isotope': 'libs/isotope.pkgd.no-amd',
        'packerymode': 'libs/packery-mode.pkgd.no-amd',
        'jquery.select2': 'libs/select2',
        'templates': '../templates',
        'flowplayer': '//releases.flowplayer.org/js/flowplayer-3.2.13'
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

                // Custom NotifyJS theme
                // TODO: Define this in LESS, not in the fucking javascript
                // -- Disregard, NotifyJS is dumb and requires a JS template
                /*
                @light-purple: #977FA6;
                @purple: #685475;
                @green: #09AD7E;
                @grey: #D0D0D0;
                @primary: #D9D1C7;
                @secondary: #2E2C2A;
                @light-grey: #E6E6E6;
                @red: #9D2B2B;

                - Swatches from Flat-UI build

                    @sybolt-pale:   #F2EDE4;
                    @sybolt-tan:    #D9D1C7;
                    @sybolt-purple: #392F40;
                    @sybolt-pink:   #736071;
                    @sybolt-grey:   #8C8681;
                    @sybolt-brown:  #3C3937;
                    @sybolt-lpurp:  #685475; //#574B5F;

                    @sybolt-green:  #579762; // #4FBA7E;
                    @sybolt-gold:   #FF9815; // #FFB533;


                */

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
    'router',
    'views/header',
    'views/footer'
], function($, _, Backbone, Router, HeaderView, FooterView) {
    'use strict';
    
    window.App = {
        
        initialize: function() {
        
            // Setup Header/Footer views
            this.headerView = new HeaderView();
            this.footerView = new FooterView();
            
            console.log('starting router');
            
            // Set up router to switch between content views
            this.router = new Router;
            
            if (!Backbone.history.start({
                pushState: true, 
                root: '/' // '/sybolt-backbone/'
            })) {
                console.log('Initial url does not match in router');
            }
            
            // Draw header
            this.headerView.render();
        
            // Draw footer
            this.footerView.render();
        
            // Override anchors to utilize Backbone's navigation
            $(document).on("click", "a:not([data-bypass])", function(e) {
                var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
                var root = location.protocol + "//" + location.host + Backbone.history.options.root;

                if (href.prop && href.prop.slice(0, root.length) === root) {
                    e.preventDefault();
                    Backbone.history.navigate(href.attr, true);
                }
            });

            // TODO: Throw this somewhere better

            // Try to re-authenticate with the server
            $.ajax({
                type: 'GET',
                url: this.getApiBaseUrl() + '/authenticate',
                dataType: 'json',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function(json) {
                    console.log('success', json);
                    //var profile = new SyboltProfile(json);
                    window.App.setProfile(json);
                },
                error: function(jqXHR) {
                    // If we can't authenticate, silently fail and clear the profile.
                    // TODO: Check for a local token before even making this call.

                    /*if (jqXHR.responseJSON) {
                        alert(jqXHR.responseJSON.message);
                    }
                    else {
                        alert('An unspecified error has occurred while trying to authenticate with the API');
                    }
                    */
                    window.App.clearProfile();
                }
            });
        },
        
        setContentView: function(view) {
            
            if (this.contentView) {
                this.contentView.setElement(null);
                this.contentView.close();
            }
            
            this.contentView = view;
            this.contentView.setElement($('#content')).render();
            
            // @todo whatever post-processing that we must perform after changing the page
        },

        setProfile: function(json) {
            this.profile = json;

            // Redraw the header
            this.headerView.render();
        },

        clearProfile: function() {
            this.profile = undefined;

            // Redraw the header
            this.headerView.render();
        },

        getApiBaseUrl: function() {
            return '//' + document.domain + ':8888/api';
        }
    };

    // Create a custom view for commonly used functionality
    App.View = Backbone.View.extend({
        
        /** 
         * Optionally overridable to clean up event hooks/subviews 
         */
        close: function() {
            this.remove(); // Destroy this
        },
        
        /**
         * Render a sub-view within a specific selector of this view. 
         * Useful for our main render() call to also cascade render children.
         */
        renderSubview: function(view, selector) {
        
            // See: http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
            view.setElement(this.$(selector)).render();
            return this;
        }
    });
    
    App.initialize();
    
    return App;
});
