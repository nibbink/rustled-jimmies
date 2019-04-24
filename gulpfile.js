
"use strict";

// Load Plugins
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat-util');
const cp = require('child_process');
const cssnano = require('cssnano');
const gm = require('gulp-gm');
const gulp = require('gulp');
const htmlbeautify = require('gulp-jsbeautifier');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const strip = require('gulp-strip-comments');

// Replace
function cleanfeed() {
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
function toJPEG() {
  return gulp
    .src('assets/comic/*.png')
    .pipe(plumber())
    .pipe(
      gm(function(gmfile) {
        return gmfile.setFormat('jpg');
      })
    )
    .pipe(gulp.dest('assets/img/comic'))
}
function toWebp() {
  return gulp
    .src('assets/comic/*.png')
    .pipe(plumber())
    .pipe(
      gm(function(gmfile) {
        return gmfile.setFormat('webp');
      })
    )
    .pipe(gulp.dest('assets/img/comic'));
}

// Move GIFs
function gif() {
  return gulp
      .src('assets/comic/*.gif')
      .pipe(plumber())
      .pipe(gulp.dest('assets/img/comic'))
}

/*
HTML Cleanup:
- Removed HTML comments.
- Removed extra <p> tags.
*/
function cleanhtml() {
  return gulp
  .src(['public/**/*.html'])
  .pipe(plumber())
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(replace(/<p><(p|a|div|section|h1|h2|h3|h4|ul|li|img|figure|picture)(.*?)>/g, '<$1$2>'))
  .pipe(replace(/<\/(p|a|div|section|h1|h2|h3|h4|ul|li|img|figure|picture)(.*?)><\/p>/g, '</$1$2>'))
  .pipe(replace(/<p><\/p>/g, ''))
  .pipe(htmlbeautify({
    indent_char: ' ',
    indent_size: 2
  }))
  .pipe(strip.html())
  .pipe(gulp.dest('public'));
}

// Run Webpack
function webpack() {
  return cp.spawn('webpack', {
    err: true,
    stderr: true,
    stdout: true
  });
}

// Watch asset folder for changes
function watchFiles() {
  gulp.watch('assets/css/reset.scss', critical);
  gulp.watch('assets/css/fonts.scss', critical);
  gulp.watch('assets/css/critical.scss', critical);
  gulp.watch('assets/img/*', gulp.series(gif));
}

// Tasks
gulp.task("critical", critical);
gulp.task("convert", gulp.series(toJPEG, toWebp, gif));
gulp.task("clean", gulp.series(cleanfeed, cleanhtml));

// Run Watch as default
gulp.task("watch", watchFiles);

// Build
gulp.task(
  "build",
  gulp.series(gulp.parallel(critical, toJPEG, toWebp, gif, webpack))
);