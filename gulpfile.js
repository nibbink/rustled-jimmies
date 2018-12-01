var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    concat = require('gulp-concat-util'),
    cssnano = require('cssnano'),
    gm = require('gulp-gm'),
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
    .pipe(gulp.dest('static/img/comic'));
});

// Move GIFs
gulp.task('gif', function () {
  return gulp
    .src('assets/comic/*.gif')
    .pipe(gulp.dest('static/img/comic'));
});


// Watch asset folder for changes
gulp.task('watch', ['critical', 'convert', 'gif'], function () {
  gulp.watch('assets/css/reset.scss', ['critical']);
  gulp.watch('assets/css/fonts.scss', ['critical']);
  gulp.watch('assets/css/critical.scss', ['critical']);
  gulp.watch('assets/img/*', ['convert', 'gif']);
});

// Run Watch as default
gulp.task('default', ['watch']);

// Build
gulp.task('build', ['critical','convert', 'gif']);