'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-cssnano');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var babel = require('gulp-babel');
var minifyJs = require('gulp-minify');

gulp.task('sass', function() {
  return gulp.src('./stylesheets/master.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['Safari > 6']
    }))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(reload({ stream: true }));
});

gulp.task('babel', function() {
	return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
    .pipe(reload({ stream: true }));
});


gulp.task('minify', function() {
  return gulp.src('dist/*.js')
  .pipe(minifyJs())
  .pipe(gulp.dest('dist'));
});

gulp.task('build', ['sass', 'babel']);

gulp.task('serve', ['build'], function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });

  gulp.watch(['*.html'], reload);
  gulp.watch('./stylesheets/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.js', ['babel']);
});

gulp.task('default', ['build']);
