__tracer.traceFunCall({ 
  this: (__tracer.traceFunCall({ 
    func: ($), 
    nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-129-2-129-13"
  }))(document), 
  property: "on", 
  nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-129-2-140-4" 
})
(
  "mousedown" == e.type ? "mousemove" : "touchmove", 
  (__tracer.traceFunCreate(function (e) { 
    try {{
      __tracer.traceEnter({
        nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-function-129-68-140-3",
        arguments: __tracer.Array.prototype.slice.apply(arguments),this: this
      });
      {
        "iso_c53f49a9-2a42-4dcc-89ef-e8200a898428_iso";
        if (scroll_delta) {
          var pos = (__tracer.traceFunCall({ 
            func: (eventPos), 
            nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-133-14-133-25"
          }))(e);
          position[0] =  __tracer.traceFunCall({ 
            this: Math, 
            property: "round", 
            nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-134-18-135-49" 
          })
          (
            (
              __tracer.traceFunCall({ 
                func: (clamp), 
                nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-134-29-135-48"
              })
            )
            (
              pos.pageX + scroll_delta[0], 
              -(size[1] + size[3]) * tilesize + container_size[0], 0
            )
          );
          position[1] =  __tracer.traceFunCall({ 
            this: Math, 
            property: "round", 
            nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-136-18-137-49" 
          })
          (
            (
              __tracer.traceFunCall({ 
                func: (clamp), 
                nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-136-29-137-48"
              })
            )
            (
              pos.pageY + scroll_delta[1], 
              -(size[0] + size[2]) * tilesize + container_size[1], 
              0
            )
          );
          (
            __tracer.traceFunCall({ 
              func: (update), 
              nodeId: "http://localhost:3004/1-xkcd/xkcd_files/d28668.js-callsite-138-4-138-12"
            })
          )();
        }
      }
    }} catch (__e) {
      __tracer.traceExceptionThrown({
        "nodeId":"http://localhost:3004/1-xkcd/xkcd_files/d28668.js-function-129-68-140-3"
      }, __e);
      throw __e;
    } finally {
      __tracer.traceExit({
        "nodeId":"http://localhost:3004/1-xkcd/xkcd_files/d28668.js-function-129-68-140-3"
      });
    } 
  }, 
  "function (\n   e) {\n   \"iso_c53f49a9-2a42-4dcc-89ef-e8200a898428_iso\";\n   if (scroll_delta) {\n    var pos = eventPos(e);\n    position[0] = Math.round(clamp(pos.pageX + scroll_delta[0], -(size[1] +\n     size[3]) * tilesize + container_size[0], 0));\n    position[1] = Math.round(clamp(pos.pageY + scroll_delta[1], -(size[0] +\n     size[2]) * tilesize + container_size[1], 0));\n    update();\n   }\n  }"
  ))
);
