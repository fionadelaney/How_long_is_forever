'use strict';

var gulp = require('gulp');
var critical = require('critical');
var useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('css/*.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.csso())
        .pipe(gulp.dest('.tmp/css'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('js/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src('font/*')
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/font'))
        .pipe($.size());
});

gulp.task('html', ['styles'], function () {
    var cssFilter = $.filter('**/*.css' , {restore: true});
    var assets = $.useref({searchPath: ['.tmp']});

    return gulp.src('index.html')
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

// Generate & Inline Critical-path CSS
gulp.task('critical', ['build'], function (cb) {
    critical.generate({
        inline: true,
        base: 'dist/',
        src: 'index.html',
        dest: 'dist/index-critical.html',
        dimensions: [{
            height: 480,
            width: 320
            }, {
            height: 900,
            width: 1200
        }],
        minify: true
    });
});

gulp.task('build', ['html', 'fonts']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});