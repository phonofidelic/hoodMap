var    gulp = require('gulp'),
     concat = require('gulp-concat'),
     catCss = require('gulp-concat-css'),
     uglify = require('gulp-uglify'),
     minCss = require('gulp-minify-css'),
        del = require('del'),
   validate = require('gulp-jsvalidate'),
     rename = require('gulp-rename'),
htmlReplace = require('gulp-html-replace');

// gulp.task('default', [/* 'task', 'task' */]);

gulp.task('val', function() {
	gulp.src('js/main.js')
	.pipe(validate());
});

//process head scripts
gulp.task('headScripts', function() {
	gulp.src([
		'bower_components/offline/offline.min.js',
		'bower_components/map-icons/js/map-icons.js',
		'bower_components/oauth-signature/dist/oauth-signature.js'
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(gulp.dest('../phonofidelic/phonofidelic.github.io/hoodMap_dist/js'));
});

//process scripts
gulp.task('scripts', function() {
	gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'bower_components/sticky/jquery.sticky.js',
		'bower_components/knockout/dist/knockout.js',
		'bower_components/bootstrap/dist/js/bootstrap.js',
		'js/main.js'
		])
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(gulp.dest('../phonofidelic/phonofidelic.github.io/hoodMap_dist/js'));
});

//process css
gulp.task('appCss', function() {
	gulp.src([
		'./bower_components/bootstrap/dist/css/bootstrap.css',
		'./bower_components/map-icons/css/map-icons.css',
		'./bower_components/offline/themes/offline-language-english.css',
		'./bower_components/offline/themes/offline-language-english-indicator.css',
		'./bower_components/offline/themes/offline-theme-default.css',
		'./css/style.css'
		])
	.pipe(catCss('application.min.css', {rebaseUrls:false}))
	.pipe(minCss({rebase:false}))
	.pipe(gulp.dest('dist/css'))
	.pipe(gulp.dest('../phonofidelic/phonofidelic.github.io/hoodMap_dist/css'));
});

//process html
gulp.task('htmlIndex', function(){
	gulp.src('index.html')
	.pipe(htmlReplace({
		'appCss': 'css/application.min.css',
		'headScripts': 'js/scripts.min.js',
		'appScripts': 'js/app.min.js'
	}))
	.pipe(gulp.dest('dist'))
	.pipe(gulp.dest('../phonofidelic/phonofidelic.github.io/hoodMap_dist'));
});

gulp.task('default', ['headScripts', 'scripts', 'appCss', 'htmlIndex']);