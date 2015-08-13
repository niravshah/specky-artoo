var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    artoo = require('gulp-artoo'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect');

// Files to aggregate
var files = [
  './templates/*.tpl',
  './stylesheets/*.css',
  './src/*.js'
];

// Build
function preBuild() {
  return gulp.src(files)
    .pipe(gulpif('*.tpl', artoo.template()))
    .pipe(gulpif('*.css', artoo.stylesheet()))
    .pipe(concat('Specky.concat.js'));
}

gulp.task('build', function() {
  return preBuild()
    .pipe(gulp.dest('./build'));
});

// Bookmarklets
gulp.task('bookmark.dev', function() {
  return artoo.blank('Specky.bookmark.dev.js')
    .pipe(artoo({
      random: true,
      loadingText: null,
      settings: {
        reExec: false,
        scriptUrl: 'http://localhost:8000/build/Specky.concat.js',
        env: 'dev'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('bookmark.prod', function() {
  return preBuild()
    .pipe(uglify())
    .pipe(rename('Specky.bookmark.prod.js'))
    .pipe(artoo({
      settings: {
        reExec: false
      }
    }))
    .pipe(gulp.dest('./build'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(files, ['build']);
});

// Server
gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      directoryListing: true,
      port: 8000
    }));
});

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});


// Macro tasks
gulp.task('work', ['build', 'watch', 'connect']);
gulp.task('bookmarklets', ['bookmark.dev', 'bookmark.prod']);
gulp.task('default', ['build', 'bookmark.dev', 'bookmark.prod']);


