
$(function() {
    $('.collapsible').collapsible({
        accordion : false
    });

    $('.scrollspy').scrollSpy();
    $('.modal-trigger').leanModal();
    $('.modal-trigger').click(function(e) {
        e.preventDefault();
        return false;
    });

    function updateHeader() {
        if (window.scrollY > $('#hero-container').height() - 100) {
            $('header').removeClass('faded');
        } else {
            $('header').addClass('faded');
        }
    }

    // TODO: optimize!
    $(window).scroll(function() {
        updateHeader();
    });
    updateHeader();

    $('.link-accounts li').click(function() {
        var $checkbox = $(this).find('input[type="checkbox"]');
        $checkbox.prop('checked', !$checkbox.prop('checked'));
    })

    $(".button-collapse").sideNav({
        menuWidth: 300,
        edge: 'left'
    });
});
