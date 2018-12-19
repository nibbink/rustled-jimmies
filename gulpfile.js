
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
    .src(['public/index.xml'])
    .pipe(plumber())
    .pipe(replace('data-src', 'src'))
    .pipe(replace(/(&lt;section)(.*)/g, ''))
    .pipe(replace(/(&lt;input)(.*)/g, ''))
    .pipe(replace(/(&lt;label)(.*)/g, ''))
    .pipe(replace('&lt;div class=&#34;panel&#34;&gt;', ''))
    .pipe(replace(/(&lt;img id=&#34;bonus&#34;)(.*)/g, ''))
    .pipe(replace('&lt;/div&gt;', ''))
    .pipe(replace('&lt;/section&gt;', ''))
    .pipe(replace(/\n\s*/g, ''))
    .pipe(replace('&lt;/figure&gt;', '&lt;/figure&gt; &lt;a href=&#34;https://www.patreon.com/rustledjimmiescomic&#34; target=&#34;_blank&#34; rel=&#34;noopener&#34;&gt;&lt;img src={{ &#34;/img/assets/patreon-banner.jpg&#34; | relURL }} alt=&#34;Patreon&#34;&gt;&lt;/a&gt;'))
    .pipe(gulp.dest('public/'));
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