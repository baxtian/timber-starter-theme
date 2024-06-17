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
import newer from "gulp-newer";
import imagemin from 'gulp-imagemin';
import gulpSass from "gulp-sass";
import deporder from "gulp-deporder";
import stripdebug from "gulp-strip-debug";
import uglify from "gulp-uglify";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

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
        .pipe(sass(dev ? css.devOpts : css.sassOpts))
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
    let jsOutput = gulp.src(js.src)
        .pipe(deporder())
    //  .pipe(concat(js.filename))  Uncomment this line if you want to combine Javascript files

    if (!dev) {
        jsOutput = jsOutput.pipe(stripdebug())
            .pipe(uglify());
    }

    jsOutput = jsOutput.pipe(gulp.dest(js.build));
    return jsOutput;
}

// JavaScript processing
gulp.task('js', async () => {
    processJs(false);
});
gulp.task('jsdev', async () => {
    processJs(true);
});

gulp.task('build', series('images', 'css', 'js'));

// Files where changes should trigger a compile + reload
gulp.task('watch', series('images', 'cssdev', 'jsdev', async () => {

    // image changes
    watch(images.src, series('images'));

    // CSS changes
    watch(css.watch, series('cssdev'));

    // JavaScript main changes
    watch(js.src, series('jsdev'));
}));
