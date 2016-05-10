var elixir = require('laravel-elixir');

require( 'elixir-jshint' );
 
/**
 destination folder
 **/
var dest = 'assets/';

//trailing slash required.
elixir.config.assetsDir = 'resources/assets/'; 

elixir.config.publicPath = dest;

elixir.config.js.browserify.transformers.push({
    name: 'babelify',
    options: {}
});

elixir( function( mix ){
    mix.jshint( ['js/**/*.js', '!js/vendor/*.js'], {
        lookup: true, // default is true 
        linter: 'jshint' // default is "jshint" 
    });
});

elixir(function(mix) {
    mix.sass('app.scss', dest + 'css/style.css');
});

elixir(function(mix) {
    mix.browserify('main.js', dest + 'js/bundle.js', null, {
        global: true
    });
});

elixir(function(mix) {
    mix.browserSync({
      server:'./public',
      proxy: false
    });
});