module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'static/js/*-min.js'],
            options: {
                globals: {
                    console: false,
                    window: false,
                    document: false,
                    require: false,
                    requirejs: false,
                    module: false
                },
                curly: true,
                eqeqeq: true,
                forin: true,
                undef: true,
                unused: true
            }
        },
        requirejs: {
            test: {
                options: {
                    baseDir: 'js/apps',
                    mainConfigFile: 'js/apps/config.js',
                    wrap: true,
                    name: 'test',
                    optimize: 'none',
                    out: 'js/apps/build/test.js',
                    exclude: [
                        'backbone',
                        'underscore',
                        'jquery',
                        'text'
                    ]
                }
            },
            live: {
                options: {
                    baseDir: 'js/apps',
                    mainConfigFile: 'js/apps/config.js',
                    wrap: true,
                    name: 'live',
                    optimize: 'none',
                    out: 'js/apps/build/live.js',
                    exclude: [
                        'backbone',
                        'underscore',
                        'jquery',
                        'text',
                        'isotope',
                        'flowplayer'
                    ]
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                preserveComments: false,
                sourceMap: true
            },
            dist: {
                files: {
                    'js/apps/build/test.min.js': ['js/apps/build/test.js'],
                    'js/apps/build/live.min.js': ['js/apps/build/live.js']
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded' // compressed
                },
                files: {
                    'css/main.css': 'sass/main.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'Gruntfile.js',
                    'js/*.js',
                ],
                tasks: ['jshint']
            },
            sass: {
                files: [
                    'sass/**/*',
                ],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Full build task
    grunt.registerTask('default', ['sass', 'jshint', 'requirejs', 'uglify']);
};