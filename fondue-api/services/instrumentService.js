var cheerio = require('cheerio');
var _ = require('underscore');
var URI = require('URIjs');
var request = require("request");
var util = require("../util/util");
var routes = require("../routes/routes");
var fondueService = require("./fondueService");

var blockedDomains = [
  "static.dynamicyield.com",
  "static.chartbeat.com",
  "scorecardresearch.com",
  "connect.facebook.net",
  "google-analytics.com",
  "analytics",
  "beacon.krxd.net",
  // "trackingTags_v1.1",
  // "html5shiv",
  "advertisement",
  "swfobject",
  // "ac-globalnav.built",
  "global/scripts/lib/prototype",
  // "browserdetect",
  "feedstatistics",
  // "search_decorator",
  // "redirect",
  "scriptaculous",
  // "ac-globalfooter.built",
  // "ac_retina",
  // "ac_base",
  // "s_code_h",
  // "apple_core",
  // "sizzle",
  "secure.assets.tumblr.com/languages/strings/en_US",
  "assets/scripts/tumblr/utils/exceptions.js",
  "assets/scripts/vendor/yahoo/rapid/rapidworker",
  "rapidworker-1.2.js",
  "rapid-3.36.1.js",
  "plugins.js?v=0.1",
  // "modernizr.custom",
  "cedexis",
  "gstatic",
  "strings/en_US.js",
  // "https://assets.tumblr.com/client/prod/app/header.build.js",
  "https://assets.tumblr.com/assets/scripts/vendor/yahoo/rapid/rapid-3.42.1.js",
  "https://assets.tumblr.com/assets/scripts/tumblr/utils/popover.js",
  "https://assets.tumblr.com/assets/scripts/registration/registration.js",
  "https://assets.tumblr.com/assets/scripts/dashboard.js",
  "https://assets.tumblr.com/client/prod/app/vendor.build.js",
  "https://assets.tumblr.com/client/prod/app/global.build.js",
  "gd-core-bottom",
  "gd-home",
  "https://expasy.org/js/jquery182.js",
  "https://expasy.org/js/jqueryNoConflict.js",
  "https://expasy.org/js/jquery.easing.1.3.js",
  "https://cdnjs.cloudflare.com/ajax/libs/prototype/1.7.3/prototype.min.js",
  "https://expasy.org/js/query_engine.js",
  "https://ajax.googleapis.com/ajax/libs/mootools/1.4.1/mootools-yui-compressed.js",
  "https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.OfYsKuVZ3qI.O/m=auth/exm=plusone/rt=j/sv=1/d=1/ed=1/am=wQE/rs=AGLTcCMVod3aO7ybjljp3cyn2IsEoP0pUg/cb=gapi.loaded_1",
  "https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.OfYsKuVZ3qI.O/m=plusone/rt=j/sv=1/d=1/ed=1/am=wQE/rs=AGLTcCMVod3aO7ybjljp3cyn2IsEoP0pUg/cb=gapi.loaded_0",
  "https://apis.google.com/js/plusone.js",
  "https://connect.facebook.net/en_GB/all.js",
  "https://connect.facebook.net/en_GB/all.js?hash=5543556ded56c6316318b0451eb9a8d2&ua=modern_es6",
  "https://fonts.googleapis.com/css?family=Droid%20Sans|Boogaloo",
  "https://maps.googleapis.com/maps-api-v3/api/js/40/3/common.js",
  "https://maps.googleapis.com/maps-api-v3/api/js/40/3/map.js",
  "https://maps.googleapis.com/maps-api-v3/api/js/40/3/util.js",
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyC782k-SFBeK0nx99t6l3eMOiK-cQD8DRI&sensor=false&libraries=geometry&v=3.40",
  "https://platform.twitter.com/js/button.93a0c25c2d2f3081c705c98c2d9dec0e.js",
  "https://platform.twitter.com/widgets.js",
  "https://ssl.google-analytics.com/ga.js",
  "https://ssl.google-analytics.com/__utm.gif?utmwv=5.7.2&utms=4&utmn=682748143&utmhn=www.mapstd.com&utmcs=windows-1252&utmsr=1440x900&utmvp=1440x766&utmsc=24-bit&utmul=en-us&utmje=0&utmfl=-&utmdt=MapsTD&utmhid=2020346644&utmr=-&utmp=%2F&utmht=1583517621999&utmac=UA-29746608-1&utmcc=__utma%3D97885443.1537363129.1579129450.1583514582.1583517299.22%3B%2B__utmz%3D97885443.1579129450.1.1.utmcsr%3D(direct)%7Cutmccn%3D(direct)%7Cutmcmd%3D(none)%3B&utmjid=&utmu=qAAAAAAAAAAAAAAAAAAAAAAE~",
  "https://syndication.twitter.com/i/jot?l=%7B%22widget_origin%22%3A%22https%3A%2F%2Fwww.mapstd.com%2F%22%2C%22widget_frame%22%3Afalse%2C%22language%22%3A%22en%22%2C%22message%22%3A%22m%3Anocount%3A%22%2C%22_category_%22%3A%22tfw_client_event%22%2C%22triggered_on%22%3A1583517625360%2C%22dnt%22%3Afalse%2C%22client_version%22%3A%22fc3e851%3A1583358213678%22%2C%22format_version%22%3A1%2C%22event_namespace%22%3A%7B%22client%22%3A%22tfw%22%2C%22page%22%3A%22button%22%2C%22section%22%3A%22share%22%2C%22action%22%3A%22impression%22%7D%7D",
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyC782k-SFBeK0nx99t6l3eMOiK-cQD8DRI&sensor=false&libraries=geometry&v=3.40",
  "jquery-3.4.1.min.js",
  "style.css.map",
  "Chart.min.js",
  "chartjs",
  "hammer",
  "moment",
];


