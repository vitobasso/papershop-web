module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            release: ["build/*"]
        },
        uglify: {
            release: {
                mangle: true,
                files: {
                    'build/all.min.js': [

                        //need to be in order FIXME use "require('modules')"? https://github.com/substack/node-browserify
                        'web/res/js/chart/chart_common.js',
                        'web/res/js/config/country_codes.js',
                        'web/res/js/config/site_ids.js',
                        'web/res/js/util/lang_util.js',

                        //everything else
                        'web/**/*.js'
                    ]
                }
            }
        },
        //obfuscator: {
        //    //FIXME needs "require('modules')" https://github.com/substack/node-browserify
        //    files: [
        //        'web/**/*.js'
        //    ],
        //    entry: 'web/res/js/initializer.js',
        //    out: 'build/all.min.js',
        //    strings: true,
        //    root: __dirname
        //},
        cssmin: {
            release: {
                files: {
                    'build/all.min.css': 'web/res/css/**/*.css'
                }
            }
        },
        processhtml: {
            release: {
                options: {
                    process: true
                },
                files: [{
                    expand: true,
                    cwd: 'web',
                    src: '**/*.html',
                    dest: 'build'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-obfuscator');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'processhtml']);

};