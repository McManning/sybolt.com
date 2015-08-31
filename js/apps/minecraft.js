
define([
    'minecraft/views/index'
], function(IndexView) {

    var Minecraft = {
        getView: function() {
            return IndexView;
        }
    };
    
    return Minecraft;
});