module.exports = {
  getInlineScriptSources: function (url, callback) {
    request({
      url: url,
      method: "GET",
      rejectUnauthorized: false,
      headers: {
        "Cache-Control": "no-cache",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.8"
      }
    }, function (err, subRes, body) {
      if (err) throw err;

      //console.log("Fetching inline scripts for JSBin", url);

      var arrJS = [];
      var $ = cheerio.load(body);
      var scripts = $("script").toArray();

      var beautifyNext = function (scriptNode, i) {
        var next = function () {
          if (scripts.length) {
            i++;
            beautifyNext(scripts.pop(), i);
          } else {
            callback(arrJS);
          }
        };

        var $scriptEl = $(scriptNode);
        if (!$scriptEl.attr("src")) {
          var src = $scriptEl.html();
          //console.log("before beautifyJS call 3, src: ", src);
          util.beautifyJS(src, url, function (src) {
            arrJS.push({
              order: i,
              js: src
            });

            next();
          });
        } else {
          next();
        }
      };

      beautifyNext(scripts.pop(), 0);
    });
  },

  instrumentHTML: function (url, basePath, callback) {
    request({
      url: url, method: "GET", rejectUnauthorized: false, gzip: true, headers: {
        "Cache-Control": "no-cache",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.8"
      }
    }, function (err, subRes, body) {
      if (err) {
        console.log("Error on fetching HTML. Returning \"\" for:", url);
        callback("");
        return;
      }

      // body looks good and makes sense here

      body = util.beautifyHTML(body);  //Remove crap that breaks fondue

      var $ = cheerio.load(body);
      var domItems = $("*");
      _(domItems).each(function (domItem) {
        var $domItem = $(domItem);

        // if ($domItem.is("iframe")) {
        //   $domItem.remove();
        // }

        // for all scripts replace "src" with insrumented version?
        if ($domItem.is("script")) {
          $domItem.removeAttr("nonce");
          // console.log("$domItem", $domItem); // some of them end up being just text/js with no src
          var elSrcLink = $domItem.attr("src"); // ah ok it only does it if elSrcLink is not null
          if (elSrcLink && elSrcLink.indexOf("chrome-extension") < 0) {
            if ($domItem.is("script")) {
              if (elSrcLink && elSrcLink.indexOf("http") < 0) {
                elSrcLink = URI(elSrcLink).absoluteTo(basePath).toString();
              }

              $domItem.attr("src", routes.HOST + routes.INSTRUMENT + "?js=true&url=" + encodeURIComponent(elSrcLink));
            }
          }
        }

      });

      var fondueOptions = {
        path: url,
        include_prefix: false
      };

      var cleanedSrc = $.html();
      // console.log("cleanedSrc:", cleanedSrc);
      // cleaned src looks good
      fondueService.instrumentHTML(cleanedSrc, fondueOptions, function (src) {
        var $ = cheerio.load(src);
        $("html > head").prepend($("script")[0]);

        var html = $.html();
        if (html.indexOf("nonce") > -1) {
          throw new Error();
        }
        callback(html);
      });
    });

  },

  instrumentJS: function (url, basePath, callback) {
    request({
      url: url,
      fileName: basePath,
      method: "GET",
      rejectUnauthorized: false,
      gzip: true
    }, function (err, subRes, body) {
      //console.log("in instrumentJS, url: ", url, "body: ", body);
      if (err) {
        console.log("Error on fetching JS. Returning \"\" for:", url);
        callback("");
        return;
      }
      //console.log("after err check");
      if (_(blockedDomains).find(function (domain) {
          if (url.indexOf(domain) > -1) {
            return true;
          }
        })) {
        console.log("Blocking ad source request and returning original for:", url);

        callback(body);
        return;
      }
      //console.log("after blockedDomains check");

      var fondueOptions = {
        path: url,
        include_prefix: false
      };

      //console.log("about to call fondueService.instrumentJavaScript");
      fondueService.instrumentJavaScript(body, fondueOptions, function (src) {
        callback(src);
      });
    });
  }
};