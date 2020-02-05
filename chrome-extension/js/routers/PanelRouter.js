/*
- routers map urls to pages within the frontend webapp
- routers - define action functions that are triggered when certain URL fragments are matched
- routes hash that pairs routes to actions (i.e. routes: {'url': 'function'})
- when the fondueDTO trigger occurs then 
- HomeView is a class def that is sent in from requireConfig (but don't actually see the passing happening there) - it is instantiated on line 27
- checks if the UnravelAgent is active 
- apparently the homeView will render based on the status of isActive
- when the fondueDTO trigger occurs then we handle the fondue data
- when ContentScriptReloaded then runInPage => homeView => when fondue is ready (?)
- when TabUpdate then check if UnravelAgent is active and if so clear href in url bar (?)
*/

define([
  "backbone",
  "../views/PanelView",
  "../agents/UnravelAgent"
], function (Backbone, HomeView, UnravelAgent) {

  return Backbone.Router.extend({
    heardReload: false,

    initialize: function () {
    },

    routes: {
      "": "start"
    },

    start: function () { // t6
      console.log("in PanelRouter start");
      this.homeView = new HomeView();
      var router = this;

      UnravelAgent.checkActive(function (isActive) { // t7
        console.log("in UnravelAgent.checkActive, right before router.homeView.render");
        router.unravelAgent = new UnravelAgent();
        router.homeView.render(isActive);
        document.body.appendChild(router.homeView.el);
        if (!isActive) {
          return;
        }

        router.on("fondueDTO", function (data) {
          router.homeView.handleFondueDto(data);
         }, router);

        router.on("ContentScriptReloaded", function (data) {
          if (!this.heardReload) {
            this.heardReload = true;

            UnravelAgent.runInPage(function () {
              window.dispatchEvent(new CustomEvent("StopCSReloadEmitter"));
            }, function onRunDone(){
              router.homeView.onFondueReady();
            });
          }
        }, router);

        router.on("TabUpdate", function (data) {
          UnravelAgent.checkActive(function (isActive) {
            if (!isActive) {
              window.location.href = "";
            }
          });
        }, router);

      });
    }
  });
});
