
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'isotope',
    'packerymode',
    'jquery.select2',
    'text!templates/mumble/index.html'
], function($, _, Backbone, App, Isotope, Select2, PackeryMode, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
         
        events: {
            "click #load-more-images": "onLoadMoreImagesClick"
        },

        initialize: function() {

            // Start at the first (0th) page for posts
            this.next_page = '/api/mumble/posts/page/0';
        },

        close: function() {
            $('#nickname').off('change');
            $('#images, #videos').off('change');

            this.remove();
        },

        updateImagesFilter: function() {
            var classes = [];

            // Filter: nickname AND (image OR video)

            // Filter by an individual, if set
            var nickname = $('#nickname').val();
            if (nickname.length > 0) {
                nickname = '.nickname-' + nickname;
            }

            // Filter by video formats
            if ($('#videos').is(':checked')) {
                classes.push(nickname + '.video');
            }

            // Filter by images
            if ($('#images').is(':checked')) {
                classes.push(nickname + '.image');
                classes.push(nickname + '.imgur');
            }

            var filter = classes.join(', ');

            console.log('Using filter: ' + filter);
            this.isotope.arrange({
                filter: filter
            });
        },

        addPosts: function(posts) {
            var domElements = [];

            _.each(posts, function(post) {

                // If it doesn't already exist, add it
                if ($('.isotope-container').find('#mumble-post-' + post.id).length < 1) {

                    // Add base container
                    var element = $('<div/>')
                        .attr('id', 'mumble-post-' + post.id)
                        .addClass('isotope-item')
                        .addClass(post.type)
                        .addClass('nickname-' + post.nickname); // TODO: Clean this up for nicknames with bad characters

                    // If it's an image type post, modify the size based on our image properties
                    if (post.type == 'image') {
                    
                        element.css({
                            width: post.properties.width + 'px',
                            height: post.properties.height + 'px',
                            background: 'url(' + post.url + ')'
                            //background: 'rgb('+r+','+g+','+b+')'
                        });

                        // Generate html content, with the image details
                        element.append('<div class="details"><img src="/img/default-profile-icon.png" />'
                                + '<p>Posted by ' + post.nickname + '<br/>' + post.date + '</p>'
                                + '</div>');  

                    } else if (post.type == 'video') {
                        // YouTube url, load the thumbnail from YT

                        var imageUrl = 'http://img.youtube.com/vi/';

                        // Try to generate a thumbnail from the video
                        // TODO: Make this a LOT smarter. Can't handle playlists, can't handle youtu.be links, etc.
                        var match = post.url.match(/v=([0-9A-Za-z\-_]+)/);
                        if (match !== null) {
                            imageUrl += match[0].substr(2) + '/0.jpg';
                        }

                        // If we can't match, youtube will give us a 404 and some generic image to use.
                        // Good enough for now.. but still need to make this more robust.

                        element.css({
                            width: '480px',
                            height: '360px',
                            background: 'url(' + imageUrl + ')'
                        });

                        // Generate html content, with link off to whatever
                        element.append('<div class="details"><img src="/img/default-profile-icon.png" />'
                                    + '<p>Posted by ' + post.nickname + '<br/>' + post.date + '</p><a class="action" href="' + post.url + '">'
                                    + '<img src="http://momixpc.com/wp-content/uploads/2014/12/YouTube-icon-full_color.png" /></a>'
                                    + '</div>');
                    } else {
                        // Generic link

                        // Just make some static thing, for now
                        element.css({
                            width: '100px',
                            height: '100px',
                            background: '#CC0000'
                        });

                        // Generate html content, with link off to whatever
                        element.append('<div class="details"><img src="/img/default-profile-icon.png" />'
                                    + '<p>Posted by ' + post.nickname + '<br/>' + post.date + '</p><a class="action" href="' + post.url + '">'
                                    + '<img src="#" /></a>'
                                    + '</div>');
                    }

                    // Push the DOM object for Isotope (not the jquery selector)
                    domElements.push(element[0]);
                }

            }, this);

            // Inject the new elements into our isotope container
            $('.isotope-container').append(domElements);
            
            // Use isotope to reflow
            this.isotope.appended(domElements);
        },
        
        onLoadMoreImagesClick: function() {

            var self = this;
            $.getJSON('http://local.sybolt.com:8888' + this.next_page)
                .success(function(json) {
                    self.next_page = json.links.next_page;
                    self.addPosts(json.posts);
                })
                .error(function() {
                    alert('Error contacting API: Could not retrieve additional posts.');
                });

            return false;
        },

        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            this.$el.html(this.template({
                // vars here...
            }));

            // Configure Isotope for the container
            this.isotope = new window.Isotope( $('.isotope-container')[0], {
                itemSelector: '.isotope-item',
                layoutMode: 'packery',
                stamp: '.stamp'
            });

            var self = this;

            // Activate select2() plugin on our nickname filter
            $('#nickname').select2({
                language: "en", // TODO This is a hack to get around the i18n include issue with RequireJS
                placeholder: "Filter by nickname",
                allowClear: true,
                templateResult: function(user) {
                    console.log(user);
                    var markup = 
                        '<div class="nickname-option">' +
                        '<img src="/img/default-profile-icon.png" />' + 
                        user.text + 
                        '</div>';

                    return markup;
                },
                templateSelection: function (user) {
                    console.log(user);
                    return user.text;
                }
            }).on('change', function(e) {
                self.updateImagesFilter();
            });


            $('#images, #videos').on('change', function(e) {
                self.updateImagesFilter();
            });
            
            // Emulate a click to load the first set of images
            this.onLoadMoreImagesClick();

            return this;
        }
    });
    
    return View;
});
