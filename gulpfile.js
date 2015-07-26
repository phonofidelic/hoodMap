var gulp = require('gulp'),
  concat = require('gulp-concat'),
  catCss = require('gulp-concat-css')
  uglify = require('gulp-uglify'),
  minCss = require('gulp-minify-css'),
    maps = require('gulp-sourcemaps'),
     del = require('del');

gulp.task('concatScripts', function() {
	gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'bower_components/knockout/dist/knockout.js',
		'bower_components/bootstrap/dist/js/bootstrap.js',
		'js/main.js'
		])
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('js'));
});

gulp.task('miniJs', function() {
	gulp.src('js/app.js')
	.pipe(uglify())
	.pipe(gulp.dest('js'));
});

gulp.task('concatCss', function() {
	gulp.src([
		'bower_components/bootstrap/dist/css/bootstrap.css',
		'Map-Icons-master/css/map-icons.css',
		'css/style.css'
		])
	.pipe(maps.init())
	.pipe(catCss('application.css'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('css'));
});

//!!! not working - img and font paths being altered
gulp.task('miniCss', function() {
	gulp.src('css/application.css')
	.pipe(minCss())
	.pipe(gulp.dest('css'));
});