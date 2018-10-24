const gulp = require('gulp'),
      autoprefixer = require('autoprefixer'),
      concat = require('gulp-concat-util'),
      cssnano = require('cssnano'),
      gm = require('gulp-gm'),
      postcss = require('gulp-postcss'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass');

// Critical CSS
gulp.task('critical', () => {
  const plugins = [
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
gulp.task('convert', () => gulp
  .src('assets/comic/*.png')
  .pipe(
    gm(gmfile => gmfile.setFormat('jpg'))
  )
  .pipe(gulp.dest('static/img/comic')));


// Watch asset folder for changes
gulp.task('watch', ['critical','convert'], () => {
  gulp.watch('assets/css/critical.scss', ['critical']);
  gulp.watch('assets/img/*', ['convert']);
});

// Run Watch as default
gulp.task('default', ['watch']);

// Build
gulp.task('build', ['critical','convert']);