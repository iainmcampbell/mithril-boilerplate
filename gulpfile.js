/*

  Sass + Browserify

*/
var gulp         = require('gulp')
var gutil        = require('gulp-util');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var livereload   = require('gulp-livereload')
var sourcemaps   = require('gulp-sourcemaps')
var watchify     = require('watchify');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');

gulp.task('styles', function() {
 return gulp.src('src/modules/style.sass' )
   .pipe(sourcemaps.init())
   .pipe(sass({
     style: 'expanded',
     indentedSyntax: true,
     errLogToConsole: true
   }).on('error', sass.logError))
   .pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest( 'src/min/' ))
});

gulp.task('default', ['styles'], function() {

  livereload.listen();

  gulp.watch('src/modules/**/*.sass', ['styles']);
  gulp.watch([
    'src/min/**/*',
    'src/**/*.html',
  ], livereload.changed);

  // Browserify

  var b = browserify('./src/modules/main.js');
  var w = watchify(b);

  function bundle() {
    return w.bundle()
      .on('error', function(e){
        gutil.log(e)
      })
      .pipe(source('bundle.js')) // convert to a file stream
      .pipe(buffer()) // convert to a buffer
      .pipe(sourcemaps.init({loadMaps: true}))
        // transforms here
        // .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./src/min/'))
      .pipe(livereload())
  }

  w.on('update', bundle);
  w.on('log', gutil.log);

  bundle();

});
