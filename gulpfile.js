
"use strict";

// Load Plugins
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat-util');
const cssnano = require('cssnano');
const gm = require('gulp-gm');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');

// Replace
function clean() {
    return gulp
    .src(['public/comic/feed.json'])
    .pipe(plumber())
    .pipe(replace(/(\\n\\r\\n\\r\\n\\r\\n\s+\\u003)(csection).+/g, '"'))
    .pipe(gulp.dest('public/comic'));
}

// Critical CSS
function critical() {
  const plugins = [autoprefixer({browsers: ['> 5%']}), cssnano()];
  return gulp
      .src('assets/css/critical.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(plugins))
      // wrap with style tags
      .pipe(concat.header('<style>'))
      .pipe(concat.footer('</style>'))
      // convert it to an include file
      .pipe(
        rename({
          basename: 'critical',
          extname: '.html',
        })
      )
      // insert file
      .pipe(gulp.dest('layouts/partials'))
}

// Image Conversion
function convert() {
  return gulp
    .src('assets/comic/*.png')
    .pipe(plumber())
    .pipe(
      gm(function(gmfile) {
        return gmfile.setFormat('jpg');
      })
    )
    .pipe(gulp.dest('static/img/comic'))
}

// Move GIFs
function gif() {
  return gulp
      .src('assets/comic/*.gif')
      .pipe(plumber())
      .pipe(gulp.dest('static/img/comic'))
}


// Watch asset folder for changes
function watchFiles() {
  gulp.watch('assets/css/reset.scss', critical);
  gulp.watch('assets/css/fonts.scss', critical);
  gulp.watch('assets/css/critical.scss', critical);
  gulp.watch('assets/img/*', gulp.series(convert, gif));
}

// Tasks
gulp.task("critical", critical);
gulp.task("convert", gulp.series(convert, gif));
gulp.task("clean", clean);

// Run Watch as default
gulp.task("watch", watchFiles);

// Build
gulp.task(
  "build",
  gulp.series(gulp.parallel(critical, convert, gif))
);