
require.config({
    //baseUrl: '../',
    paths: {
        'jquery': 'libs/jquery-2.1.1',
        'underscore': 'libs/underscore',
        'backbone': 'libs/backbone',
        'text': 'libs/text',
        'verify': 'libs/verify',
        'notify': 'libs/notify-custom',
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
            exports: '$.notify'
        },
        'isotope': { // No-AMD mod to resolve AMD require issues
            deps: ['jquery'],
            exports: '$.isotope'
        },
        'packerymode': { // No-AMD mod to work with no-amd modded Isotope
            deps: ['jquery', 'isotope'],
            init: function($, Isotope) {

            }
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

                        //element.siblings(".tip").html(text || '');
                        /*console.log('VALIDATION ERROR: ' + text);

                        var selector = 'label[for="' + element.attr('name') + '"]';
                        console.log(selector);

                        element.siblings(selector)
                            .find('span.error-notice')
                                .html(text || '');*/
                        /*
                            Notify setup:
                                
                        */
                        console.log('VALIDATION ERROR: ' + text);
                        $.notify(element, text, {
                            position: 'right',
                            autoHide: false,
                            showAnimation: 'fadeIn',
                            showDuration: 400,
                            hideAnimation: 'fadeOut',
                            hideDuration: 400,
                            gap: 10 // padding between element and notification
                        });
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
                url: 'http://local.sybolt.com:8888/api/authenticate',
                dataType: 'json',
                success: function(json) {
                    console.log('success', json);
                    //var profile = new SyboltProfile(json);
                    window.App.setProfile(json);
                },
                error: function(jqXHR) {
                    //alert(jqXHR.responseJSON.message);
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
