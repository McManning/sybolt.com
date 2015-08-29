/**
 * Configuration file for building via grunt/requirejs. 
 * Not included in the final package.
 */
require.config({
    paths: {
        'jquery': '../vendor/jquery-2.1.1',
        'underscore': '../vendor/underscore',
        'backbone': '../vendor/backbone',
        'text': '../vendor/text',
        'verify': '../vendor/verify',
        'notify': '../vendor/notify-custom',
        'serializejson': '../vendor/jquery.serializejson',
        'tubular': '../vendor/jquery.tubular',
        'isotope': '../vendor/isotope.pkgd.no-amd',
        'packerymode': '../vendor/packery-mode.pkgd.no-amd',
        'jquery.select2': '../vendor/select2',
        'flowplayer': '//releases.flowplayer.org/js/flowplayer-3.2.13'
    },

    cjsTranslate: true,
});
