/*
- click => reloadInjecting 
- throttle/removethrottle => throttles / removes throttles
- note the syntax _.bind means to: Bind a function to an object, meaning that whenever the function is called, the value of this will be the object. 
- handles reset, resendAll, html
- socket: a connection to a server on which you can send data
- bin - oh as in jsbin - treating isopleth as a sort of js bin - hm (?)
- render: render the page - when bin ready - else restart
- introPageHTML - add and remove highlight - is this even used (?)

- Fondue DTO sent in panel view - as node invocations - transmitted over web socket in "handleFondueDto" panel view - then isopleth gets it on 38 of jsbin socket router

- see per function comments below

*/

define([
  "backbone",
  "underscore",
  "jquery",
  "handlebars",
  "../agents/UnravelAgent",
  "../collections/NodeCollection",
  "../routers/PanelSocketRouter",
  "text!../templates/view.html"
], function (Backbone, _, $,
             Handlebars,
             UnravelAgent,
             NodeCollection,
             IbexSocketRouter, viewTemplate) {
  return Backbone.View.extend({
    template: Handlebars.compile(viewTemplate),

    events: {
      "click #reload": "reloadInjecting", // t2. reload triggers this
      "click #throttleInvokes": "throttleInvokes",
      "click #removeThrottle": "removeThrottle"
    },

    initialize: function () {
      this.sendScriptsToJSBin = _.bind(this.sendScriptsToJSBin, this);
      this.getScriptMetaData = _.bind(this.getScriptMetaData, this);

      this.ibexSocketRouter = IbexSocketRouter.getInstance();

      this.ibexSocketRouter.onSocketData("jsbin:reset", this.resetTracerResendNodes, this);
      this.ibexSocketRouter.onSocketData("jsbin:resendAll", this.sendNodesHTMLCSSToJSBin, this);
      this.ibexSocketRouter.onSocketData("jsbin:html", this.introPageHTML, this);

      this.nodeCollection = new NodeCollection();
      this.binSetupInProgress = true;
    },

    render: function (unravelAgentActive) { // t8
      console.log("in render, right before createBin called")
      this.$el.html(this.template());

      if (unravelAgentActive) {
        this.$(".active-mode").show();

        this.createBin(); //Right after chrome injection, before fondue installed

        this.ibexSocketRouter.on("connected", this.onBinReady, this);
      } else {
        this.$(".restart-mode").show();
        return;
      }
    },

    introPageHTML: function (o) {
      if (o.selected === true) {
        UnravelAgent.runInPage(function (relatedDomQueries) {
          unravelAgent.introJsBridge.addHighlight(relatedDomQueries);
        }, null, o.relatedDomQueries);
      } else if (o.selected === false) {
        UnravelAgent.runInPage(function (relatedDomQueries) {
          unravelAgent.introJsBridge.removeHighlight(relatedDomQueries);
        }, null, o.relatedDomQueries);
      }
    },

    resetTracerResendNodes: function () {
      console.log("JSBin requesting tracer reset and new node list.");
      UnravelAgent.runInPage(function () {
        // unravelAgent.fondueBridge.resetTracer();
        // unravelAgent.fondueBridge.emitNodeList();
      });
    },

    sendNodesHTMLCSSToJSBin: function (data) { // sending nodes to JSBin
      if (this.binSetupInProgress) {
        console.log("Ignoring JSBin resendAll request, still setting up...");
        return;
      }

      if (this.sendingToBin) {
        console.log("Ignoring JSBin resendAll request, transmission in progress...");
        return;
      }

      var send = _.bind(function () {
        if (!this.binReady) {
          console.log("Bin not ready for data, waiting...");
          setTimeout(send, 500);
          return;
        }

        console.log("Sending JSBin new set of HTML/CSS/JS");
        console.log("sendingToBin set to True");
        this.sendingToBin = true;
        this.sendScriptsToJSBin();

        var setFalse = _.bind(function () {
          console.log("sendingToBin set to False");
          this.sendingToBin = false;
        }, this);

        var transmissionDone = _.bind(function () {
          setTimeout(setFalse, 10000);
        }, this);

        UnravelAgent.runInPage(function () {
          // unravelAgent.emitCSS();
          // unravelAgent.emitHTMLSelect();
          // unravelAgent.fondueBridge.emitNodeList();
        }, transmissionDone);
      }, this);

      send();
    },

    onBinReady: function () {
      this.binReady = true;
    },

    onFondueReady: function () { // loads all the nodes from fondue
      var panelView = this;
      var tryToGetNodes = function () {
        console.log("Waiting on fondue'd doc to load...");

        var onNodesLoaded = function (nodeArr) {
          if (!nodeArr) {
            setTimeout(tryToGetNodes, 500);
          } else {
            //Wait for other scripts to come in
            panelView.nodeCollection.add(nodeArr);
            console.log("1. ", nodeArr.length, " nodes loaded.");
            panelView.getScriptMetaData(function () {
              console.log("2. Script metadata found");

              UnravelAgent.runInPage(function () {
                unravelAgent.scriptLoadComplete = true;
                unravelAgent.startObserving();
                unravelAgent.fondueBridge.updateTrackedNodes();
              }, function () {
                console.log("3. Observing tracer nodes.");

                panelView.binSetupInProgress = false;
                panelView.sendNodesHTMLCSSToJSBin();
              });
            });
          }
        };

        UnravelAgent.runInPage(function () {
          var hasBodyChildren = !!unravelAgent.$("body").children().length;
          var scripts = unravelAgent.$("script");
          if (hasBodyChildren && scripts && scripts[0]) {
            unravelAgent.fondueBridge.startTracking();
            return unravelAgent.fondueBridge.getTracerNodeList(); //for our script metadata
          } else {
            console.log("PanelView: Waiting on scripts to finish loading...");
            return false;
          }
        }, onNodesLoaded);
      };

      tryToGetNodes();
    },

    createBin: function () { // t9 // save the bin to the localhost
      console.log("in createBin");
      var jsBinCallback = _.bind(function (response) { 
        // this deals with new tab, but not getting data from fondue
        console.log("in jsBinCallback, opening new tab");
        var binUrl = response.url;
        var tabUrl = "http://localhost:3007/" + binUrl + "/edit?html,js";
        console.log(tabUrl);
        window.open(tabUrl);
        this.ibexSocketRouter.setBinId(binUrl);
      }, this);

      $.ajax({
        url: "http://localhost:3007/api/save",
        data: {
          html: "",
          css: "",
          javascript: "",
          fondue: {
            traces: [],
            scripts: []
          }
        },
        datatype: "json",
        method: "post"
      }).done(jsBinCallback);
    },

    throttleInvokes: function () { // constrain the number of invokes per millis
      UnravelAgent.runInPage(function () {
        __tracer.setThrottleInvokeMillis(500);
      }, null);
    },

    removeThrottle: function () { // undo throttle
      UnravelAgent.runInPage(function () {
        __tracer.setThrottleInvokeMillis(null);
      }, null);
    },

    getScriptMetaData: function (callback) { // get script metadata
      var metaCallback = function (o) {
        console.log("o: ", o);
        if (o) {
          this.location = o.location;
          this.metaScripts = o.metaScripts;
        }
        else {
          this.location = null
          this.metaScripts = null;
        }
        

        if (callback) {
          callback();
        }
      };

      UnravelAgent.runInPage(function () {
        var location = unravelAgent.getLocation();
        var metaScripts = unravelAgent.metaScripts();

        return {
          location: location,
          metaScripts: metaScripts
        };
      }, _.bind(metaCallback, this));
    },

    handleFondueDto: function (fondueDTO) { // THIS IS THE MAIN FN THAT EMITS THE EVENT STR AND FONDUE OBJ
      this.ibexSocketRouter.emit(fondueDTO.eventStr, fondueDTO.obj);
    },

    corsGet: function (url, callback) { // get the cors
      var http = new XMLHttpRequest();
      http.open("GET", url, true);

      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          try {
            callback(http);
          } catch (err) {
            console.warn("Err on http req: ", http);
          }

        }
      };

      http.send();
    },

    sendScriptsToJSBin: function (callback) { // sending scripts to the js bin, each node to json, pluck out just the paths that are unique and send; detect and list out external scripts; html function (?); internal (uses script tag) and external (its own file) script separation - scripts gotten from html source; 
      var hitScripts = _.chain(this.nodeCollection.models)
        .map(function (model) {
          return model.toJSON()
        })
        .pluck("path")
        .unique()
        .map(function (path) {
          var meta = _.find(this.metaScripts, function (s) {
            return s.path === path;
          }, this);

          // if (!meta) {
          //   return {
          //     path: path,
          //     builtIn: true,
          //     url: null,
          //     inline: null,
          //     domPath: null,
          //     order: null,
          //     js: ""
          //   };
          // } else {
          //   meta.merged = true;
          // }

          return {
            path: path,
            url: path.split("#")[0], //ignore hash parts
            builtIn: false,
            inline: meta ? meta.inline : null,
            domPath: meta ? meta.domPath : null,
            order: meta ? meta.order : null,
            js: ""
          };
        }, this).value();

      // _(this.metaScripts).each(function (metaS) {
      //   if (!metaS.merged && metaS.url) {
      //     var path = metaS.url.split("#")[0];
      //     hitScripts.push({
      //       path: path,
      //       url: path,
      //       builtIn: false,
      //       inline: metaS.inline,
      //       domPath: metaS.domPath,
      //       order: metaS.order,
      //       js: ""
      //     });
      //   }
      // }, this);

      var emitToBin = _.bind(function () {
        this.ibexSocketRouter.emit("fondueDTO:scripts", {scripts: hitScripts});
        if (callback) {
          callback();
        }
      }, this);

      var externalScripts = _(hitScripts).chain().where({
        inline: false
      }).sortBy(function (o) {
        return o.order
      }).value();

      var internalScripts = [];
      _.each(this.metaScripts, function (s) {
        if (s.unTraced) {
          internalScripts.push({
            path: s.path,
            url: s.url, //ignore hash parts
            builtIn: false,
            inline: s.inline,
            domPath: s.domPath,
            order: s.order,
            unTraced: true,
            js: ""
          });
        }
      }, this);

      internalScripts = _(hitScripts.concat(internalScripts)).chain().where({
        inline: true
      }).sortBy(function (o) {
        return o.order
      }).value();

      var scriptHTMLCallback = function (arrJsOrder) {
        _(arrJsOrder).each(function (srcJS, i) {
          var order = srcJS.order;
          var js = srcJS.js;

          var fileObj = _(internalScripts).find(function (file) {
            return file.order === order;
          });

          if (fileObj) {
            fileObj.js = js;
          } else {
            console.warn("HTML INLINE SCRIPT ORDER MISMATCH." +
              " Instrument Service cheerio found a script in a " +
              "different order than the whittle injector.");
          }
        });
      };

      if (internalScripts.length > 0) {
        if (externalScripts.length > 0) {
          this.getScriptsFromInlineHTML(this.location.href, _.bind(function (arrJs) {
            scriptHTMLCallback(arrJs);
            this.getScriptsFromExternal(externalScripts, emitToBin);
          }, this));
        } else {
          this.getScriptsFromInlineHTML(this.location.href, _.bind(function (arrJs) {
            scriptHTMLCallback(arrJs);
            emitToBin();
          }, this));
        }
      } else if (externalScripts.length > 0) {
        this.getScriptsFromExternal(externalScripts, emitToBin);
      }
    },

    getScriptsFromInlineHTML: function (htmlUrl, callback) { // gets scripts from internal HTML <script> tag
      htmlUrl = htmlUrl.split("#")[0] + "";  //ignoring after hashes because server doesn't get them
      console.log("in PanelView before fetchUrl");
      var fetchUrl = "https://localhost:3001/inlineScriptSrcs?url=" + encodeURIComponent(htmlUrl);

      this.corsGet(fetchUrl, _.bind(function (http) {
        var arrJSOrder = JSON.parse(http.responseText);
        callback = _.bind(callback, this);
        callback(arrJSOrder);
      }, this));
    },

    getScriptsFromExternal: function (externalScripts, callback) { // gets scripts from external JS files
      var tries = 0;
      _(externalScripts).each(function (fileObj) {
        console.log("beautifying inline scripts:");
        var formattedUrl = "https://localhost:3001/beautifyJS?url=" + encodeURIComponent(fileObj.path);

        this.corsGet(formattedUrl, _.bind(function (http) {
          var fileObj = _(externalScripts).find(function (file) {
            var fetchedUrl = decodeURIComponent(http.responseURL.split("url=")[1]);
            return file.url === fetchedUrl;
          });
          fileObj.js = http.responseText;

          tries++;
          if (tries == externalScripts.length) {
            callback();
          }
        }, this));
      }, this);
    },

    reloadInjecting: function () {
      UnravelAgent.reloadInjecting(); // t3. click reload comes here
    }
  });
});