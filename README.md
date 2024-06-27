# Tema Base Timber

Esta plantilla usa como base el paquete [Starter Theme](https://github.com/timber/starter-theme) de [Timber](https://timber.github.io/docs/v2/installation/installation/#use-the-starter-theme).

## Instalación 

Este repositorio ya tiene modificaciones para usar con gulp, así que puede optar por directamente clonar el repo o puede extender el *Timber Starter Theme* usando las capacidades de gulp incluidas en este repo.

### Clonar

Puede clonar directamente este repositorio
```
git clone git@bitbucket.org:baxtian/timber-starter-theme.git
```

### Extender Timber Starter Theme

Crear el proyecto usnado la plantilla base de *Timber*.

```
composer create-project upstatement/timber-starter-theme --no-dev
```

Habilitar entorno Gulp para automatización.

```
cd timber-starter-theme

npm init --yes

npm i --save-dev gulp gulp-deporder gulp-if gulp-replace gulp-sass gulp-sourcemaps gulp-uglify sass vinyl-paths autoprefixer cssnano del
```

Descargar elementos de automatización.

```
wget https://bitbucket.org/baxtian/timber-starter-theme/downloads/auto.zip

unzip auto.zip

rm auto.zip
```

Modificar el archivo *package.json*.
```
{
	...
	"main": "",
    ...
    "type": "module"
    "scripts": {
        "start": "gulp watch",
        "build": "gulp build",
       ...
    },
	...
}
```

Modificar el archivo *.gitignore*.
```
/composer.lock
/vendor/
/node_modules/
/dist/
/package-lock.json
```

Inicializar *git*
```
git init
```
