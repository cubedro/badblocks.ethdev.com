var src = 'src/';
var dest = 'dist/';

var scripts = [
	'src/js/script.js'
];

var vendor = [
	'dist/js/lib/jquery-1.11.3.min.js',
	'dist/js/lib/bootstrap.min.js',
];

var styles = [
	'bootstrap.min.css',
	'minimal-icons-embedded.css',
	'style.css'
];

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['dist'],
			cleanup_js: ['dist/js/*.*', '!dist/js/badblocks.*'],
			cleanup_css: ['dist/css/*.css', '!dist/css/badblocks.*.css']
		},
		jade: {
			build: {
				options: {
					data: {
						debug: false,
						pretty: true
					}
				},
				files: {
					'dist/index.html': 'src/views/index.jade'
				}
			}
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'src/fonts/',
						src: ['minimal-*.*'],
						dest: 'dist/fonts/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'src/images/',
						src: ['*.ico'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'src/css/',
						src: styles,
						dest: 'dist/css/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'src/js/lib/',
						src: ['*.*'],
						dest: 'dist/js/lib'
					}
				]
			}
		},
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'dist/css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/'
				}]
			}
		},
		concat: {
			vendor: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					sourceMapIn: ['dist/js/lib/*.map']
				},
				src: vendor,
				dest: 'dist/js/vendor.min.js'
			},
			scripts : {
				options: {
					separator: ';\n',
				},
				src: scripts,
				dest: 'dist/js/app.js'
			},
			badblocks: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					sourceMapIn: ['dist/js/vendor.min.js.map', 'dist/js/app.min.js.map']
				},
				src: ['<%= concat.vendor.dest %>', '<%= uglify.app.dest %>'],
				dest: 'dist/js/badblocks.min.js',
				nonull: true,
			},
			css: {
				src: ['dist/css/*.min.css', 'dist/css/*.css'],
				dest: 'dist/css/badblocks.min.css'
			}
		},
		uglify: {
			app: {
				options: {
					mangle: false,
					sourceMap: true,
					sourceMapIncludeSources: true
				},
				dest: 'dist/js/app.min.js',
				src: ['<%= concat.scripts.dest %>']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// grunt.registerTask('default', ['clean', 'jade', 'copy', 'cssmin', 'concat:vendor', 'concat:scripts', 'uglify', 'concat:badblocks', 'concat:css', 'clean:cleanup_css']);
	grunt.registerTask('default', ['clean', 'jade', 'copy', 'cssmin', 'concat:vendor', 'concat:scripts', 'uglify', 'concat:badblocks', 'concat:css', 'clean:cleanup_js', 'clean:cleanup_css']);
	grunt.registerTask('build',   'default');
};