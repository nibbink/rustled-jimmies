// Load Plugins
const { dest, parallel, series, src, watch } = require('gulp');
const cache = require('gulp-cache');
const gm = require('gulp-gm');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const postcss = require('gulp-postcss');
const pump = require('pump');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');

// Critical CSS
const critical = cb => {
  pump(
    [
      src('assets/css/critical.scss'),
      sass().on('error', sass.logError),
      postcss(),
      htmlmin({ collapseWhitespace: true, minifyCSS: true }),
      replace(/^/g, '<style>'),
      replace(/$/g, '</style>'),
      rename({
        basename: 'critical',
        extname: '.html',
      }),
      dest('layouts/partials'),
    ],
    cb
  );
};

// Convert PNGs to Progressive JPEGs
const toJPG = cb => {
  pump(
    [
      src('assets/comic/*.png'),
      gm(gmfile => {
        return gmfile.setFormat('jpg');
      }),
      dest('assets/comic'),
    ],
    cb
  );
};

// Move Images
const move = cb => {
  pump(
    [
      src(['assets/comic/*.gif', 'assets/comic/*.jpg']),
      dest('assets/img/comic'),
    ],
    cb
  );
};

// Create Webps from JPEGs
const toWebp = cb => {
  pump(
    [
      src('assets/img/comic/*.jpg'),
      gm(gmfile => {
        return gmfile.setFormat('webp');
      }),
      dest('assets/img/comic'),
    ],
    cb
  );
};

// Optimize JPEGs and PNGs
const optimize = cb => {
  return pump(
    [
      src('assets/img/comic/*.jpg'),
      cache(
        imagemin({
          use: [
            imageminMozjpeg({
              quality: 90,
              progressive: true,
            }),
          ],
        })
      ),
      dest('assets/img/comic'),
    ],
    cb
  );
};

// Replace
const feed = cb => {
  return pump(
    [
      src(['public/comic/feed.json', 'public/comic/index.xml']),
      htmlmin({ collapseWhitespace: true }),
      replace(/(\\n\\r\\n\\r\\n\\r\\n\s+\\u003)(csection).+/g, '"'),
      replace(/data-/g, ''),
      replace(/<p><\/p>/g, ''),
      dest('public/comic'),
    ],
    cb
  );
};

// Watch asset folder for changes
const watchFiles = () => {
  return watch('assets/css/*.scss', () => {
    return critical();
  });
};

// Watch
exports.watch = watchFiles;

// Build
const images = series(toJPG, move, toWebp, optimize);

exports.post = feed;
exports.build = parallel(critical, images);
