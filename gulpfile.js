// Gulp.js para desarrollo Wordpress
'use strict';

// Directorios fuente y de destino
const dir = {
    src: './assets/',
    build: './dist/'
};

// Gulp y plugins
import gulp, { src, dest, series, watch } from 'gulp';
import { deleteAsync } from 'del';
import gulpif from 'gulp-if';
import gulpSass from 'gulp-sass';
import deporder from 'gulp-deporder';
import uglify from 'gulp-uglify';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sourcemaps from 'gulp-sourcemaps';
import vinylPaths from 'vinyl-paths';
import replace from 'gulp-replace';
import * as dartSass from 'sass';

// Ajustes para las imágenes: directorio fuente, imágenes 
// a excluir y directorio de destino
const images = {
    src: dir.src + 'img/**/*.{gif,jpg,png,svg}',
    build: dir.build + 'img/'
};

// Función para procesamiento de imágenes
async function processImages() {
    return src(images.src, { "encoding": false })
        .pipe(dest(images.build));
}

// Tarea gulp para procesamiento de imágenes
gulp.task('images', async () => {
    processImages();
});

// Ajustes SASS
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

// Función para procesamiento SASS
async function processSass(dev = false) {
    return src(css.src)
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass(dev ? css.devOpts : css.sassOpts))
        .pipe(gulpif(dev, sourcemaps.write('../maps')))
        .pipe(replace('../img/', '../dist/img/'))
        .pipe(dest(`${css.build}`));
}

// Tareas gulp para SASS: prod y dev
gulp.task('css', async () => {
    processSass(false)
});
gulp.task('cssdev', async () => {
    processSass(true);
});

// Ajustes JavaScript
const js = {
    src: dir.src + 'js/**/*',
    build: dir.build + 'js/',
    filename: 'scripts.js'
};

// FUnción para procesamiento Javascript
function processJs(dev = false) {
    return src(js.src)
        .pipe(deporder())
        .pipe(gulpif(dev, sourcemaps.init()))
        //  .pipe(concat(js.filename))  Uncomment this line if you want to combine Javascript files
        .pipe(gulpif(dev, sourcemaps.write('../maps')))
        .pipe(gulpif(!dev, uglify()))
        .pipe(dest(`${js.build}`));
}

// Tareas gulp para procesamiento Javascript: prod y dev
gulp.task('js', async () => {
    processJs(false);
});
gulp.task('jsdev', async () => {
    processJs(true);
});

// Tarea gulp para eliminar directorio de producción
gulp.task('clean', function () {
    return src(dir.build, { "allowEmpty": true })
        .pipe(vinylPaths(deleteAsync));
});

// Tarea gulp para producción
gulp.task('build', series('clean', 'images', 'css', 'js'));

// Tarea gulp para desarrollo
gulp.task('watch', series('clean', 'images', 'cssdev', 'jsdev', async () => {

    // Atender a cambios en img
    watch(images.src, series('images'));

    // Atender a cambios en css
    watch(css.watch, series('cssdev'));

    // Atender a cambios en js
    watch(js.src, series('jsdev'));
}));
