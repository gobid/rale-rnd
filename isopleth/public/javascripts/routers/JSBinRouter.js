/*
- socket io - key value line onSocketData("fondueDTO:arrInvocations") of jsbinrouter - value is the fn
- then adds the invokes to the graph
*/

define([
  "jquery",
  "backbone",
  "underscore",
  "../views/GutterPillView",
  "../views/DropDownJSView",
  "../views/HeaderControlView",
  "../views/CodeMirrorJSView",
  "../views/CodeMirrorHTMLView",
  "../views/CodeMirrorCSSView",
  "../views/HTMLJSLinksView",
  "../views/IsoplethView",
  "../graphs/InvokeGraph",
  "../collections/SourceCollection",
  "../collections/ActiveNodeCollection",
  "../routers/JSBinSocketRouter"
], function ($, Backbone, _,
             GutterPillView,
             DropDownJSView,
             HeaderControlView,
             CodeMirrorJSView,
             CodeMirrorHTMLView,
             CodeMirrorCSSView,
             HTMLJSLinksView,
             IsoplethView,
             InvokeGraph,
             SourceCollection,
             ActiveNodeCollection,
             JSBinSocketRouter) {
  var instance = null;

  var JSBinRouter = Backbone.Router.extend({
    codeMirrors: {
      js: null,
      html: null,
      css: null
    },

    initialize: function () {
      if (instance !== null) {
        throw new Error("Cannot instantiate more than one Singleton, use MySingleton.getInstance()");
      }

      this.activeNodeCollection = new ActiveNodeCollection();
      this.sourceCollection = new SourceCollection(null, {
        scripts: [],
        activeNodeCollection: this.activeNodeCollection
      });

      // this.codeMirrorJSView = new CodeMirrorJSView(this.codeMirrors, this.sourceCollection, this.activeNodeCollection, this);
      console.log("this before passing in JSBinRouter.js call of InvokeGraph:", this);
      this.invokeGraph = new InvokeGraph(this.codeMirrors, this.sourceCollection, this.activeNodeCollection, this);
      this.isoplethView = new IsoplethView(this.codeMirrors, this.sourceCollection, this.activeNodeCollection, this.invokeGraph, this);
      this.isoplethView.render();
      // this.codeMirrorHTMLView = new CodeMirrorHTMLView(this.codeMirrors, this.activeNodeCollection, this);
      // this.dropDownJSView = new DropDownJSView(this.sourceCollection, this.codeMirrorJSView);
      // this.headerControlView = new HeaderControlView(this.activeNodeCollection);
      // this.headerControlView.render();
      // this.codeMirrorCSSView = new CodeMirrorCSSView(this.codeMirrors);
      // this.htmlJSLinksView = new HTMLJSLinksView(this.codeMirrorJSView, this.codeMirrorHTMLView, this.activeNodeCollection, this.sourceCollection, this);
      // this.codeMirrorJSView.htmlJSLinksView = this.htmlJSLinksView;
      // this.codeMirrorHTMLView.htmlJSLinksView = this.htmlJSLinksView;

      this.jsBinSocketRouter = JSBinSocketRouter.getInstance();

      this.bindSocketHandlers();
      this.bindViewListeners();
      // this.fetchData();

      this.totalInvocations = 0;
    },

    fetchData: function () {
      this.jsBinSocketRouter.emit("jsbin:resendAll", {});

      var setupInterval = setInterval(_.bind(function () {
        if (!this.sourceCollection.length) {
          this.jsBinSocketRouter.emit("jsbin:resendAll", {});
        } else {
          clearInterval(setupInterval);
        }
      }, this), 3000);
    },

    bindSocketHandlers: function () {
      this.jsBinSocketRouter.onSocketData("fondueDTO:arrInvocations", function (obj) {
        this.totalInvocations += obj.invocations.length;
        //console.log("Total Invocations Stored:", this.totalInvocations);
        //console.log("obj.invocations:", obj.invocations.length, obj.invocations);
        this.invokeGraph.addInvokes(obj.invocations);

        for (var i = 0; i < obj.invocations.length; i++) {
          obj_invoke = obj.invocations[i];
          //console.log("obj_invoke: ", obj_invoke);
          //if (obj_invoke && obj_invoke.timestamp)
          //  console.log("obj_invoke ts: ", obj_invoke.timestamp);
          //if (obj_invoke && obj_invoke.returnValue && obj_invoke.returnValue.type){
          //  console.log("obj_invoke rv.type: ", obj_invoke.returnValue.type);
          //  if (obj_invoke.returnValue.type == "function") 
          //    console.log("obj_invoke: ", obj_invoke.this.json); // print function content 
          //}
          //if (obj_invoke && obj_invoke.nodeId)
            //console.log("nodeId: ", obj_invoke.nodeId);
        }

        // this.isoplethView.showCallGraph();

        // this.activeNodeCollection.mergeInvocations(obj.invocations);

        if (!this.sourceCollection.length) {
          return;
        }

        if (this.activeNodeCollection.hasFullNodeList) {
          if (!this.uiPaused) {
            // this.codeMirrorJSView.showSources();
            // this.codeMirrorHTMLView.render();
            // this.headerControlView.renderSlider();
            // this.headerControlView.renderPlot();
          }
        }
      }, this);

      // this.jsBinSocketRouter.onSocketData("fondueDTO:screenCapture", function (obj) {
      //   console.log("fondueDTO:screenCapture");
      //   var $img = $("<img>", {src: obj.dataURL});
      //   $("#plotter").html($img);
      // }, this);

      this.jsBinSocketRouter.onSocketData("fondueDTO:css", function (obj) {
        console.log("fondueDTO:css");
        // this.codeMirrorCSSView.setCode(obj.css);
      }, this);

      this.jsBinSocketRouter.onSocketData("fondueDTO:html", function (obj) {
        console.log("fondueDTO:html");
        if (!this.uiPaused) {
          // this.codeMirrorHTMLView.htmlSource = obj.html;
          // this.codeMirrorHTMLView.render();
        }
      }, this);

      this.jsBinSocketRouter.onSocketData("fondueDTO:scripts", function (obj) {
        console.log("fondueDTO:scripts");

        this.sourceCollection.empty();
        this.sourceCollection.add(obj.scripts);
        // this.dropDownJSView.render();

        if (!this.uiPaused) {
          // this.dropDownJSView.detailChange(1);
          // this.headerControlView.lastDetailSlideVal = 1;
          // this.headerControlView.jsDetailChange(null, {value: 120});
          // this.headerControlView.$detailSlider.slider({
          //   value: 100,
          // });
          // this.codeMirrorHTMLView.render();
        }
      }, this);

      this.jsBinSocketRouter.onSocketData("fondueDTO:newNodeList", function (obj) {
        console.log("fondueDTO:newNodeList", obj.nodes.length, "new nodes.");
        this.activeNodeCollection.mergeNodes(obj.nodes);

        this.uiPaused = false;
        // this.codeMirrorJSView.showSources();
        // this.codeMirrorHTMLView.render();
        // this.headerControlView.renderSlider();
        // this.headerControlView.resume();
      }, this);

      // this.headerControlView.on("aspectChange", function (callback) {
      // this.pauseUIUpdates();
      // this.htmlJSLinksView.collapseAll();
      // this.codeMirrorHTMLView.removeAllHighlights();
      // callback();
      // }, this);

      // this.headerControlView.on("jsDetailChange", function (val) {
      //   this.pauseUIUpdates();
      // this.htmlJSLinksView.collapseAll();
      // this.codeMirrorHTMLView.removeAllHighlights();
      // this.dropDownJSView.detailChange(val);
      // }, this);
    },

    bindViewListeners: function () {
      // this.headerControlView.on("activeCodePanel:pause", function (pause) {
      // if (pause) {
      //   this.pauseUIUpdates();
      // } else {
      //   this.uiPaused = false;
      //   this.htmlJSLinksView.collapseAll();
      //   this.codeMirrorJSView.showSources();
      //   this.codeMirrorHTMLView.render();
      //   this.headerControlView.renderSlider();
      //   this.headerControlView.resume();
      // }
      // }, this);

      // this.headerControlView.on("activeCodePanel:reset", function () {
      //   this.pauseUIUpdates();
      // this.htmlJSLinksView.collapseAll();
      // this.activeNodeCollection.empty();
      // this.jsBinSocketRouter.emit("jsbin:reset", {});
      // }, this);

      // this.headerControlView.on("controlView:order", function (jsOrderReversed) {
      // this.sourceCollection.setOrder(jsOrderReversed);
      // this.htmlJSLinksView.collapseAll();
      // this.codeMirrorHTMLView.render();
      // this.dropDownJSView.render();
      // this.codeMirrorJSView.showSources();
      // }, this);

      // this.headerControlView.on("timeSlideChange", function () {
      //   this.uiPaused = true;
      // this.htmlJSLinksView.collapseAll();
      //this.headerControlView.pause();
      // this.codeMirrorHTMLView.render();
      // this.codeMirrorJSView.showSources();
      // }, this);

    },

    pauseUIUpdates: function () {
      console.warn("Ignoring UI Pause Request");
      return;
      // this.uiPaused = true;
      // this.headerControlView.pause();
    },

    nav: function (panelType, codeMirrorInstance) {
      this[panelType](codeMirrorInstance);
    },

    javascript: function (codeMirrorInstance) {
      this.codeMirrors.js = codeMirrorInstance;
    },

    html: function (codeMirrorInstance) {
      this.codeMirrors.html = codeMirrorInstance;
      // this.codeMirrorHTMLView.render();
    },

    css: function (codeMirrorInstance) {
      this.codeMirrors.css = codeMirrorInstance;
      // this.codeMirrorCSSView.render();
    }
  });

  JSBinRouter.getInstance = function () {
    if (instance === null) {
      instance = new JSBinRouter();
    }
    return instance;
  };

  return JSBinRouter;
});