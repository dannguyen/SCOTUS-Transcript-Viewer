// Require.js allows us to configure shortcut alias
require.config({
  paths: {
	text: 'libs/require/text',
    order: 'libs/require/order',
    jquery: 'libs/jquery/jquery-1.7.2.min',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
	js_other_plugins : 'libs/jquery/jquery-other-plugins',
	js_smooth_plugin : 'libs/jquery/jquery-smooth-scroll'
  }

});

require(['views/app'], function(AppView){
  var app_view = new AppView;
});