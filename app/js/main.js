// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.7.2.min',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    text: 'libs/require/text',

  }

});

require(['views/app'], function(AppView){
  var app_view = new AppView;
});