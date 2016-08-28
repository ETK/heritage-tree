// All used modules.
const gulp = require('gulp');
const babel = require('gulp-babel');
const runSeq = require('run-sequence');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');
const minifyCSS = require('gulp-minify-css');
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const notify = require('gulp-notify');

const appPath = './browser/app/';
const serverPath = './server/';
const sassPath = './browser/scss/';
const destinationPath = './browser/assets/';

// Development tasks
// --------------------------------------------------------------

// Live reload business.
gulp.task('reload', function () {
    livereload.reload();
});

gulp.task('reloadCSS', function () {
    return gulp.src(destinationPath + 'style.css').pipe(livereload());
});

gulp.task('lintJS', function () {

    return gulp.src([appPath + '**/*.js', serverPath + '**/*.js'])
        .pipe(plumber({
            errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());

});

gulp.task('buildJS', ['lintJS'], function () {
    return gulp.src([appPath + 'app.js', appPath + '**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinationPath));
});

gulp.task('buildCSS', function () {

    var sassCompilation = sass();
    sassCompilation.on('error', console.error.bind(console));

    return gulp.src(sassPath + 'main.scss')
        .pipe(plumber({
            errorHandler: notify.onError('SASS processing failed! Check your gulp process.')
        }))
        .pipe(sourcemaps.init())
        .pipe(sassCompilation)
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(destinationPath));
});

// Production tasks
// --------------------------------------------------------------

gulp.task('buildCSSProduction', function () {
    return gulp.src(sassPath + 'main.scss')
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(destinationPath))
});

gulp.task('buildJSProduction', function () {
  return gulp.src([appPath + 'app.js', appPath + '**/*.js'])
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(destinationPath));
});

gulp.task('buildProduction', ['buildCSSProduction', 'buildJSProduction']);

// Composed tasks
// --------------------------------------------------------------

gulp.task('build', function () {
    if (process.env.NODE_ENV === 'production') {
        runSeq(['buildJSProduction', 'buildCSSProduction']);
    } else {
        runSeq(['buildJS', 'buildCSS']);
    }
});

gulp.task('default', function () {

    gulp.start('build');

    // Run when anything inside of browser/js changes.
    gulp.watch(appPath + '**', function () {
        runSeq('buildJS', 'reload');
    });

    // Run when anything inside of browser/scss changes.
    gulp.watch(sassPath + '**', function () {
        runSeq('buildCSS', 'reloadCSS');
    });

    gulp.watch(serverPath + '**/*.js', ['lintJS']);

    // Reload when a template (.html) file changes.
    gulp.watch([appPath + '*.html'], ['reload']);

    livereload.listen();

});
