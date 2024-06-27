<?php
/**
 * Tema Base Timber
 * https://bitbucket.org/baxtian/timber-starter-theme/
 */

use Timber\Timber;
use StarterSite;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/StarterSite.php';

Timber::init();

// Determinar directorio de plantillas
Timber::$dirname = ['templates', 'views'];

new StarterSite();
