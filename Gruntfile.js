module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'js/*-min.js'],
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
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                preserveComments: false
            },
            dist: {
                files: {
                    'js/landing.min.js': ['js/landing.js'],
                    'js/live.min.js': ['js/live.js'],
                    'js/love.min.js': ['js/love.js'],
                    'js/safespace.min.js': ['js/safespace.js']
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Full build task
    grunt.registerTask('default', ['jshint', 'uglify', 'sass']);
};