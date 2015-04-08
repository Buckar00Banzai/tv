module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
          },
          dist: {
            // the files to concatenate
            src: ['src/**/*.js'],
            // the location of the resulting JS file
            dest: 'dist/<%= pkg.name %>.js'
          }
        },

        uglify: {
          options: {
            // the banner is inserted at the top of the output
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
            }
          }
        },

        jshint: {
          // define the files to lint
          files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
          // configure JSHint (documented at http://www.jshint.com/docs/)
          options: {
              // more options here if you want to override JSHint defaults
            globals: {
              jQuery: true,
              console: true,
              module: true
            }
          }
        },

        watch: {
          files: ['<%= jshint.files %>']
        },

        less: {
          development: {
            options: {
              paths: ["assets/css"]
            },
            files: {
              "public/stylesheets/style.css": "public/less/style.less",
              "public/stylesheets/style_responsive.css": "public/less/style_responsive.less"
            }
          },
          production: {
            options: {
              paths: ["assets/css"],
              plugins: [
                new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                new (require('less-plugin-clean-css'))()
              ],
              modifyVars: {
                imgPath: '"http://galoremag.com/wp-uploads"',
                bgColor: 'hotpink'
              }
            },
            files: {
              "public/stylesheets/style.css": "public/less/style.less",
              "public/stylesheets/style_responsive.css": "public/less/style_responsive.less"
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};