'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat');

gulp.task('scripts', function () {
    return gulp.src('js/*.js')
        .pipe(concat('combined.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('clean', function () {
    return gulp.src(['dist'], { read: false }).pipe(clean());
});

gulp.task('build', ['scripts']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});