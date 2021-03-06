/*
-  compiles all the graphs collections and draws the graph
- all bottom buttons laid out here, sets up custom colors, functions for all the buttons, draws async relations (Josh, Tom fondue); coloring of invoke nodes (blue, toplevel, ajax, click, etc); handlesNodeClick, handlesEdgeClick, heatmap, updates label, draws the actual graph; defines other buttons as well like downloading invokes etc
*/

define([
  "jquery",
  "backbone",
  "underscore",
  "handlebars",
], function ($, Backbone, _, Handlebars) {
  return Backbone.View.extend({
    events: {
      "click #draw": "draw", // comes from this.invokeGraph
      "click #markNonLib": "markNonLib",
      "click #markTopLevelNonLib": "markTopLevelNonLib",
      "click #drawTomAsync": "drawTomAsync",
      "click #drawJoshAsync": "drawJoshAsync",
      "click #pruneGraph": "pruneGraph",
      "click #resetGraph": "resetGraph",
      "click #markAllBlue": "markAllBlue",
      "click #markAjaxRequest": "markAjaxRequest",
      "click #markAjaxResponse": "markAjaxResponse",
      "click #markClick": "markClick",
      "click #hideRepeats": "hideRepeats",
      "click #hideLibs": "hideLibs",
      "click #hideUnknownAspectNodes": "hideUnknownAspectNodes",
      "click #showLibCode": "showLibCode",
      "click #showRepeats": "showRepeats",
      "click #showUnknown": "showUnknown",
      "click #drawHeatMap": "drawHeatMap",
      "click #downloadInvokes": "downloadInvokes",
      "click #downloadNodes": "downloadNodes",
    },

    customColors: {},

    colors: {
      nativeNode: "#bce9fd",
      libNode: "#bdbdbd",
      edge: "#e6da74",
      nativeRootInvoke: "#48ff60",
      asyncEdge: "#fd9620",
      asyncSerialEdge: "#bc95ff",
      ajaxStart: "#fff",
      ajaxRequest: "#fff",
      ajaxResponse: "#dd7382",
      domQuery: "#bc95ff",
      jqDom: "#bc95ff",
      mouseEvent: "#fd9620",
      click: "#fd9620",
      wheel: "#fd9620",
      mousemove: "#fd9620",
      mousedown: "#fd9620",
      mouseup: "#fd9620",
      mouseout: "#fd9620",
      mouseleave: "#fd9620",
      mouseenter: "#fd9620",
      mouseover: "#fd9620",
      selected: "#fff07b",
      edgeSelected: "#f7f7f7",
    },

    aspectFilters: [],

    negatedAspectFilters: [],

    draw: function () {
      this.invokeGraph.calculate();
      this.resetGraph();
    },

    initialize: function (invokeGraph, activeNodeCollection) {
      this.invokeGraph = invokeGraph;
      this.activeNodeCollection = activeNodeCollection;
      this.setElement($("#graphView"));  // el should be in the dom at instantiation time

      this.$("#invokeGraph").height(parseInt(this.$el.height()) - parseInt(this.$("#graphControl").height()));

      this.filterByAspect = _.bind(this.filterByAspect, this);
      this.handleNodeClick = _.bind(this.handleNodeClick, this);
      this.handleEdgeClick = _.bind(this.handleEdgeClick, this);
      this.addCustomColor = _.bind(this.addCustomColor, this);
    },

    addCustomColor: function (aspect, color) {
      this.customColors[aspect] = color;
    },

    hideLibs: function () {
      this.showLibs = false;
      this.drawGraph();
    },

    hideRepeats: function () {
      this.showSequentialRepeats = false;
      this.drawGraph();
    },

    hideUnknownAspectNodes: function () {
      this.showUnknownAspects = false;
      this.drawGraph();
    },

    showLibCode: function () {
      this.showLibs = true;
      this.drawGraph();
    },

    showRepeats: function () {
      this.showSequentialRepeats = true;
      this.drawGraph();
    },

    showUnknown: function () {
      this.showUnknownAspects = true;
      this.drawGraph();
    },

    drawHeatMap: function () {
      _(this.visibleInvokes).each(function (invoke) {
        var heatColor = this.calcHeatColor(invoke.node.invokes.length, this.maxVisibleHitCount);

        this.cy.elements('node[id = "' + invoke.invocationId + '"]')
          .style({"background-color": heatColor});
      }, this);
    },

    resetGraph: function () {
      this.lastSelectedNodes = [];
      this.lastSelectedEdge = null;
      this.visibleInvokes = [];
      this.maxVisibleHitCount = 0;
      this.hideInvokeIdMap = {};
      this.showLibs = false;
      this.showSequentialRepeats = false;
      this.showUnknownAspects = false;
      this.drawGraph();
    },

    drawJoshAsync: function () {
      //console.log("Drawing async serial connections."); // ok this triggers the creation of purple arrows

      _(this.invokeGraph.asyncSerialEdges).each(function (edge, i, arr) {
        //console.log("drawJoshAsync - asyncSerialEdge: ", edge, "i: ", i, "arr: ", arr);
        //console.log("drawJoshAsync - parent: ", edge.parentInvoke.node.name, "child:", edge.childInvoke.node.name);

        if (this.hideInvokeIdMap[edge.parentInvoke.invocationId] ||
          this.hideInvokeIdMap[edge.childInvoke.invocationId]) {
          return;
        }

        var edgeElement = this.cy.elements('edge[source = "' + edge.parentInvoke.invocationId + '"][target="' + edge.childInvoke.invocationId + '"]');
        if (!edgeElement.length) {
          this.cy.add({
            group: 'edges', data: {
              source: edge.parentInvoke.invocationId,
              target: edge.childInvoke.invocationId,
              color: this.colors.asyncSerialEdge
            }
          });
        }
      }, this);
    },

    drawTomAsync: function () { // ok this triggers the creation of oranges arrows
      _(this.invokeGraph.asyncEdges).each(function (edge) {
        this.cy.remove('edge[source = "' + edge.parentInvoke.invocationId + '"][target="' + edge.childInvoke.invocationId + '"]');
        this.cy.add({
          group: 'edges', data: {
            source: edge.parentInvoke.invocationId,
            target: edge.childInvoke.invocationId,
            color: this.colors.asyncEdge
          }
        });
      }, this);
    },

    markAspectColor: function (aspectArr, color) {
      if (!aspectArr || !color) {
        console.warn("Tried to color invoke node without params.");
        return;
      }

      var allNodes = (aspectArr === "*");

      _(this.visibleInvokes).each(function (invoke) {
        var markAspect;
        if (allNodes) {
          markAspect = true;
        } else {
          markAspect = _(aspectArr).find(function (aspect) {
            return invoke.aspectMap[aspect];
          });
        }

        if (markAspect) {
          this.cy.elements('node[id = "' + invoke.invocationId + '"]')
            .style({"background-color": color});
        }
      }, this);
    },

    markAllBlue: function () {
      this.markAspectColor("*", this.colors.nativeNode);
    },

    markTopLevelNonLib: function () {
      _(this.invokeGraph.nativeRootInvokes).each(function (invoke) {
        this.cy.elements('node[id = "' + invoke.invocationId + '"]')
          .style({
            "background-color": this.colors.nativeRootInvoke
          });
      }, this);
    },

    markAjaxRequest: function () {
      this.markAspectColor(["ajaxRequest"], this.colors.ajaxRequest);
    },

    markAjaxResponse: function () {
      this.markAspectColor(["ajaxResponse"], this.colors.ajaxResponse);
    },

    markClick: function () {
      this.markAspectColor(this.invokeGraph.mouseEvents, this.colors.mouseEvent);
    },

    filterByAspect: function (aspectArr, negateAspectArr) {
      this.aspectFilters = aspectArr;
      this.negatedAspectFilters = negateAspectArr;

      this.drawGraph();
    },

    resetLastNodes: function () {
      if (!this.lastSelectedNodes.length) {
        return;
      }

      _(this.lastSelectedNodes).each(function (node) {
        this.cy.elements('node[id = "' + node.id + '"]')
          .style({
            "background-color": node.color,
            "border-color": "none",
            "border-width": "0"
          });
      }, this);

      this.lastSelectedNodes = [];

      if (this.lastSelectedEdge) {
        var edgeElement = this.cy.elements('edge[source = "' + this.lastSelectedEdge.sourceId + '"][target = "' + this.lastSelectedEdge.targetId + '"]');
        if (!edgeElement.length) {
          edgeElement = this.cy.elements('edge[target = "' + this.lastSelectedEdge.sourceId + '"][source = "' + this.lastSelectedEdge.targetId + '"]');
        }

        edgeElement.style({
          "line-color": this.lastSelectedEdge.color
        });
        this.lastSelectedEdge = null;
      }
    },

    handleNodeClick: function (nodeId, silent) {
      this.resetLastNodes();

      //console.log("Clicked invoke id:", nodeId);

      this.lastSelectedNodes = [{
        id: nodeId,
        color: this.cy.elements('node[id = "' + nodeId + '"]').style("background-color")
      }];

      this.cy.elements('node[id = "' + nodeId + '"]')
        .style({
          "background-color": this.colors.selected,
          "border-color": "white",
          "border-width": "3px"
        });

      if (!silent) {
        this.trigger("nodeClick", nodeId);
      }
    },

    handleEdgeClick: function (sourceId, targetId, silent) {
      this.resetLastNodes();

      _([sourceId, targetId]).each(function (nodeId) {
        this.lastSelectedNodes.push({
          id: nodeId,
          color: this.cy.elements('node[id = "' + nodeId + '"]').style("background-color")
        });

        this.cy.elements('node[id = "' + nodeId + '"]')
          .style({
            "background-color": this.colors.selected,
            "border-color": "white",
            "border-width": "3px"
          });
      }, this);

      var edgeElement = this.cy.elements('edge[source = "' + sourceId + '"][target = "' + targetId + '"]');
      if (!edgeElement.length) {
        edgeElement = this.cy.elements('edge[target = "' + sourceId + '"][source = "' + targetId + '"]');
      }

      this.lastSelectedEdge = {
        sourceId: sourceId,
        targetId: targetId,
        color: edgeElement.style("line-color")
      };
      edgeElement
        .style({
          "line-color": this.colors.edgeSelected,
        });

      if (!silent) {
        this.trigger("edgeClick", [sourceId, targetId]);
      }
    },

    getNodeColor: function (node) {
      var customColors = _(this.customColors).keys();

      if (customColors.length) {
        var colorKey = _(customColors).find(function (aspect) {
          return node.aspectMap[aspect];
        });

        if (colorKey) {
          return this.customColors[colorKey];
        }
      }

      if (node.isLib) {
        return this.colors.libNode;
      }

      if (node.nativeRootInvoke) {
        return this.colors.nativeRootInvoke;
      }

      var aspectArr = _(node.aspectMap).keys();
      var last = _(aspectArr).last();
      if (this.colors[last]) {
        return this.colors[last];
      }

      return this.colors.nativeNode;
    },

    calcHeatColor: function (val, max) {
      var heatNum = val / max;

      var r = parseInt(heatNum * 255);
      var b = 255 - r;

      return "#" + ((1 << 24) + (r << 16) + (0 << 8) + b).toString(16).slice(1);
    },

    updateLabel: function (invokeId) {
      this.cy.elements('node[id = "' + invokeId + '"]')
        .data("label", this.invokeGraph.invokeIdMap[invokeId].getLabel());
    },

    childrenHaveAsyncChild: function childrenHaveAsyncChild(invoke) {
      if (invoke.childAsyncSerialLinks && invoke.childAsyncSerialLinks.length > 0)
        return true;
      if (invoke.childCalls) {
        for (var i = 0; i < invoke.childCalls.length; i++) {
          var child_invoke = invoke.childCalls[i];
          if (childrenHaveAsyncChild(child_invoke))
            return true;
        }
      }
      return false;
    },

    drawGraph: function () {
      //console.log("Emptying old graph.")
      this.$("#invokeGraph").empty();

      this.hideInvokeIdMap = {};

      this.maxVisibleHitCount = 0;
      var n_nodes_shown = 0;
      var nodes = _(this.invokeGraph.invokes).reduce(function (displayNodes, invoke) {
        //console.log("CGV node:", invoke.node);
        //console.log("CGV node name:", invoke.node.name);
        //console.log("CGV node source:", invoke.node.source);

        if (!this.showLibs && invoke.isLib) {
          //console.log("it is considered a lib");
          this.hideInvokeIdMap[invoke.invocationId] = true;
          return displayNodes;
        }

        if (!this.showUnknownAspects && _(invoke.aspectMap).keys().length < 1) {
          //console.log("it is considered an unknown aspect");
          //console.log("invoke:", invoke);
          //console.log("invoke.aspectMap: ", invoke.aspectMap);
          //console.log("_(invoke.aspectMap): ", _(invoke.aspectMap));
          //console.log("_(invoke.aspectMap).keys()", _(invoke.aspectMap).keys());
          this.hideInvokeIdMap[invoke.invocationId] = true;
          return displayNodes;
        }

        if (!this.showSequentialRepeats && invoke.isSequentialRepeat) {
          //console.log("it is considered a sequential repeat");
          this.hideInvokeIdMap[invoke.invocationId] = true;
          return displayNodes;
        }

        if (this.aspectFilters.length) {
          //console.log("need to check some aspectFilters");
          var found = _(this.aspectFilters).find(function (aspect) {
            return invoke.aspectMap[aspect]
          });

          if (!found) {
            this.hideInvokeIdMap[invoke.invocationId] = true;
            return displayNodes;
          }
        }

        if (this.negatedAspectFilters.length) {
          //console.log("need to check negatedAspectFilters");
          var negateFound = _(this.negatedAspectFilters).find(function (aspect) {
            return invoke.aspectMap[aspect]
          });

          if (negateFound) {
            this.hideInvokeIdMap[invoke.invocationId] = true;
            return displayNodes;
          }
        }

        //console.log("considering invoke: ", invoke.getLabel());
        //console.log("invoke.nativeRootInvoke: ", invoke.nativeRootInvoke);
        //console.log("invoke.childAsyncSerialLinks: ", invoke.childAsyncSerialLinks);
        //console.log("invoke: ", invoke);
        if (!invoke.nativeRootInvoke){
          // only show nodes that are top level calls
          if (!invoke.childAsyncSerialLinks || invoke.childAsyncSerialLinks.length < 1) { 
            // or they have async children
            //console.log("childrenHaveAsyncChild(invoke):", this.childrenHaveAsyncChild(invoke));
            if (!this.childrenHaveAsyncChild(invoke)) {
              // or they have descendents that have async children
              
              // COMMMENT FOLLOWING LINES TO TEMPORARILY DEBUG:
              this.hideInvokeIdMap[invoke.invocationId] = true;
              return displayNodes;
            }
          }
        }

        /*if (invoke.topLevelInvocationId != invoke.invocationId) {
          return displayNodes;
        }*/ // true way of getting top level nodes only, but excludes those with async children

        if (this.hideInvokeIdMap[invoke.invocationId]) {
          //console.log("it is explicitly in the hideInvokeIdMap");
          return displayNodes;
        }

        var label = invoke.getLabel();
        
        if (invoke.nativeRootInvoke) { // considering only top level calls
          var events_to_parse_out = ["load", "resize", "scroll", "unload", "change", "copy", "focus", "keydown, keypress, keyup", "paste", "reset", "select", "submit", "copy, cut, paste", "keydown", "keypress", "keyup", "click", "contextmenu", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "right click", "scrolling"]
          for (i = 0; i < events_to_parse_out.length; i++) {
            ev = events_to_parse_out[i];
            if (label.includes("[" + ev)) {
              // deal with xN
              var fn = label.search(/]/i)
              var xn = label.search(/\s×\s[0-9]/i)
              var fn_text = label.substr(fn+1, xn-(fn+1)).trim()
              var xn_text = label.substr(xn)
              label = "[" + ev + " callback] " + fn_text + xn_text; // *
              break;
            }
          }
        }

        console.log("label:", label, "invoke.childAsyncSerialLinks: ", invoke.childAsyncSerialLinks);
        if (invoke.childAsyncSerialLinks){
          var label_has_been_set = false;
          for (var aci = 0; aci < invoke.childAsyncSerialLinks.length; aci++){
            async_child = invoke.childAsyncSerialLinks[aci];
            console.log("async_child:", async_child);
            var events_to_parse_out = ["load", "resize", "scroll", "unload", "change", "copy", "focus", "keydown, keypress, keyup", "paste", "reset", "select", "submit", "copy, cut, paste", "keydown", "keypress", "keyup", "click", "contextmenu", "dblclick", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "right click", "scrolling"]
            for (i = 0; i < events_to_parse_out.length; i++) {
              ev = events_to_parse_out[i];
              if (async_child.getLabel().includes("[" + ev)) {
                // deal with xN
                var fn = label.search(/]/i)
                var xn = label.search(/\s×\s[0-9]/i)
                var fn_text = label.substr(fn+1, xn-(fn+1)).trim()
                var xn_text = label.substr(xn)

                console.log("invoke.node.source:", invoke.node.source);
                if (invoke.node.source.includes(".off(") || invoke.node.source.includes(".unbind(")) {
                  label = "[" + ev + " unbinding] " + fn_text + xn_text; // *
                  console.log("label:", label);
                  label_has_been_set = true;
                }
                else {
                  label = "[" + ev + " binding] " + fn_text + xn_text; // *
                  console.log("label:", label);
                  label_has_been_set = true; 
                }

                //if (label.includes("mousemove")) 
                //  console.log("mousemove invoke: ", invoke);
                break;
              }
            }
            if (label_has_been_set) break;
          }
        }
        
        //console.log("node to be drawn:", invoke);
        var node = {
          data: {
            id: invoke.invocationId,
            label: label,
            color: this.getNodeColor(invoke) // "#d13r23"
          }
        };
        //console.log(n_nodes_shown, "node getting shown: ", invoke.getLabel()); 
        n_nodes_shown++;

        //console.log("node:", label);

        this.visibleInvokes.push(invoke);
        if (invoke.node.invokes.length > this.maxVisibleHitCount) {
          this.maxVisibleHitCount = invoke.node.invokes.length;
        }

        displayNodes.push(node);

        return displayNodes;
      }, [], this);

      //console.log("Filtered to node count", nodes.length, "of", this.invokeGraph.invokes.length);

      var edges = _(this.invokeGraph.edges).reduce(function (displayEdges, edge) {
        if (this.hideInvokeIdMap[edge.parentInvoke.invocationId] ||
          this.hideInvokeIdMap[edge.childInvoke.invocationId]) {
          return displayEdges;
        }
        //console.log("drawGraph - edge: ", edge)
        //console.log("drawGraph - parent: ", edge.parentInvoke.node.name, "child:", edge.childInvoke.node.name);

        displayEdges.push({
          data: {
            source: edge.parentInvoke.invocationId,
            target: edge.childInvoke.invocationId,
            color: this.colors.edge
          }
        });

        return displayEdges;
      }, [], this);

      //console.log("Filtered to edge count", edges.length, "of", this.invokeGraph.edges.length);
      //console.log("Drawing graph...");

      this.cy = cytoscape({
        container: this.$("#invokeGraph")[0],
        boxSelectionEnabled: false,
        autounselectify: true,
        layout: {
          name: 'dagre',
          avoidOverlap: true,
          pan: 'fix',
          fit: true,
          padding: 20,
          minLen: function (edge) {
            return 2;
          }
        },
        style: [
          {
            selector: 'node',
            style: {
              'min-zoomed-font-size': 6,
              // 'font-family': 'system, "helvetica neue"',
              // 'font-size': 14,
              // 'font-weight': 400,
              'shape': 'roundrectangle',
              // 'overlay-color': "white",
              // 'overlay-padding': 1,
              'width': 'label',
              'height': 'label',
              'padding': 8,
              'content': 'data(label)',
              // 'text-opacity': 1,
              'text-valign': 'center',
              // 'text-halign': 'center',
              // 'color': "black",
              'background-color': 'data(color)'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'target-arrow-shape': 'triangle',
              'line-color': 'data(color)',
              'target-arrow-color': 'data(color)',
              'curve-style': 'bezier'
            }
          }
        ],
        elements: {
          nodes: nodes,
          edges: edges
        },
      });
      //console.log("cy:", this.cy);
      //console.log("cy.nodes:", this.cy.nodes());
      // get all the nodes and stagger them
      // Returns a random number between min (inclusive) and max (exclusive)
      function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      } // thanks to http://man.hubwiz.com/docset/JavaScript.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random.html

      this.cy.nodes().forEach(function(ele){
        //console.log("in cy nodes each: ", ele);
        //console.log("in cy nodes each node pos: ", ele.position());
        ele_pos = ele.position();
        ele_pos.y += getRandomArbitrary(-50, 50);
        ele.position(ele_pos);
      })

      var callGraphView = this;

      this.cy.on('click', 'node', function () {
        callGraphView.handleNodeClick(this.id());
      });

      this.cy.on('click', 'edge', function () {
        callGraphView.handleEdgeClick(this.data("source"), this.data("target"));
      });

      //console.log("Graph initial draw done.");

      // this.drawJoshAsync();

      //console.log("DrawGraph completed.");
    },

    downloadInvokes: function () {
      this.downloadStr(JSON.stringify(this.invokeGraph.rawInvokes, null, 2), "invokeSample.txt");
    },

    downloadNodes: function () {
      this.downloadStr(JSON.stringify(this.activeNodeCollection.rawNodes, null, 2), "nodeSample.txt");
    },

    downloadStr: function (str, fileName) {
      var textFileAsBlob = new Blob([str], {type: 'text/plain'});

      var downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.innerHTML = "Download File";
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      downloadLink.click();
    }
  });
});