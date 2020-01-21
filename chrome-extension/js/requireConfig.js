/*
- Script loaded every time the devtools are started, the first time the panel is opened.
- seems that it creates a PanelRouter - but it doesn't send something into the HomeView arg
- detects chrome extension messages (mutation, JSTrace, fondueDTO, etc) and does router triggers
- requireConfig.js - script loaded everytime devtools started, first time panels is opened, requires all the different libraries (requirejs); panelPort - onMessage - addListener - mutation, JSTrace, fondueDTO, ContentScriptReloaded, TabUpdate
*/

require.config({
  // paths configuration
  paths: {
    jquery: './lib/jquery-2.1.3.min',
    underscore: './lib/underscore-min',
    backbone: './lib/backbone',
    text: './lib/text',
    bootstrap: './lib/bootstrap.min',
    handlebars_original: './lib/handlebars',
    handlebars: './lib/handlebars-blocks',
  },
  // non-amd library loaders
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      init: function () {
        // exports
        return this.Backbone.noConflict();
      }
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'handlebars_original': {
      deps: ['bootstrap'], // automatically require bootstrap when requiring an handlebars template
      exports: 'Handlebars'
    },
    'handlebars': { // handlebars with custom block helpers
      deps: ['handlebars_original'],
      exports: 'Handlebars'
    }
  }
});

require([
  "jquery",
  "backbone",
  "routers/PanelRouter"
], function ($, Backbone, PanelRouter) {
  $(document).ready(function () {
    var router = new PanelRouter();
    Backbone.history.start();

    var tabId = chrome.devtools.inspectedWindow.tabId;
    var panelPort = chrome.extension.connect({name: "devtoolspanel"});
    panelPort.postMessage({
      name: "identification",
      data: tabId
    });

    panelPort.onMessage.addListener(_.bind(function (message) {
      if (message && message.target == "page" && message.name == "mutation") {
        router.trigger("mutation", message.data);
      } else if (message && message.target == "page" && message.name == "JSTrace") {
        router.trigger("JSTrace", message.data);
      } else if (message && message.target == "page" && message.name == "fondueDTO") {
        router.trigger("fondueDTO", message.data);
      } else if (message && message.target == "page" && message.name == "ContentScriptReloaded") {
        router.trigger("ContentScriptReloaded", message.data);
      } else if (message && message.target == "page" && message.name == "TabUpdate") {
        router.trigger("TabUpdate", message.data);
      }
    }, this));
  });
});
