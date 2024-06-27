<?php

use Timber\Timber;
use Timber\Site;
use Timber\User;

/**
 * Clase StarterSite
 */
class StarterSite extends Site
{
	public function __construct()
	{
		add_action('after_setup_theme', [$this, 'theme_supports']);

		add_filter('timber/context', [$this, 'add_to_context']);
		add_filter('timber/twig', [$this, 'add_to_twig']);
		add_filter('timber/twig/environment/options', [$this, 'update_twig_environment_options']);

		add_action('wp_enqueue_scripts', [$this, 'wp_enqueue_scripts']);

		parent::__construct();
	}

	/**
	 * Función para agregar variables de contexto
	 *
	 * @param array $context Arreglo con variables de contexto.
	 */
	public function add_to_context($context)
	{
		$context['foo']   = 'bar';
		$context['stuff'] = 'I am a value set in your functions.php file';
		$context['notes'] = 'These values are available everytime you call Timber::context();';
		$context['menu']  = Timber::get_menu();
		$context['site']  = $this;

		return $context;
	}

	/**
	 * Función para agregar las capacidades de la plantilla
	 *
	 * @return void
	 */
	public function theme_supports()
	{
		// Agregue enlaces de fuentes RSS de publicaciones 
		// y comentarios predeterminados al encabezado.
		add_theme_support('automatic-feed-links');

		/*
		 * Deje que WordPress administre el título del documento.
		 * Al agregar soporte para temas, declaramos que este tema no 
		 * utiliza una etiqueta <title> codificada en el encabezado del 
		 * documento y esperamos que WordPress nos la proporcione.
		 */
		add_theme_support('title-tag');

		/*
		 * Habilite la compatibilidad con miniaturas de publicaciones
		 * en publicaciones y páginas.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support('post-thumbnails');

		/*
		 * Cambie el marcado principal predeterminado para el formulario
		 * de búsqueda, el formulario de comentarios y los comentarios
		 * para generar HTML5 válido.
		 */
		add_theme_support(
			'html5',
			[
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			]
		);

		// Agregar soporte para menús.
		add_theme_support('menus');
	}

	/**
	 * Función apra encolar estilos y scripts compilados por gulp
	 *
	 * @return void
	 */
	public function wp_enqueue_scripts()
	{
		wp_enqueue_script('timber-starter', get_template_directory_uri() . '/dist/js/main.js', [], '1.2', true);
		wp_enqueue_style('timber-starter', get_template_directory_uri() . '/dist/css/main.css', [], '1.2');
	}

	/**
	 * Función para atender el filtro 'myfoo' en plantillas Twig.
	 *
	 * @param string $text Texto al que se concatenará la cadena ' bar'.
	 */
	public function myfoo($text)
	{
		$text .= ' bar!';

		return $text;
	}

	/**
	 * Función para atender la función 'caracteres' en plantillas Twig.
	 *
	 * @param Timber\User $author Recibe una instancia del usuario.
	 */
	public function caracteres($author)
	{
		if(empty($author)) {
			return 0;
		}

		return strlen($author->name());
	}

	/**
	 * Acá se pueden agregar funciones y filtros.
	 *
	 * @param Twig\Environment $twig get extension.
	 */
	public function add_to_twig($twig)
	{
		/*
		 * Requerido cuando desea utilizar template_from_string de Twig.
		 * @link https://twig.symfony.com/doc/3.x/functions/template_from_string.html
		 */
		// $twig->addExtension( new Twig\Extension\StringLoaderExtension() );

		$twig->addFilter(new Twig\TwigFilter('myfoo', [$this, 'myfoo']));
		$twig->addFunction(new Twig\TwigFunction('caracteres', [$this, 'caracteres']));

		return $twig;
	}

	/**
	 * Actualiza las opciones del entorno Twig.
	 *
	 * @link https://twig.symfony.com/doc/2.x/api.html#environment-options
	 *
	 * \@param array $options Arreglo con las variables de entorno.
	 *
	 * @return array
	 */
	public function update_twig_environment_options($options)
	{
		// $options['autoescape'] = true;

		return $options;
	}
}
