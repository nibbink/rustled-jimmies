var gulp = require('gulp'),
  autoprefixer = require('autoprefixer'),
  cache = require('gulp-cache'),
  concat = require('gulp-concat-util'),
  cssnano = require('cssnano'),
  gm = require('gulp-gm'),
  imagemin = require('gulp-imagemin'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass');

// Critical CSS
gulp.task('critical', function() {
  var plugins = [
    autoprefixer({browsers: ['last 2 version']}),
    cssnano()
  ];
  return gulp.src('assets/css/critical.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(plugins))
  // wrap with style tags
  .pipe(concat.header('<style>'))
  .pipe(concat.footer('</style>'))
  // convert it to an include file
  .pipe(rename({
      basename: 'critical',
      extname: '.html'
    }))
  // insert file
  .pipe(gulp.dest('layouts/partials'));
});

// Image Conversion
gulp.task('convert', function() {
  return gulp
    .src('assets/comic/*.png')
    .pipe(
      gm(function(gmfile) {
        return gmfile.setFormat('jpg');
      })
    )
    .pipe(gulp.dest('static/comic'));
});

// Image Optimization
gulp.task('optimize', function() {
  return gulp
    .src('assets/comic/*.jpg')
    .pipe(
      cache(
        imagemin([
          imageminMozjpeg({
            quality: 99,
            progressive: true
          }),
        ])
      )
    )
    .pipe(gulp.dest('static/comic'));
});

// Watch asset folder for changes
gulp.task('watch', ['critical','convert','optimize'], function () {
  gulp.watch('assets/css/critical.scss', ['critical']);
  gulp.watch('assets/img/*', ['convert']);
  gulp.watch('assets/img/*', ['optimize']);
});

// Run Watch as default
gulp.task('default', ['watch']);

// Build
gulp.task('build', ['critical','convert','optimize']);