var gulp = require('gulp');
var jsHint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var jsFiles = ['*.js', 'routes/*.js'];

gulp.task('style', function () {
    gulp.src(jsFiles)
        .pipe(jsHint())
        .pipe(jsHint.reporter('jshint-stylish', { verbose: true }))
        .pipe(jscs());
});