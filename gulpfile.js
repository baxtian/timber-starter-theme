// Gulp.js configuration for WordPress development with XAMPP
'use strict';

const

    // Source and build folders
    dir = {
        src: './assets/',
        build: './dist/'
    };

// Gulp and plugins
import gulp from "gulp";
const { src, dest, series, watch } = gulp;
import gulpif from "gulp-if";
import newer from "gulp-newer";
import imagemin from 'gulp-imagemin';
import gulpSass from "gulp-sass";
import deporder from "gulp-deporder";
import uglify from "gulp-uglify";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sourcemaps from "gulp-sourcemaps";
import {deleteAsync} from "del";
import vinylPaths from 'vinyl-paths';

// Image settings, assumes images are stored in the /img directory in the theme folder
const images = {
    src: dir.src + 'img/**/*',
    exclude: [`!${dir.src}img/*.psd`, `!${dir.src}img/*.xcf`],
    build: dir.build + 'img/'
};
// image processing
gulp.task('images', async () => {
    let rules = [images.src];
    rules = rules.concat(images.exclude);
    return src(rules)
        .pipe(newer(images.build))
        .pipe(imagemin())
        .pipe(dest(images.build));
});

// CSS processing
// CSS settings
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);

const css = {
    src: dir.src + 'scss/main.scss',
    watch: dir.src + 'scss/**/*',
    build: dir.build + 'css',
    sassOpts: {
        outputStyle: 'compressed',
        precision: 3,
        errLogToConsole: true
    },
    devOpts: {
        outputStyle: 'expanded',
        precision: 3,
        errLogToConsole: true
    },
    processors: [
        autoprefixer(),
        cssnano()
    ]
};

// CSS processing

async function processSass(dev = false) {
    return src(css.src)
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass(dev ? css.devOpts : css.sassOpts))
        .pipe(gulpif(dev, sourcemaps.write('../maps')))
        .pipe(dest(`${css.build}`));
}

gulp.task('css', async () => {
    processSass(false)
});
gulp.task('cssdev', async () => {
    processSass(true);
});

// JavaScript settings
const js = {
    src: dir.src + 'js/**/*',
    build: dir.build + 'js/',
    filename: 'scripts.js'
};

function processJs(dev = false) {
    return src(js.src)
        .pipe(deporder())
        .pipe(gulpif(dev, sourcemaps.init()))
        //  .pipe(concat(js.filename))  Uncomment this line if you want to combine Javascript files
        .pipe(gulpif(dev, sourcemaps.write('../maps')))
        .pipe(gulpif(!dev, uglify()))
        .pipe(dest(`${js.build}`));
}

// JavaScript processing
gulp.task('js', async () => {
    processJs(false);
});
gulp.task('jsdev', async () => {
    processJs(true);
});

gulp.task('clean', function () {
    return src(dir.build)
		.pipe(vinylPaths(deleteAsync));
});

gulp.task('build', series('clean', 'images', 'css', 'js'));

// Files where changes should trigger a compile + reload
gulp.task('watch', series('clean', 'images', 'cssdev', 'jsdev', async () => {

    // image changes
    watch(images.src, series('images'));

    // CSS changes
    watch(css.watch, series('cssdev'));

    // JavaScript main changes
    watch(js.src, series('jsdev'));
}));
