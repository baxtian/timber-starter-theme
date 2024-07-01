# Tema Base Timber

Esta plantilla usa como base el paquete [Starter Theme](https://github.com/timber/starter-theme) de [Timber](https://timber.github.io/docs/v2/installation/installation/#use-the-starter-theme).

## Instalación 

Este repositorio ya tiene modificaciones para usar con **Gulp**. Puede optar por a) clonar el repo o b) extender el **Timber Starter Theme** usando las capacidades de automatización incluidas en este repo.

### A. Clonar

Puede clonar directamente este repositorio
```
git clone git@bitbucket.org:baxtian/timber-starter-theme.git
```

### B. Extender Timber Starter Theme

Crear el proyecto usando la plantilla base de **Timber**.

```
composer create-project upstatement/timber-starter-theme --no-dev

cd timber-starter-theme
```

Habilitar entorno **Gulp** para automatización.

```
npm init --yes

npm i --save-dev gulp gulp-deporder gulp-if gulp-replace gulp-sass gulp-sourcemaps gulp-uglify sass vinyl-paths autoprefixer cssnano del
```

Descargar elementos de automatización.

```
wget https://bitbucket.org/baxtian/timber-starter-theme/downloads/auto.zip && unzip auto.zip && rm auto.zip
```

Modificar el archivo *package.json*.
```
{
	...
	"main": "",
    ...
    "type": "module",
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
/.vscode/
/package-lock.json
```

Inicializar *git*
```
git init
```

Ejecutar **Gulp**
```
npm start
```

En este punto el sistema creará el directorio **./dist** con los archivos de estilos y scripts generador por **Gulp**. Para incluirlos en el tema debe modificar el archivo **src/StarterSite.php**.

Incluir en el método **__construct** en **src/StarterSite.php** antes de llamar al constructor del padre.

```
public function __construct()
{
    ...

    add_action('wp_enqueue_scripts', [$this, 'wp_enqueue_scripts']);

    parent::__construct();
}
```

Agregar el método *wp_enqueue_scripts* en **src/StarterSite.php**.
```
public function wp_enqueue_scripts()
{
    wp_enqueue_script('timber-starter', get_template_directory_uri() . '/dist/js/main.js', [], '1.2', true);
    wp_enqueue_style('timber-starter', get_template_directory_uri() . '/dist/css/main.css', [], '1.2');
}
```
