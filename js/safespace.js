
function searchMinecraftUsername() {
    var $results = $('#minecraft-search-results');
    var $search = $('#minecraft-search');
    var uuid = 'MHF_Steve';

    var username = $search.val();
    $search.removeClass('valid');

    if (username.length > 0 && $search.data('search') !== username) {
        $search.removeClass('invalid');
        $search.data('search', username);
        $results.hide();

        $.get('https://us.mc-api.net/v3/uuid/' + username)
            .done(function(data) {
                $results.show();
                $results.find('#minecraft-username').val(data.name);
                $results.find('#minecraft-uuid').val(data.full_uuid);

                uuid = data.full_uuid;
            })
            .fail(function() {
                $results.find('#minecraft-username').val('');
                $results.find('#minecraft-uuid').val('');

                $('#minecraft-search')
                    .removeClass('valid')
                    .addClass('invalid');
            })
            .always(function() {
                $('#minecraft-search-avatar')
                    .attr('src', 'https://crafatar.com/renders/body/' + uuid + '?overlay&scale=4');
            });
    }
    
    return false;
}

function searchMurmurUsername() {
    var $results = $('#murmur-search-results');
    var $search = $('#murmur-search');

    var username = $search.val();
    $search.removeClass('valid');

    if (username.length > 0 && $search.data('search') !== username) {
        $search.removeClass('invalid');
        $search.data('search', username);
        $results.hide();

        $.post('/murmur/search', { username: username })
            .done(function(data) {
                $results.find('#murmur-username').val(data.username);
                $results.show();
            })
            .fail(function() {
                $results.find('#murmur-username').val('');

                $('#murmur-search')
                    .removeClass('valid')
                    .addClass('invalid');
            });
    }
    
    return false;
}

$(function() {
    $('#minecraft-search')
        .blur(searchMinecraftUsername)
        .keydown(function(e) {
            if (e.which == 13) {
                return searchMinecraftUsername(); 
            }
        })
        .siblings('button')
            .click(searchMinecraftUsername);

    $('#murmur-search')
        .blur(searchMurmurUsername)
        .keydown(function(e) { 
            if (e.which == 13) { 
                return searchMurmurUsername(); 
            }
        })
        .siblings('button')
            .click(searchMurmurUsername);

    $('#registration-form').submit(function() {
        console.log($(this).serialize());

        $.post('/safespace/register', $(this).serialize())
            .done(function(data) {
                console.log(data);
            })
            .done(function(data) {
                // Awesome, redirect!
                window.location.href = '/safespace/login';
            })
            .fail(function(xhr) {
                try {
                    var json = $.parseJSON(xhr.responseText);
                    alert(json.error);
                } catch (e) {
                    alert('Well shit, something weird went wrong.');
                }
            });

        return false;
    });
});
