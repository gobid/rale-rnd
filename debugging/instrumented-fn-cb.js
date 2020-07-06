if (!this.paused) {

// START

	var b = (__tracer.traceFunCall({ 
		func: (setTimeout), 
		nodeId: "https://www.mapstd.com/js/mapstd-1.2.0.js-callsite-2061-11-2065-37"
	}))
	( __tracer.traceFunCall({ 
		this: (__tracer.traceFunCreate(function () { 
			try {	{
					__tracer.traceEnter({
						nodeId: "https://www.mapstd.com/js/mapstd-1.2.0.js-function-2061-22-2065-4",
						arguments: __tracer.Array.prototype.slice.apply(arguments),
						this: this
					});
					{
						"iso_cfe1f258-9aa7-4942-ab66-123f28f1081e_iso";
						__tracer.traceFunCall({ 
							this: this.timers, 
							property: "erase", 
							nodeId: "https://www.mapstd.com/js/mapstd-1.2.0.js-callsite-2063-4-2063-24" 
						})(e);
						__tracer.traceFunCall({ 
							this: e, 
							property: "callback", 
							nodeId: "https://www.mapstd.com/js/mapstd-1.2.0.js-callsite-2064-4-2064-24" 
						})(e.params);
					}
			}	} catch (__e) {
				__tracer.traceExceptionThrown({
					"nodeId":"https://www.mapstd.com/js/mapstd-1.2.0.js-function-2061-22-2065-4"
				}, __e);
				throw __e;
			} finally {
				__tracer.traceExit({
					"nodeId":"https://www.mapstd.com/js/mapstd-1.2.0.js-function-2061-22-2065-4"
				});
			} 
		}, 
		"function () {\n    \"iso_cfe1f258-9aa7-4942-ab66-123f28f1081e_iso\";\n    this.timers.erase(e);\n    e.callback(e.params);\n   }"
		)), 
		property: "bind", 
		nodeId: "https://www.mapstd.com/js/mapstd-1.2.0.js-callsite-2061-22-2065-15" 
	} ) (this), 
	c / this.multiplier);

// END 

	e.timer = b;
}