/*
- cherio can help parse the html
- extracts scripts from html body 
- get post body, head, pre head, etc. scripts
- puts all the scripts in a json response
- instruments inline scripts
- beatuifies html, js
*/

var instrumentService = require("../services/instrumentService");
var beautifyService = require("../services/beautifyService");
var routes = require("../routes/routes");
var cheerio = require('cheerio');

module.exports = function (app) {
  app.get(routes.INSTRUMENT, function (req, res) {
    var url = req.param("url");
    var html = req.param("html");
    var js = req.param("js");
    var fmt = req.param("fmt");
    var basePath = req.param("basePath");
    var beautifyOnly = req.param("beautifyOnly");  //deprecated
    console.log("in regular instrumentation of ", url);
    console.log("html:", html, "js:", js);

    if (html === "true") {
      try {
        console.log("about to run instrumentHTML");
        instrumentService.instrumentHTML(url, basePath, function (html) {
          console.log("in callback of instrumentHTML which returns non messed up html")
          if (fmt === "json") {
            console.log("in if, so going to send json");
            var $ = cheerio.load(html);

            var $body = $('body');

            var bodyScripts = [];
            $body.find("script").each(function (i, elem) {
              var attr = $(elem).attr();
              attr.html = $(elem).html();
              bodyScripts.push(attr);
              $(elem).remove();
            });


            var postBodyScripts = [];
            $body.nextAll().each(function (i, elem) {
              if (elem.type && elem.type === "script") {
                var attr = $(elem).attr();
                attr.html = $(elem).html();
                postBodyScripts.push(attr);
                $(elem).remove();
              }
            });

            var postBodyStr = $.html($body.nextAll());
            $body.nextAll().remove();

            var bodyStr = $body.html();
            var bodyAttr = $body.attr();
            $body.remove();

            var $head = $('head');

            var preBodyScripts = [];
            $head.nextAll().each(function (i, elem) {
              if (elem.type && elem.type === "script") {
                var attr = $(elem).attr();
                attr.html = $(elem).html();
                preBodyScripts.push(attr);
                $(elem).remove();
              }
            });
            var preBodyStr = $.html($head.nextAll());
            $head.nextAll().remove();

            var headScripts = [];
            $head.find("script").each(function (i, elem) {
              var attr = $(elem).attr();
              attr.html = $(elem).html();
              headScripts.push(attr);
              $(elem).remove();
            });
            var headStr = $.html("head");
            $head.remove();

            var preHeadScripts = [];
            var $remainingScripts = $("script");
            $remainingScripts.each(function (i, elem) {
              var attr = $(elem).attr();
              attr.html = $(elem).html();
              preHeadScripts.push(attr);
            });
            $remainingScripts.remove();

            $("html").append(headStr);
            $("html").append(preBodyStr);
            var htmlStr = $.html();

            var jsonRes = JSON.stringify({
              htmlStr: htmlStr, //done
              bodyAttr: bodyAttr, //done
              preHeadScripts: preHeadScripts,
              headScripts: headScripts,
              preBodyScripts: preBodyScripts,
              bodyStr: bodyStr,
              bodyScripts: bodyScripts,
              postBodyStr: postBodyStr,
              postBodyScripts: postBodyScripts
            });
            res.send(jsonRes);
          } else {
            console.log("in else, so going to send html");
            res.send(html);
          }

        });
      } catch (err) {
        console.warn("Error on instrumentHTML:", url);
        res.send("");
      }
    } else if (js === "true") {
      try {
        console.log("about to run instrumentJS on url: ", url);
        instrumentService.instrumentJS(url, basePath, function (js) {
          console.log("in api js has iso?:", js);
          res.send(js);
        });
      } catch (err) {
        console.warn("Error on instrumentJS:", url);
        res.send("");
      }
    }
  });

  app.get("/inlineScriptSrcs", function (req, res) {
    conosole.log("in inlineScriptSrcs instrumentation");
    var url = req.param("url");

    instrumentService.getInlineScriptSources(url, function (arrSrcs) {
      res.send(JSON.stringify(arrSrcs));
    });
  });

  app.get(routes.BEAUTIFY_HTML, function (req, res) {
    var url = req.param("url");

    beautifyService.beautifyHTML(url, function (beautifiedHTML) {
      res.send(beautifiedHTML);
    });
  });

  app.get(routes.BEAUTIFY_JS, function (req, res) {
    var url = req.param("url");

    console.log("before beautifyJS call 2, url: ", url);
    beautifyService.beautifyJS(url, function (beautifiedJS) {
      res.send(beautifiedJS);
    });
  });
};