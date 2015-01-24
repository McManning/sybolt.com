
define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/profile/index.html'
], function($, _, Backbone, App, Template) {
    'use strict';
    
    var View = App.View.extend({
        template: _.template(Template),
        
        events: {
            //"click .scroll-up": "scrollUp"
            "click .delete-account": "onDeleteAccountClick"
        },
        
        onDeleteAccountClick: function() {
            if (confirm("Are you sure you want to delete your account and all associated information? This action cannot be undone.")) {
                alert("Hah. Yea right.");
            }

            return false;
        },

        initialize: function() {
            
        },
        
        render: function() {
            
            // Reconfigure our layout of the header and footer
            App.headerView.setStyle('default');
            App.footerView.setStyle('default');
            
            this.$el.html(this.template({
                // vars here...
            }));

            $('#email').on('keyup.toggle-additional-fields', function(e) {
                if ($(this).val().length < 1) {
                    $(this).parent().find('.checkbox').addClass('hidden');
                } else {
                    $(this).parent().find('.checkbox').removeClass('hidden');
                }
            });

            return this;
        }
    });
    
    return View;
});
