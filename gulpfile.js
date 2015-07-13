'use strict';

var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var deploy = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var entry = 'index.js';
var src = [ entry, 'src/**/*.js' ];
var srcOption = { base: './' };
var dest = './dist';


gulp.task('clean', function () {
    return del(dest)
});


gulp.task('node', ['clean'], function () {
    return gulp.src(src, srcOption).pipe(babel()).pipe(gulp.dest(dest));
});


gulp.task('browser', ['clean'], function () {
    return gulp.src(entry, srcOption)
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production,
            transform: ['babelify']
        }))
        .pipe(gulp.dest(dest));
});

gulp.task('browser-deploy', ['clean'], function () {
    return gulp.src(entry, srcOption)
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production,
            transform: ['babelify']}))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('default', ['browser']);

gulp.task('watch', function(){gulp.watch(src, ['default'])});

gulp.task('deploy', ['browser-deploy'], function(){
    return gulp.src("./**/*").pipe(deploy())
});