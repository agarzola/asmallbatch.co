// Gulp plugins:
var gulp = require('gulp')
var pug = require('gulp-pug')
var stylus = require('gulp-stylus')
var nib = require('nib')
var changed = require('gulp-changed')
var prefix = require('gulp-autoprefixer')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var plumber = require('gulp-plumber')
var browserSync = require('browser-sync')
var gulpIf = require('gulp-if')
var argv = require('yargs').argv
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')

// Useful globs in handy variables:
var markupSrc = [
  'source/markup/**/*.pug',
  '!source/markup/_layout.pug',
  '!source/markup/partials{,/**}',
  '!source/markup/sections{,/**}',
  '!source/markup/features{,/**}' ]

var stylesSrc = [
  'source/stylesheets/**/*.styl',
  '!source/stylesheets/partials{,/**}',
  '!source/stylesheets/modules{,/**}' ]

var jsSrc = [
  'source/javascript/**/*.js',
  '!source/javascript/vendor{,/**}' ]

var imagesSrc = 'source/images/**/*.*'

// Aaaand we start taskin’
// By default, we build, serve, and watch for changes:
gulp.task('watch', ['build', 'browser-sync'], function () {
  gulp.watch(markupSrc[0], ['markup'])
  gulp.watch(stylesSrc[0], ['styles'])
  gulp.watch(jsSrc[0], ['browserify'])
  // gulp.watch(jsSrc[0], ['javascript', 'javascript_vendors'])
  gulp.watch(jsSrc[0], ['javascript_vendors'])
  gulp.watch(imagesSrc, ['images'])
})

// Build the site:
gulp.task('build',
  [ 'markup',
    'styles',
    'browserify',
    //'javascript',
    'javascript_vendors',
    'images' ]
)

// Generate markup:
gulp.task('markup', function () {
  gulp.src(markupSrc)
  .pipe(plumber())
  .pipe(pug({
    pretty: (argv.production ? false : true)
  }))
  .pipe(gulp.dest('build/'))
})

// Generate styles, add prefixes:
gulp.task('styles', function () {
  gulp.src(stylesSrc)
  .pipe(plumber())
  .pipe(stylus({
    use: [nib()],
    compress: (argv.production ? true : false)
  }))
  .pipe(prefix('last 2 versions', '> 1%'))
  .pipe(gulp.dest('build/stylesheets'))
})

// Copy javascript:
gulp.task('javascript', function () {
  gulp.src(jsSrc)
  .pipe(plumber())
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/javascript'))
})
// TO-DO: Implement hinting & collation.

gulp.task('javascript_vendors', function () {
  gulp.src('source/javascript/vendor/*')
  .pipe(plumber())
  .pipe(gulp.dest('build/javascript/vendor'))
})

gulp.task('browserify', function () {
  var b = browserify({
    entries: './source/javascript/main.js',
    debug: true
  })

  return b.bundle()
    .on('error', function(err) {
      console.log('Error:', err)
      this.emit('end')
    })
    .pipe(plumber())
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('build/javascript'))
})

// Copy images to build dir:
gulp.task('images', function () {
  gulp.src(imagesSrc)
  .pipe(plumber())
  .pipe(gulp.dest('build/images'))
})

// Init browser-sync & watch generated files:
gulp.task('browser-sync', function () {
  browserSync.init(null, {
    server: {
      baseDir: './build'
    },
    files: [
      'build/**/*.html',
      'build/**/*.css',
      'build/**/*.js'
    ]
  })
})
