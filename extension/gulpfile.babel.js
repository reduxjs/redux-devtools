import gulp from 'gulp';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import zip from 'gulp-zip';
import webpack from 'webpack';
import mocha from 'gulp-mocha';
import crdv from 'chromedriver';
import devConfig from './webpack/dev.config';
import prodConfig from './webpack/prod.config';
import wrapConfig from './webpack/wrap.config';

function copy(dest) {
  gulp.src('./src/assets/**/*').pipe(gulp.dest(dest));
}

/*
 * dev tasks
 */

gulp.task('webpack:dev', (callback) => {
  webpack(devConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:dev', err);
    }
    gutil.log('[webpack:dev]', stats.toString({ colors: true }));
  });
  callback();
});

gulp.task('copy:dev', (done) => {
  gulp
    .src('./src/browser/extension/manifest.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./dev'));
  copy('./dev');
  done();
});

/*
 * build tasks
 */

gulp.task('webpack:build:extension', (callback) => {
  function webpackProcess(config) {
    return new Promise((resolve, reject) =>
      webpack(config, (err, stats) => {
        if (err) {
          reject(new gutil.PluginError('webpack:build', err));
        }
        gutil.log('[webpack:build]', stats.toString({ colors: true }));
        resolve();
      })
    );
  }
  webpackProcess(wrapConfig)
    .then(() => webpackProcess(prodConfig))
    .then(callback);
});

gulp.task('copy:build:extension', (done) => {
  gulp
    .src('./src/browser/extension/manifest.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('./build/extension'));
  copy('./build/extension');
  done();
});

/*
 * compress task
 */

gulp.task('compress:extension', (done) => {
  gulp
    .src('build/extension/**')
    .pipe(zip('extension.zip'))
    .pipe(gulp.dest('./build'));
  done();
});

gulp.task('compress:firefox', (done) => {
  gulp
    .src('build/firefox/**')
    .pipe(zip('firefox.zip'))
    .pipe(gulp.dest('./build'));
  done();
});

/*
 * watch tasks
 */

gulp.task('copy:watch', () => {
  gulp.watch(
    ['./src/browser/extension/manifest.json', './src/assets/**/*'],
    gulp.series('copy:dev')
  );
});

gulp.task('test:chrome', () => {
  crdv.start();
  return gulp
    .src('./test/chrome/*.spec.js')
    .pipe(mocha({ require: ['@babel/polyfill', 'co-mocha'] }))
    .on('end', () => crdv.stop());
});

gulp.task('test:electron', () => {
  crdv.start();
  return gulp
    .src('./test/electron/*.spec.js')
    .pipe(mocha({ require: ['@babel/polyfill', 'co-mocha'] }))
    .on('end', () => crdv.stop());
});

gulp.task('default', gulp.parallel('webpack:dev', 'copy:dev', 'copy:watch'));
gulp.task(
  'build:extension',
  gulp.parallel('webpack:build:extension', 'copy:build:extension')
);
gulp.task(
  'copy:build:firefox',
  gulp.series('build:extension', (done) => {
    gulp
      .src([
        './build/extension/**',
        '!./build/extension/redux-devtools-extension.js',
      ])
      .pipe(gulp.dest('./build/firefox'))
      .on('finish', function () {
        gulp
          .src('./src/browser/firefox/manifest.json')
          .pipe(gulp.dest('./build/firefox'));
      });
    copy('./build/firefox');
    done();
  })
);
gulp.task('build:firefox', gulp.series('copy:build:firefox'));
