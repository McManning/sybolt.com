
define([
    'live/views/index'
], function(IndexView) {

    var Live = {
        getView: function() {
            return IndexView;
        }
    };
    
    return Live;
});
