/*
- the fondue injector controls fondue
- chrome extension in browser -> fondue injector -> 
- "window.dispatchEvent(new CustomEvent("fondueDTO", {" -> sends invocations -> fondueDTO 
- another part watching (the fondue server)

*/

define([], function () {
    return function () {
      var FondueBridge = function () {
        console.log("unravelAgent: ", unravelAgent);
        this.updateTrackedNodes = unravelAgent._.bind(this.updateTrackedNodes, this);
        this.startTracking = unravelAgent._.bind(this.startTracking, this);
        this.getNodes = unravelAgent._.bind(this.getNodes, this);
        this.resetTracer = unravelAgent._.bind(this.resetTracer, this);
        this.startTrackInterval = unravelAgent._.bind(this.startTrackInterval, this);
        this.totalInvocations = 0;
      };

      // FondueBridge.MAX_LOG_COUNT = 3000;
      // FondueBridge.MAX_STACK_DEPTH = 20;
      // FondueBridge.EMIT_INTERVAL_MILLIS = 3000;


      FondueBridge.MAX_LOG_COUNT = 2000;
      FondueBridge.BUFFER_INTERVAL_MILLIS = 1000;

      FondueBridge.EMIT_INTERVAL_MILLIS = 2000;
      FondueBridge.EMIT_INVOKE_COUNT = 2000;
      FondueBridge.EMIT_NODE_MILLIS = 3000;

      FondueBridge.prototype = {
        constructor: FondueBridge,

        emitBuffer: [],

        nodeById: {},

        getTracerNodeList: function(){
          return __tracer.getNodeList();
        },

        getNodes: function () {
          var nodeList = __tracer.getNodeList();
          var newNodes = [];

          unravelAgent._(nodeList).map(function (node) {
            if (!this.nodeById[node.id]) {
              this.nodeById[node.id] = node;
              newNodes.push(node);
            }
          }, this);

          return newNodes;
        },

        startTracking: function () {
          console.log("FondueInjector: startTracking()");
          this.startTrackInterval();
        },

        resetTracer: function () {
          // window.__tracer.resetTrace();
          // this.logHandles.push(window.__tracer.trackLogs({ids: this.ids}));
        },

        updateTrackedNodes: function () {
          // this.ids = unravelAgent._(__tracer.getNodeMap()).keys();
          // this.logHandles.push(window.__tracer.trackLogs({ids: this.ids}));
        },

        startTrackInterval: function () {
          // this.updateTrackedNodes();
          // if (!this.ids || this.ids.length < 1) {
          //   console.log("fondueInjector: startTrackInterval: no nodes yet.");
          //   setTimeout(unravelAgent._.bind(function () {
          //     this.startTrackInterval();
          // }, this), FondueBridge.EMIT_INTERVAL_MILLIS);
          // return;
          // }

          console.log("fondueInjector: startTrackInterval: Got nodes... emitting");
          // this.logHandle = window.__tracer.trackLogs({ids: this.ids});
          if (this.interval) {
            window.clearInterval(this.interval);
            window.clearInterval(this.interval2);
            window.clearInterval(this.interval3);
          }

          this.interval = setInterval(unravelAgent._.bind(function () {
            this.transferInvokesToEmitBuffer();
          }, this), FondueBridge.BUFFER_INTERVAL_MILLIS);

          this.interval2 = setInterval(unravelAgent._.bind(function () {
            this.emitNodeActivity();
          }, this), FondueBridge.EMIT_INTERVAL_MILLIS);

          this.interval3 = setInterval(unravelAgent._.bind(function () {
            this.emitNodeList();
          }, this), FondueBridge.EMIT_NODE_MILLIS);
        },

        emitNodeList: function () {
          var nodeArr = this.getNodes();

          unravelAgent._(nodeArr).each(function (node) {
            node.startLine = node.start.line;
            node.startColumn = node.start.column;
            node.endLine = node.end.line;
            node.endColumn = node.end.column;
            node.invokes = [];
          });
          console.log("about to send nodeArr:", nodeArr);

          window.dispatchEvent(new CustomEvent("fondueDTO", {
            detail: {
              eventStr: "fondueDTO:newNodeList",
              obj: {nodes: nodeArr}
            }
          }));
        },

        //keep in sync with activeNodeModel
        _domFnNames: unravelAgent._([
          "getElementsByTagName",
          "getElementsByTagNameNS",
          "getElementsByClassName",
          "getElementsByName",
          "getElementById",
          "querySelector",
          //"createElement",
          "querySelectorAll"
        ]),

        isDomQueryNode: function (node) {
          if (!node.name) {
            return false;
          }

          return !!this._domFnNames.find(function (fnName) {
            if (node.name.indexOf(fnName) > -1) {
              node.domQuery = true;
              return true;
            }
          });
        },

        emitScreenCapture: function () {
          unravelAgent.html2canvas(document.body).then(function (canvas) {
            window.dispatchEvent(new CustomEvent("fondueDTO", {
                detail: {
                  eventStr: "fondueDTO:screenCapture",
                  obj: {dataURL: canvas.toDataURL('image/jpeg', 1.0)}
                }
              })
            );
          });
        },

        transferInvokesToEmitBuffer: function () {
          try {
            //debugger;
            //Get the last n javascript calls logged
            var logEntryArr = __tracer.getLogEntryArr();
            console.log("Buffer length", this.emitBuffer.length, "of", logEntryArr[0].entries.length);
            var invokes = __tracer.logDelta(0, FondueBridge.MAX_LOG_COUNT);
            unravelAgent._(invokes).each(function(invoke){
              //console.log(invoke);
              //if (invoke.this) console.log(invoke.this.preview);
              //if (invokes.returnValue && invoke.returnValue.type == "function") 
              //  console.log("FUNCTION: ", invoke.returnValue.json);
              this.emitBuffer.push(invoke);
            }, this);
          } catch (err) {
            //debugger;
            if(~err.toString().indexOf("SecurityError")){
              console.warn("Ignoring invocation logDelta err.");
            }
          }
        },

        emitNodeActivity: function () {
          // debugger; Ok here is where it gets emitted
          var invocations = this.emitBuffer.splice(0, FondueBridge.EMIT_INVOKE_COUNT);
          console.log("emitNodeActivity:", invocations.length, "invocations", invocations);
          for (var i = 0; i < invocations.length; i++){
            var curr_invoke = invocations[i];
            if (curr_invoke.arguments) {
              for (var j = 0; j < curr_invoke.arguments.length; j++){
                if (curr_invoke.arguments[j].value.type == "function" &&
                  curr_invoke.arguments[j].value.json == "function(){return a.apply(c,b||arguments);}") {
                  console.log("curr_invoke:", curr_invoke);
                  console.log("- found a function argument for this function: ", curr_invoke.arguments[j]);
                }
              }
            }
          }

          window.dispatchEvent(new CustomEvent("fondueDTO", {
              detail: {
                eventStr: "fondueDTO:arrInvocations",
                obj: {invocations: invocations}
              }
            })
          );
        }
      };

      window.unravelAgent.fondueBridge = new FondueBridge();
    }
  }
);