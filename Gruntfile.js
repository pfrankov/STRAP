module.exports = function(grunt) {
	var config = {
		zip: true, // Archive dist dir after build

		app: "app",
		sass: "sass",
		styles: "styles",
		images: "images",
		scripts: "scripts",

		dist: "dist",


		copyIgnore: [
			"bower-components/**",
			"includes/**",
			"<%= config.sass %>/**",
			"<%= config.images %>/**"
		]
	};











	/**
	 *
	 * @param {Array} paths
	 */
	function makePathIgnored (paths){
		var result = [];

		for (var i=0; i<paths.length; i++) {
			result[i] = "!"+paths[i];
		}
		//console.log(result);

		return result;
	}


	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		config: config,

		paths: {
			app: "<%= config.app %>",
				sass: "<%= config.app %>/<%= config.sass %>",
				styles: "<%= config.app %>/<%= config.styles %>",
				scripts: "<%= config.app %>/<%= config.scripts %>",
				images: "<%= config.app %>/<%= config.images %>",
				tmp: "<%= config.app %>/.tmp",

			dist: "<%= config.dist %>"
		},

		



		imagemin: {
			images: {
				files: [{
					expand: true,
					cwd: "<%= paths.app %>/",
					src: ["<%= config.images %>/**/*.{png,jpg,gif}", "!<%= config.images %>/**/_*/**"],
					dest: "<%= paths.dist %>/"
				}]
			}
		},

		csso: {
			usemin: {
				options: {
					force: true,
					restructure: true,
					report: 'gzip'
				},
				files: [{

					expand: true,
					cwd: "<%= paths.tmp %>/usemin/",
					src: ["**/*.css"],
					dest: "<%= paths.tmp %>/usemin/",
					ext: ".css"
				}]
			}
		},

		useminPrepare: {
			html: "<%= paths.app %>/*.html",

			options: {
				dest: "<%= paths.tmp %>/usemin",
				flow: {
					steps: {
						js: ["uglifyjs"],
						css: ["concat"]
					},
					post: {
						js: [{
							name: "uglify",
							createConfig: function(context){
								var copyTask = grunt.config("copy");
								copyTask.assets.src = copyTask.assets.src.concat(makePathIgnored(context.inFiles));

								grunt.config("copy", copyTask);
							}
						}],
						css: [{
							name: "concat",
							createConfig: function(context){
								var copyTask = grunt.config("copy");
								copyTask.assets.src = copyTask.assets.src.concat(makePathIgnored(context.inFiles));

								grunt.config("copy", copyTask);
							}
						}]
					}
				}
			}
		},

		usemin: {
			html: "<%= paths.dist %>/*.html"
		},

		clean: {
			tmp: "<%= paths.tmp %>",
			dist: "<%= paths.dist %>"
		},

		copy: {
			usemin: {
				expand: true,
				cwd: "<%= paths.tmp %>/usemin/",
				src: "**",
				dest: "<%= paths.dist %>/"
			},
			html: {
				expand: true,
				cwd: "<%= paths.app %>/",
				src: ["*.html"],
				dest: "<%= paths.dist %>/"
			},
			assets: {
				expand: true,
				cwd: "<%= paths.app %>/",
				src: ["**/*", "!*.html"].concat(makePathIgnored(config.copyIgnore) ),
				dest: "<%= paths.dist %>/"
			}
		},

		sass: {
			tmp: {
				options: {
					compass: true,
					sourcemap: "file"
				},
				files: [{
					expand: true,
					cwd: "<%= paths.sass %>",
					src: ["*.scss"],
					dest: "<%= paths.tmp %>",
					ext: ".css"
				}]
			}
		},

		autoprefixer: {
			tmp: {
				options: {
					map: true
				},
				expand: true,
				flatten: true,
				src: "<%= paths.tmp %>/**/*.css",
				dest: "<%= paths.sass %>"
			}
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: "localhost"
			},
			livereload: {
				options: {
					open: true,
					base: [
						"<%= paths.app %>"
					]
				}
			}
		},

		watch: {
			js: {
				files: ["<%= paths.scripts %>/**/*.js"],
				tasks: ["build:dev:js"],
				options: {
					livereload: true
				}
			},
			sass: {
				files: ["<%= paths.sass %>/**/*.scss"],
				tasks: ["build:dev:css"]
			},
			css: {
				files: ["<%= paths.styles %>/**/*.css"],
				options: {
					livereload: true
				}
			}
		},

		size_report: {
			your_target: {
				files: {
					list: ["<%= paths.dist %>/**/*.{html,css,js,jpg,png,gif,webp,zip}"]
				}
			}
		},

		zip: {
			task: {
				cwd: "<%= paths.dist %>/",
				src: ["<%= paths.dist %>/**/*"],
				dest: "<%= paths.dist %>/<%= pkg.name %>-v<%= pkg.version %>.zip"
			}
		},

		bump: {
			options: {
				files: ["package.json"],
				updateConfigs: ["pkg"],
				commit: false,
				createTag: false,
				push: false
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask("build:dev:css", [
		"sass:tmp",
		"autoprefixer:tmp",
		"clean:tmp"
	]);

	grunt.registerTask("build:dev:js", [

	]);



	grunt.registerTask("default", [
		"build:dev:css",
		"connect:livereload",
		"watch"
	]);

	grunt.registerTask("build", function(){
		grunt.task.run([
			"clean:dist",
			"bump",
			"build:dev:css",
			"useminPrepare",
			"concat:generated",
			"uglify:generated",
			"csso:usemin",
			"copy:usemin",
			"copy:html",
			"usemin",
			"imagemin",
			"copy:assets",
			"clean:tmp"
		]);

		if ( grunt.config.get("config" ).zip ) {
			grunt.task.run([
				"zip"
			]);
		}
		grunt.task.run([
			"size_report"
		]);
	});



	/*рисование треугольников
	рисование плоских теней
	анимации

	sourcemaps
	autoprefixer
	избавиться от компаса (спрайты, ритм)
	сборка билда
	отладочная версия в браузере с авторефрешем
	бамп версии*/

};
