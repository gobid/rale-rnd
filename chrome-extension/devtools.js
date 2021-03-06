/*
- onselectionchanged (when something changes in the panels of the chrome extension) - unravelagent - built upon unravel - devtools.html uses it, sets chrome extension icon
- panel adds a tab to the chrome dev tools
- window.unravelAgent.selectElement($0) 
*/

// Script executed every time the devtools are opened.
var name = "Isopleth";

//chrome.devtools.panels.elements.createSidebarPane(name,
//  function (sidebar) {
//    sidebar.setPage("panel.html");
//    sidebar.setHeight("1000px");
//  }
//);

console.log("in devtools.js")

chrome.devtools.panels.create(name, "img/ibex-small.png", "panel.html");

chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
  chrome.devtools.inspectedWindow.eval("window.unravelAgent.selectElement($0)");
});