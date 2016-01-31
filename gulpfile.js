var gulp = require('gulp');
var path = require('path');
var del = require('del');

var $ = require('gulp-load-plugins')({
  pattern: '*',
});

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var port = $.util.env.port || 3000;
var src = 'src/';
var dist = 'dist/';

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];


gulp.task('scripts', ['lint'], function() {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpackStream(webpackConfig))
    .pipe(isProduction ? $.uglifyjs() : $.util.noop())
    .pipe(gulp.dest(dist + 'js/'))
    .pipe($.size({ title : 'js' }))
    .pipe($.connect.reload());
});

gulp.task('html', function() {
  return gulp.src(src + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe($.size({ title : 'html' }))
    .pipe($.connect.reload());
});

gulp.task('styles',function(cb) {
    return gulp.src( [ src + 'styles/normalize.min.css', src + 'styles/main.scss' ] )
      .pipe($.sass().on('error', $.sass.logError))
      .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
      .pipe( $.concat('main.css') )
      .pipe(gulp.dest( dist + 'css/') )
      .pipe($.size({ title : 'css' }))
      .pipe($.connect.reload());
});

gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35728
    }
  });
  // gulp.src(__filename)
    // .pipe($.open({uri: 'http://localhost:'+ port }));
});

gulp.task('images', function(cb) {
  return gulp.src(src + 'images/**/*')
    .pipe($.size({ title : 'images' }))
    .pipe(gulp.dest(dist + 'images/'));
});

gulp.task('watch', function() {
  gulp.watch(src + 'styles/*.scss', ['styles', 'images']);
  gulp.watch(src + 'index.html', ['html']);
  gulp.watch([src + 'app/**/*.js', src + 'app/**/*.hbs'], ['scripts']);
});

gulp.task('clean', function(cb) {
  del([dist], cb);
});

gulp.task('lint', function() {
  return gulp.src('./lib/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['images', 'html','scripts','styles']);
});
