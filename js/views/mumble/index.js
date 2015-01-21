
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
            var nickname = $('#nickname').val().toLowerCase();
            if (nickname.length > 0) {
                nickname = '.nickname-' + nickname;
            }

            // Filter by video formats
            if ($('#videos').is(':checked')) {
                classes.push(nickname + '.youtube');
            }

            // Filter by images
            if ($('#images').is(':checked')) {
                classes.push(nickname + '.image');
            }

            var filter = classes.join(', ');

            console.log('Using filter: ' + filter);
            this.isotope.arrange({
                filter: filter
            });
        },
        
        onLoadMoreImagesClick: function() {
            var domElements = [];

            // Example data pulled from a cache of sybot
            // Pulled with: select '{type:'image', url: "' || filename || '", width: "' || width || 'px", height: "' || height || 'px"},' from images;
            var data = [
                {type:'image', url: 'sybot_images/b4f9abef1aaac9cceded5b3a2231d090.png', width: '500px', height: '300px'},
                {type:'image', url: 'sybot_images/0b71d821b60417006c7f3eff89aea918.png', width: '193px', height: '240px'},
                {type:'image', url: 'sybot_images/e55b933bd69c4d068b6b12883ce67b13.jpg', width: '125px', height: '91px'},
                {type:'image', url: 'sybot_images/8338f8dcdd0ea8321b3d3b1c047b82df.png', width: '300px', height: '100px'},
                {type:'image', url: 'sybot_images/7a9d4950ab3c748a29f47766c7dee2df.jpg', width: '584px', height: '326px'},
                {type:'image', url: 'sybot_images/d1f80e5b3675d9054d43d0b51007e924.jpg', width: '379px', height: '270px'},
                {type:'image', url: 'sybot_images/dca31ab000f3f12b56bf1f0d1730bc23.jpg', width: '480px', height: '270px'},
                {type:'image', url: 'sybot_images/aad026c18958493321bb22304e772b53.jpg', width: '331px', height: '270px'},
                {type:'image', url: 'sybot_images/0f8f0033a5c80f0157ee4d2572ee69b1.jpg', width: '308px', height: '308px'},
                {type:'image', url: 'sybot_images/f1166c353846460d0df66c002e6a4f48.jpg', width: '480px', height: '115px'},
                {type:'image', url: 'sybot_images/44517115ed0b24cacef9da6a0822351d.jpg', width: '397px', height: '270px'},
                {type:'image', url: 'sybot_images/93bfc3031dca5bd7b4be86669a7a2ac6.jpg', width: '480px', height: '270px'},
                {type:'image', url: 'sybot_images/92514316519509d3f8d55a595b61ac09.png', width: '99px', height: '270px'},
                {type:'image', url: 'sybot_images/68953218423d4f21d6c8c56bedd0b3c2.jpg', width: '284px', height: '270px'},
                {type:'image', url: 'sybot_images/939d3fc22d357fa4923700bc5bba7dce.jpg', width: '666px', height: '634px'},
                {type:'image', url: 'sybot_images/9e92aaef9e0c028361c1acf66b94e4c1.jpg', width: '167px', height: '270px'},
                {type:'image', url: 'sybot_images/0e223ceac5371d1c5d0e28e0a82bc893.jpg', width: '480px', height: '270px'},
                {type:'image', url: 'sybot_images/447f71fddef04a4fc226507814c2b080.jpg', width: '480px', height: '270px'},
                {type:'image', url: 'sybot_images/47e97c083142dff11be7616c57b24003.png', width: '220px', height: '270px'},
                {type:'image', url: 'sybot_images/778795a20eaba798ab4b630f9f46ca05.png', width: '152px', height: '270px'},
                {type:'image', url: 'sybot_images/7490c2f53a5377e20b18e859b3306577.jpg', width: '208px', height: '270px'},
                {type:'image', url: 'sybot_images/2e5c57d9d3e21a26753e23c72c47fdd5.jpg', width: '246px', height: '300px'},
                {type:'image', url: 'sybot_images/4a6d3672251214351c95533e71cd5e18.png', width: '139px', height: '270px'},
                {type:'image', url: 'sybot_images/787079f52389ea8621c82983db3e06b8.jpg', width: '425px', height: '341px'},
                {type:'image', url: 'sybot_images/ff69c6636a6ae0135aedb37a9f4a67ab.jpg', width: '392px', height: '270px'},
                {type:'image', url: 'sybot_images/07bab6c3c2bb1fdc7fc95bdd3793787a.jpg', width: '480px', height: '240px'},
                {type:'image', url: 'sybot_images/5af9484d29cd5d895ab0d73805b18105.jpg', width: '480px', height: '266px'},
                {type:'image', url: 'sybot_images/d4ab14d447a0e5671c2680b0c8330746.png', width: '236px', height: '270px'},
                {type:'image', url: 'sybot_images/e457c50f67acaf7e1f82af35438c4e43.jpg', width: '368px', height: '270px'},
                {type:'image', url: 'sybot_images/30b505cec9068cbca0aa4d9a00dd5889.jpg', width: '180px', height: '270px'},
                {type:'image', url: 'sybot_images/12241a79751c9f2ebb03cf475ece21f8.jpg', width: '215px', height: '270px'},
                {type:'image', url: 'sybot_images/30a1ea32341b4d7d0a30a73f968332fa.jpg', width: '433px', height: '270px'},
                {type:'image', url: 'sybot_images/cd3bc1a466d2c75d6fbbd551625743c7.jpg', width: '275px', height: '270px'},
                {type:'image', url: 'sybot_images/9021c13b2c4d4042ef14761ac2db4406.jpg', width: '391px', height: '270px'},
                {type:'image', url: 'sybot_images/e4f03bcca989157fd4d846f0e0cd5824.png', width: '480px', height: '215px'},
                {type:'image', url: 'sybot_images/4d60b83e360ef9c9f4c0146dd87019eb.jpg', width: '268px', height: '270px'},
                {type:'image', url: 'sybot_images/3b71ba605b0a18b806093122b396cc11.jpg', width: '257px', height: '270px'},
                {type:'image', url: 'sybot_images/ae4c89265f92810333d0a71c97877192.jpg', width: '203px', height: '270px'},
                {type:'image', url: 'sybot_images/1a1f0b2036c6c92a16e44c60a7fd85e4.png', width: '151px', height: '270px'},
                {type:'image', url: 'sybot_images/761da60651ed6412c0643f6d46fbd6d6.jpg', width: '412px', height: '270px'},
                {type:'image', url: 'sybot_images/8db5ff5881eb237946a434a60fb9adf6.jpg', width: '270px', height: '270px'},
                {type:'image', url: 'sybot_images/6d674e8b6a559674e162c4cfa88bcfbe.png', width: '389px', height: '270px'},
                {type:'image', url: 'sybot_images/7648f81dfbdfd67fc00743f9fba84b1c.jpg', width: '269px', height: '270px'},
                {type:'image', url: 'sybot_images/f778e1c8f5774c5ae98783b6cac2bc59.jpg', width: '311px', height: '270px'},
                {type:'image', url: 'sybot_images/9295c5f68c08c4052bd533ee40fdc2dd.jpg', width: '206px', height: '270px'},
                {type:'image', url: 'sybot_images/0d1afe045b3bb4777302a83887816eed.jpg', width: '480px', height: '250px'},
                {type:'image', url: 'sybot_images/9afa67ae9b65f143bd1fa171fbfbc5da.png', width: '237px', height: '270px'},
                {type:'image', url: 'sybot_images/a196c42b1e743420656738d97c0748e4.jpg', width: '362px', height: '270px'},

                // YouTube links
                {type:'youtube', url:'http://img.youtube.com/vi/DBmaQRjzfZI/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/6eDWy8XQmIo/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/q6y2f0PXPFQ/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/IluWa464v-U/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/JXHvOge4WvI/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/Dglj5DCat38/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/nmPPCkF6-fk/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/Eskq91eBhEE/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/utZht6xfuHk/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/vUp5hU7W2_I/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/eL747ppYDjg/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/jN4gFhDST-w/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/sl5WPGOsx74/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/q5EcyUaZQrU/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/HXHT9QgVg7U/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/pXvfaPPtbpM/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/Wo4tkuShNrw/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/DoJd6541FH4/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/39zKhsT5naI/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/_bHHD1pWj4c/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/-N6QhidZe9E/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/Y_WFsCIeTig/0.jpg', width:'480px',height:'360px'},
                {type:'youtube', url:'http://img.youtube.com/vi/j8FXC9fODQs/0.jpg', width:'480px',height:'360px'},
            ];

            for (var i = 0; i < 10; i++) {
                var r = _.random(0, 255);
                var g = _.random(0, 255);
                var b = _.random(0, 255);
                
                var props = data[_.random(0, data.length - 1)];

                var element = $('<div/>')
                    .addClass('isotope-item')
                    .addClass(props.type)
                    .css({
                        width: props.width,
                        height: props.height,
                        background: 'url(' + props.url + ')'
                        //background: 'rgb('+r+','+g+','+b+')'
                    });

                if (props.type == 'youtube') {
                    element.addClass('nickname-gfro');
                } else {
                    element.addClass('nickname-chase');
                }

                var details = $('<div/>');

                var blah = ['minutes', 'hours', 'days', 'weeks', 'months']
                var date = _.random(1, 10) + ' ' + blah[_.random(0, blah.length -1)];

                if (props.type == 'youtube') {
                    element.append('<div class="details"><img src="/img/default-profile-icon.png" />'
                                + '<p>Posted by PhantomTheft<br/>' + date + ' ago</p><a class="action" href="#">'
                                + '<img src="http://momixpc.com/wp-content/uploads/2014/12/YouTube-icon-full_color.png" /></a>'
                                + '</div>');
                } else {
                    element.append('<div class="details"><img src="/img/default-profile-icon.png" />'
                            + '<p>Posted by PhantomTheft<br/>' + date + ' ago</p>'
                            + '</div>');  
                }
                

                // Push the DOM object for Isotope (not the jquery selector)
                domElements.push(element[0]);
            }

            // Inject the new elements into our isotope container
            $('.isotope-container').append(domElements);
            
            // Use isotope to reflow
            this.isotope.appended(domElements);

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
