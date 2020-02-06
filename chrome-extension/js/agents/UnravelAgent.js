/* 
- Step 1 of Isopleth Architecture (Serialized Deanonymization) from Fig 5 is in the chrome-extension folder. 
- the main logic of the chrome extension 
- built on top of Unravel (the preceding paper)
- UnravelAgent gets deployed on the page and rewrites the page
- inserts all the injectors
- replaces page scripts with unravel's version, injects unravel agent (technically chrome doesn't want you to do this)

- overview of libs used:
- backbone - Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.
- handlebars - templating like jade
- require - JavaScript file and module loader
- Socket.IO - a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. - What's used to send data back and forth for instrumentation (?) 
- text - a RequireJS/AMD loader plugin for loading text resources.
- underscore - just is a set of useful utilities in addition to jquery and backbone
- watch - You may know that the "Observer" design pattern involves executing some function when an observed object changes. Other libraries exist that do this, but with Watch.JS you will not have to change the way you develop. Take a look at the examples to see how simple it is to add Watch.JS to your code.
*/

define([
  "../injectors/jQueryInjector",
  "../injectors/underscoreInjector",
  "../injectors/siteSwapInjector",
  "../injectors/fondueInjector",
  "../injectors/whittleInjector",
], function (jQueryInjector,
             underscoreInjector,
             siteSwapInjector,
             fondueInjector,
             whittleInjector) {
  function UnravelAgent() {
    if (!(this instanceof UnravelAgent)) {
      throw new TypeError("UnravelAgent constructor cannot be called as a function.");
    }
  }

  UnravelAgent.reloadInjecting = function () { 
    // t4, after this - need to find instrumented code, must double chrome inspect
    var agentFn = function () {
      window.unravelAgent = {};
    };

    var goFondue = function () {
      unravelAgent.$().ready(function () {
        unravelAgent.reWritePage();
      });
    };

    //Order is important here
    var start = "if (window.self === window.top) {";
    var f1 = "(" + agentFn.toString() + ").apply(this, []); ";
    var f2 = "(" + jQueryInjector.toString() + ").apply(this, []); ";
    var f3 = "(" + underscoreInjector.toString() + ").apply(this, []); ";
    var f5 = "(" + siteSwapInjector.toString() + ").apply(this, []); ";
    var f7 = "(" + fondueInjector.toString() + ").apply(this, []); ";
    var f8 = "(" + whittleInjector.toString() + ").apply(this, []); ";
    var f13 = "(" + goFondue.toString() + ").apply(this, []); ";
    var end = " } ";

    console.log("before chrome devtools reload injectedScript");

    chrome.devtools.inspectedWindow.reload({
      ignoreCache: true,
      injectedScript: start + f1 + f2 + f3 + f5 + f7 + f8 + f13 + end
    });

    // oh this just injects the library scripts?
    // what about instrumentation? - seems to happen in whittle injector?

    console.log("after chrome devtools reload injectedScript");

    var checkTimeout = function (isActive) {
      if (isActive) {
        window.location.href = "";
      } else {
        window.setTimeout(function () {
          UnravelAgent.checkActive(checkTimeout)
        }, 10000);
      }
    };

    checkTimeout(false);
    console.log("at the end of reloadInjecting")
  };

  //public static
  UnravelAgent.checkActive = function (callback) {
    UnravelAgent.runInPage(function () {
      return !!window.unravelAgent;
    }, callback);
  };

  UnravelAgent.runInPage = function (fn, callback) {
    var args = Array.prototype.slice.call(arguments, 2);
    var evalCode = "(" + fn.toString() + ").apply(this, " + JSON.stringify(args) + ");";
    chrome.devtools.inspectedWindow.eval(evalCode, {}, callback);
  };

  UnravelAgent.prototype = {
    //instance methods
    constructor: UnravelAgent,

    isInjecting: false
  };

  return UnravelAgent;
});