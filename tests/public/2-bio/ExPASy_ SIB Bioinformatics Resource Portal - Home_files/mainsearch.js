/**
 * This script takes care of the main search engine.
 *
 * @author: Manohar Jonnalagedda
 *
 * $Id$
 */

/**
 * http://blog.stevenlevithan.com/archives/multi-replace
 * Replace different strings with other strings
 */
String.prototype.multiReplace = function ( hash ) {
	var str = this, key;
	for ( key in hash ) {
		str = str.replace( new RegExp( key, 'g' ), hash[ key ] );
	}
	return str;
};

Event.observe(window, 'load', function() {
	if($('Querytext')){
		$('Querytext').setValue(
			$('Querytext').getValue().multiReplace({
				'--' : '/',
				'_plus_' : '+'
			})
		);
		$('Querytext').focus();
	}
	
	if($('fullsearchSearchtype')){

		var select_box = $("fullsearchSearchtype");
		switch(select_box.getValue()){
			case "cross": autocompleter.disable(); break;
			case "res": autocompleter.enable(); break;
			default: break;
		}

		select_box.observe('change', function(event){
			// We stop the default link behaviour
			Event.stop(event);

			switch(select_box.options[select_box.selectedIndex].value){
				case "cross": autocompleter.disable(); break;
				case "res": autocompleter.enable(); break;
				default: break;
			}

		}, false);
	}
});
