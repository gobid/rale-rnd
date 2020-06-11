/**
 * Highlights all given terms/keywords like google does in its cache.
 * Herefore Highlighter parses the dom and everytime a keyword is found it gets highlighted.
 * 
 * Example usage:
 * <code>
 *  var hi = new Highlighter();
 *  hi.highlight("Hello World"); // highlights the text "Hello World"
 * 
 *  var hi2 = new Highlighter({'class_names':false}); //doen't add css classes now
 *  hi.highlight(["word1", "word2"]); // highlights word1 and word2
 * 
 *  // You can use Highlighter with SearchKeywords like this:
 *  var hi = new Highlighter();
 *  hi.highlight((new SearchKeywords()).get());
 * </code>
 *
 * There are a bunch of options to customize the behaviour of Highlighter. Take a look at DEFAULT_OPTIONS
 */
var Highlighter = Class.create({
    /**
     * @access public
     * @param object/hash options
     * @return Highlighter
     */
    initialize: function (options) {
        this.counter = 0;
        this.options = Object.extend(Highlighter.DEFAULT_OPTIONS, options || {});
    },
    /**
     * Takes a string or an array of strings and highlihgts them.
     * @access public
     * @param mixed terms - String or array of strings
     * @return void
     */
    highlight: function (terms) {
        if (typeof terms == "string") {
            terms = [terms];
        }

        var infoHashes = [];
        var styleHashes = [];
        terms.each(function (term) {
            if (this.options.styles) {
                var styles = this.options.styles[this.counter % this.options.styles.length];
            } else {
                var styles = {};
            }
            if (this.options.class_names) {
                var class_name = this.options.class_names[this.counter % this.options.class_names.length];
            } else {
                var class_name = "";
            }
            var hash = {
                'hiclass': class_name,
                'styles': styles
            };
            var infoHash = {'term': term, 'terms': []};

            styleHashes.push(hash);

            // is our term included in one of the other, longer terms?
            terms.each(function (term2) {
                if (term2.include(term) && term != term2) {
                    infoHash.terms.push(term2);
                }
            });
            infoHashes.push(infoHash);
            this.counter++;
        }, this);

        // iterate over all terms and highlight tehm
        var notFound = 0;
        var i = 0;
        var element = document.getElementById('resourcelist');
        infoHashes.each(function (termInfo) {
            this.found = false;
            try {
                //this._highlight(termInfo, document.body, styleHashes[i - notFound]);
                this._highlight(termInfo, element, styleHashes[i - notFound]);

            } catch (e) {}

            // term not found
            if (!this.found) {
                notFound++;
            }
            i++;
        }, this);
    },
    /**
     * @access private
     * @param object/Hash termInfo hash with the keyword and some other infos 
     * @param HtmlElement container
     * @param object/Hash hash
     * @return void
     */
    _highlight: function (termInfo, container, hash) {
        var term = termInfo.term;
        //container = $('resourcelist');
        var term_low = term.toLowerCase();
        if (this.options.case_sensitive) {
            term_low = term;
        }
		//console.log(container.childNodes.length);
        for (var i=0; i<container.childNodes.length; i++) {
            var node = container.childNodes[i];
            if (node.nodeType == 3) {
                // Element is a text-node
                var data = node.data;
                var data_low = data.toLowerCase();
                if (this.options.case_sensitive) {
                    data_low = data;
                }
				if (data_low.include(term_low)) {
                    // it the term is embedded in a longer term - don't highlight it now
                    var locked = false;
                    termInfo.terms.each(function (t) {
                        if (data_low.include(t.toLowerCase())) {
                            locked = true;
                        }
                    });
                    if (!locked) {
                        this.found = true;
                        var new_node = new Element(this.options.element);
                        node.parentNode.replaceChild(new_node, node);
                        var result;
						//to replace first \s by &nbsp;
                        var spacepattern = /^\s+(.*)$/;
						
						while ((result = data_low.indexOf(term_low)) != -1) {
							new_node.insert(data.substr(0, result));
                            var highlighted_node = new Element(this.options.element);
                            highlighted_node.setStyle(hash.styles);
                            highlighted_node.addClassName(hash.hiclass);
                            highlighted_node.insert(data.substr(result,term.length));
                            highlighted_node.addClassName(this.options.class_name);
                            new_node.insert(highlighted_node);
                            data = data.substr(result + term.length);
							//inside loop - do the replacement
							data = data.replace(spacepattern,"&nbsp;$1");
							data_low = data.toLowerCase();
                        }
                        
                        data = data.replace(spacepattern,"&nbsp;$1");
                        new_node.insert(data);
                    }
                }
            } else {
                if (!this.options.element_blacklist.include(node.nodeName.toLowerCase())) {
                    if (!$(node) || !$(node).hasClassName(this.options.class_name)) {
                        this._highlight(termInfo, node, hash);
                    }
                }
            }
        }
    }
});
Highlighter.DEFAULT_OPTIONS = {
    /**
     * These styles will be used for the highlighting By default these are the "google colors"
     * You can set this option to false if you want to use the css class name based highlighting.
     *
    styles: [{'backgroundColor': '#FFFF66', 'color': '#000'},{'backgroundColor': '#A0FFFF', 'color': '#000'}, {'backgroundColor': '#99FF99', 'color': '#000'}, {'backgroundColor': '#FF9999', 'color': '#000'}, {'backgroundColor': '#FF66FF', 'color': '#000'}], */
    styles: [{'backgroundColor': '#BBBBBB', 'color': '#000'}],
    /**
     * Array of classnames that are added to the found keywords.
     */
    class_names: ["highlighted_keyword_1", "highlighted_keyword_2", "highlighted_keyword_3"],
    /**
     * This class is added to each found keyword
     */
    class_name: "highlighted_keyword",
    /**
     * Blacklist of HTML elements that shouldn't get parsed.
     */
    element_blacklist: ["select", "script", "title", "link", "input", "style"],
    /**
     * All found keyword will be inserted in an html element. By default this is <spanhack>.
     * I know, that's not a standard element. But this is used to not accidently break a layout
     * beacause "span" or "div" already have weird css definitions...
     */
    element: 'span',
    /**
    * Should the search be case senstive? By default "hello" and "Hello" are considered the same.
    */
    case_sensitive: false
};


function highlight(sword) {
    $$('.infoline', '.description', '.keywords').map(Element.extend).first().descendants().each(function (el) {
        if (el.nodeType == Node.ELEMENT_NODE && el.tagName != 'TEXTAREA' && el.tagName != 'INPUT' && el.tagName != 'SCRIPT') {
            $A(el.childNodes).each(function (onlyChild) {
                var pos = onlyChild.textContent.indexOf(sword);
                if (onlyChild.nodeType == Node.TEXT_NODE && pos >= 0) {
                    //console.log(onlyChild);
                    var spannode = document.createElement('span');
                    spannode.className = 'highlight';
                    var middlebit = onlyChild.splitText(pos);
                    var endbit = middlebit.splitText(sword.length);
                    var middleclone = middlebit.cloneNode(true);
                    spannode.appendChild(middleclone);
                    middlebit.parentNode.replaceChild(spannode, middlebit);

                    //onlyChild. = el.innerHTML.replace(new RegExp('('+sword+')', 'gi'), '<span class="highlight">$1</span>');
                }
            });
        }
    });
}

