/*
- Grunt is a JavaScript task runner, a tool used to automatically perform frequent tasks such as minification, compilation, unit testing, and linting.
- grunt file for live loading dependencies like jade files and js libaries 
*/

var expressReloadWatchFiles = [
  'app.js',
  'routes/**/*.js'
];

module.exports = function(grunt) {
  grunt.initConfig({

    express: {
      dev: {
        options: {
          script: 'app.js',
          debug: true,
          background: true
        }
      }
    },

    jshint: {
      options: {
        "asi":true
      },
      grunt: [
        'Gruntfile.js'
      ],
      client: [
        'public/javascripts/**/*.js',
        '!public/javascripts/build*.js',
        '!public/javascripts/lib/**/*.js'
      ],
      server: expressReloadWatchFiles
    },

    //Live-reloading
    watch: {
      css: {
        files: ['public/stylesheets/**/*.css'],
        options: {
          livereload: true
        }
      },
      jade: {
        files: ['views/**/*.jade', 'public/javascripts/templates/**/*.jade', ],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/javascripts/**/*.js'],
        tasks: [/*'jshint:client'*/],
        options: {
          livereload: true,
          interrupt: false
        }
      },
      configFiles: {
        files: [ 'Gruntfile.js', 'config/*.js' ],
        tasks: ['jshint:grunt'],
        options: {
          reload: true
        }
      },
      express: {
        files: expressReloadWatchFiles,
        tasks: ['jshint:server', 'express:dev'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('up', ['express:dev', 'watch']);
};