module.exports = function (grunt) {
  grunt.initConfig({
	// Watch task config
	watch: {
		styles: {
			files: "SCSS/*.scss",
			tasks: ['sass', 'postcss'],
		},
		javascript: {
			files: ["js/*.js", "!js/*.min.js"],
			tasks: ['uglify'],
		},
	},
	sass: {
		dist: {
			options: {
				style: 'compressed'
			},
			files: {
				"style.min.css" : "SCSS/style.scss",
			}
		}
	},
	postcss: {
		options: {
			map: {
				inline: false,
			},

			processors: [
				require('pixrem')(), // add fallbacks for rem units
				require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
				require('cssnano')() // minify the result
			]
		},
		dist: {
			src: ['*.min.css'],
		}
	},
	uglify: {
		options: {
			sourceMap: true,
		},
		custom: {
			files: {
				'js/application-form-pricing.min.js': 'js/application-form-pricing.js'
			},
		},
	},
	browserSync: {
		dev: {
			bsFiles: {
				src : ['*.css', '**/*.php', '**/*.js', '!node_modules'],
			},
			options: {
				watchTask: true,
				proxy: "https://ex.ghc.dev",
				https: {
					key: "/Users/andrew/github/dotfiles/local-dev.key",
					cert: "/Users/andrew/github/dotfiles/local-dev.crt",
				},
				open: 'external',
				host: 'andrews-macbook-pro.local'
			},
		},
	},
  });

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.registerTask('default', [
		'browserSync',
		'watch',
	]);
};
