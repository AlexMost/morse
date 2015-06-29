'use strict';

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');

var entry = 'index.js';
var src = [ entry, 'src/**/*.js' ];
var srcOption = { base: './' };
var dest = './dist';


gulp.task('clean', function () {
    return del(dest)
});


gulp.task('node', ['clean'], function () {
    return gulp.src(src, srcOption)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '..' }))
        .pipe(gulp.dest(dest));
});


gulp.task('browser', ['clean'], function () {
    return gulp.src(entry, srcOption)
        .pipe(sourcemaps.init())
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production,
            transform: ['babelify']
        }))
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '..' }))
        .pipe(gulp.dest(dest));
});


gulp.task('default', ['browser']);

gulp.task('watch', function(){gulp.watch(src, ['default'])});