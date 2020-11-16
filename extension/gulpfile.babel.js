import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import jade from 'gulp-pug';
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
 * common tasks
 */
gulp.task('replace-webpack-code', (done) => {
  const replaceTasks = [
    {
      from: './webpack/replace/JsonpMainTemplate.runtime.js',
      to: './node_modules/webpack/lib/JsonpMainTemplate.runtime.js',
    },
    {
      from: './webpack/replace/log-apply-result.js',
      to: './node_modules/webpack/hot/log-apply-result.js',
    },
  ];
  replaceTasks.forEach((task) =>
    fs.writeFileSync(task.to, fs.readFileSync(task.from))
  );
  done();
});

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

gulp.task('views:dev', (done) => {
  gulp
    .src('./src/browser/views/*.pug')
    .pipe(
      jade({
        locals: { env: 'dev' },
      })
    )
    .pipe(gulp.dest('./dev'));
  done();
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
    .then(() => {
      const dest = './build/extension';
      fs.rename(
        `${dest}/js/redux-devtools-extension.bundle.js`,
        `${dest}/js/redux-devtools-extension.js`,
        callback
      );
    });
});

gulp.task('views:build:extension', (done) => {
  gulp
    .src(['./src/browser/views/*.pug'])
    .pipe(
      jade({
        locals: { env: 'prod' },
      })
    )
    .pipe(gulp.dest('./build/extension'));
  done();
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

gulp.task('views:watch', () => {
  gulp.watch('./src/browser/views/*.pug', gulp.series('views:dev'));
});

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

gulp.task(
  'default',
  gulp.parallel(
    'replace-webpack-code',
    'webpack:dev',
    'views:dev',
    'copy:dev',
    'views:watch',
    'copy:watch'
  )
);
gulp.task(
  'build:extension',
  gulp.parallel(
    'replace-webpack-code',
    'webpack:build:extension',
    'views:build:extension',
    'copy:build:extension'
  )
);
gulp.task(
  'copy:build:firefox',
  gulp.series('build:extension', (done) => {
    gulp
      .src([
        './build/extension/**',
        '!./build/extension/js/redux-devtools-extension.js',
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
