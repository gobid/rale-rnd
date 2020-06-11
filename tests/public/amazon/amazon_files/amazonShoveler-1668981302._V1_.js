amznJQ.available("jQuery", function() {
    var $ = jQuery;
    var defaultOptions = {
        cellTransformer: function(input) {
            return input;
        },
        ajaxResultTransformer: function(input) {
            return input;
        },
        cellChangeSpeedInMs: 50,
        ajaxTimeout: 3000,
        onPageChangeCompleteHandler: undefined,
        onUpdateUIHandler: undefined,
        paginationSelector: ".shoveler-pagination",
        rootUlSelector: "ul:first",
        prevButtonSelector: "div.prev-button",
        nextButtonSelector: "div.next-button",
        startOverSelector: "span.start-over",
        startOverLinkSelector: null,
        circular: true,
        rows: 1,
        preloadNextPage: false,
        horizPadding: 0,
        suppressPaginationOnLoad: false,
        maxCellsPerPage: 0,
        buttonFallbackCallback: undefined,
        state: undefined
    };
    $.fn.shoveler = function(generator, numCellsTotal, options) {
        if (this.size() !== 1) {
            throw "must only init one shoveler at a time but you are trying to init " + this.size();
        }
        return new Shoveler(this, generator, numCellsTotal, options);
    };
    var Shoveler = function(domElement, generator, numCellsTotal, options) {
        if (this === window) {
            throw new Error("Shoveler must be called with 'new'");
        }
        if (!domElement || typeof domElement !== "object") {
            throw new Error("Must give a domElement object param to Shoveler");
        }
        this.root = $(domElement);
        if (!generator || typeof generator !== "function") {
            throw new Error("Must give a function generator param to Shoveler");
        }
        $.extend(this, defaultOptions, options || {});
        this.rootUl = $(this.rootUlSelector, this.root);
        this.allCells = [];
        this.numCellsPerPage = 0;
        this.updateCellStats();
        if (this.rootUl.size() !== 1) {
            throw new Error("Shovler must be initialized with an element with a single UL descendant");
        }
        this.pagination = $(this.paginationSelector, (this.paginationSelector.charAt(0) == "#") ? document : this.root);
        if (!this.pagination.size()) {
            throw new Error("Shoveler div must have a '" + this.paginationSelector + "'");
        }
        this.generator = function() {
            var ret = generator.apply(this, arguments);
            if (!ret && typeof ret !== "string" && !(ret instanceof Array) && ret !== true) {
                throw new Error("Generator should return string or array, but instead returned: " + ret.toString());
            }
            return ret;
        };
        this.numCellsTotal = numCellsTotal;
        this.currentCell = 0;
        this.allCells.addClass("shoveler-cell");
        this.cache = [];
        this.cacheImagesLoaded = [];
        for (var i = 0; i < this.allCells.length; i++) {
            this.cache[i] = this.allCells.eq(i)
                .children();
            this.cacheImagesLoaded[i] = true;
        }
        for (i = this.allCells.length; i < this.numCellsTotal; i++) {
            this.cache[i] = i;
            this.cacheImagesLoaded[i] = false;
        }
        if (this.pagination.find(".page-number, .num-pages")
            .size() < 2) {
            this.pagination.prepend($("<span>Page " + '<span class="page-number">???</span> of ' + '<span class="num-pages">???</span> ' + '<span class="start-over"> (<a href="">Start Over</a>) </span></span>'));
        }
        var self = this;
        var startOverElem = this.startOver = $(this.startOverSelector, this.root);
        if (this.startOverLinkSelector) {
            startOverElem = startOverElem.find(this.startOverLinkSelector);
        }
        startOverElem.click(function() {
            self.gotoFirstPage(true);
            return false;
        });
        this.prevButton = $(this.prevButtonSelector, this.root)
            .click(function() {
                if (self.suppressPaginationOnLoad) {
                    self.pagination.show();
                    self.suppressPaginationOnLoad = false;
                }
                if (!self.isFirstPage()) {
                    self.gotoPage(Math.ceil(self.getCurrentPage() - 1), false, true);
                } else {
                    if (self.circular) {
                        self.gotoPage(self.getNumPages() - 1, true, true);
                    } else {
                        if (self.buttonFallbackCallback) {
                            self.buttonFallbackCallback("prev");
                        }
                    }
                }
                return false;
            });
        this.nextButton = $(this.nextButtonSelector, this.root)
            .click(function() {
                if (self.suppressPaginationOnLoad) {
                    self.pagination.show();
                    self.suppressPaginationOnLoad = false;
                }
                if (!self.isLastPage()) {
                    self.gotoPage(Math.floor(self.getCurrentPage() + 1), false, true);
                } else {
                    if (self.circular) {
                        self.gotoPage(0, true, true);
                    } else {
                        if (self.buttonFallbackCallback) {
                            self.buttonFallbackCallback("next");
                        }
                    }
                }
                return false;
            });
        this.pageButtons = $(this.prevButton)
            .add(this.nextButton)
            .mousedown(function() {
                $(this)
                    .addClass("depressed");
            })
            .mouseup(function() {
                $(this)
                    .removeClass("depressed");
            });
        if (this.state) {
            var restored = false;

            function restorePage() {
                if (restored) {
                    return;
                }
                if (self.state.ready()) {
                    restored = true;
                    cell = self.state.get();
                    if (!isNaN(cell) && cell != self.currentCell) {
                        self.setCurrentCell(cell);
                        self.updateStats();
                        self.switchVisibleCells(1, false);
                    }
                }
            }
            var shovelerTop = this.root.offset()
                .top;
            var windowHeight = document.body.clientHeight;
            var scrollTop = document.body.scrollTop;
            if (shovelerTop < scrollTop + windowHeight && shovelerTop > scrollTop) {
                restorePage();
            }
            $(window)
                .load(function() {
                    restorePage();
                });
        }
        $(window)
            .resize(function() {
                self.updateUI(false, false);
            })
            .unload(function() {
                for (var i = 0; i < self; i++) {
                    if (self.cache[i].jquery) {
                        $("*", self.cache[i])
                            .add(self.cache[i])
                            .unbind();
                    }
                }
            });
        this.updateUI(false, true);
    };

    function internalRemove(elements) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].parentNode) {
                elements[i].parentNode.removeChild(elements[i]);
            }
        }
        return elements;
    }
    $.extend(Shoveler.prototype, {
        updateUI: function(triggerOnPageChangeComplete, suppressUpdate) {
            this.adjustNumLisInDom();
            this.getNewCellsIfNeeded();
            if (!suppressUpdate) {
                if (this.getNumPages() == 1) {
                    this.setCurrentCell(0);
                }
                this.updateVisibleCellsImmediately(this.currentCell);
            }
            this.updateStats();
            if (triggerOnPageChangeComplete && (typeof this.onPageChangeCompleteHandler !== "undefined")) {
                this.onPageChangeCompleteHandler();
            }
            if (typeof this.onUpdateUIHandler !== "undefined") {
                this.onUpdateUIHandler();
            }
            this.pageButtons[this.shouldShowScrollButtons() ? "show" : "hide"]();
        },
        shouldShowScrollButtons: function() {
            return this.getNumPages() > 1 || this.currentCell !== 0 || this.buttonFallbackCallback;
        },
        updateStats: function() {
            var currentPage = 1 + Math.floor(this.getCurrentPage());
            $(".page-number", this.pagination)
                .text(currentPage + " ");
            $(".num-pages", this.pagination)
                .text(Math.max(this.getNumPages(), currentPage) + " ");
            this.startOver.css("display", this.isFirstPage() ? "none" : "");
            this.pagination[(!this.suppressPaginationOnLoad && this.shouldShowScrollButtons()) ? "show" : "hide"]();
            var unused;
            if (!this.circular) {
                this.prevButton[this.isFirstPage() ? "addClass" : "removeClass"]("disabled");
                this.nextButton[this.isLastPage() ? "addClass" : "removeClass"]("disabled");
            }
        },
        getCurrentCell: function() {
            return this.currentCell;
        },
        getCurrentPage: function() {
            return Math.round(this.currentCell / this.numCellsPerPage);
        },
        isMidPage: function() {
            return !!(this.currentCell % this.numCellsPerPage);
        },
        isLastPage: function() {
            return this.currentCell + this.numCellsPerPage >= this.numCellsTotal;
        },
        isFirstPage: function() {
            return this.getCurrentPage() === 0;
        },
        getNumCellsPerPage: function() {
            return this.numCellsPerPage;
        },
        getNumPages: function() {
            return Math.ceil(this.numCellsTotal / this.numCellsPerPage);
        },
        getAllCells: function() {
            return this.allCells;
        },
        updateCellStats: function() {
            this.allCells = this.rootUl.find("> li");
            this.numCellsPerPage = this.allCells.size();
        },
        adjustNumLisInDom: function() {
            if (this.getAllCells()
                .size() === 0) {
                this.allCells = $('<li class="shoveler-cell">')
                    .appendTo(this.rootUl);
                this.numCellsPerPage = 1;
            }
            var totalWidth = this.rootUl.width();
            var cellWidth = this.getAllCells()
                .width();
            if (cellWidth === 0) {
                return;
            }
            cellWidth += this.horizPadding;
            var cellsPerPage = Math.floor(totalWidth / cellWidth) * this.rows;
            if (cellsPerPage < 1) {
                cellsPerPage = 1;
            }
            if ((this.maxCellsPerPage > 0) && (cellsPerPage > this.maxCellsPerPage)) {
                cellsPerPage = this.maxCellsPerPage;
            }
            var remainingSpace = totalWidth - (cellsPerPage / this.rows) * cellWidth;
            var actualCellsPerPage = this.getNumCellsPerPage();
            var difference = cellsPerPage - actualCellsPerPage;
            if (difference === 0) {} else {
                if (difference > 0) {
                    var app = [];
                    for (var i = 0; i < difference; i++) {
                        app.push('<li class="shoveler-cell">');
                    }
                    this.rootUl.append($(app.join("")));
                } else {
                    internalRemove(this.allCells.slice(difference));
                }
            }
            this.updateCellStats();
            var margin = Math.floor(remainingSpace / (cellsPerPage / this.rows) / 2);
            margin += (this.horizPadding / 2);
            var origmargin = this.getAllCells()
                .css("margin-left");
            if (origmargin != (margin + "px")) {
                this.getAllCells()
                    .css({
                        "margin-left": margin + "px",
                        "margin-right": margin + "px"
                    });
            }
            if (this.rows > 1) {
                var cellHeight = this.getAllCells()
                    .height();
                var usedCells = cellsPerPage;
                if (this.currentCell + cellsPerPage > this.numCellsTotal) {
                    usedCells = this.numCellsTotal - this.currentCell;
                }
                var displayableRows = Math.ceil((usedCells) / (cellsPerPage / this.rows));
                this.rootUl.height(cellHeight * displayableRows);
            }
        },
        isCellEmpty: function(value) {
            return typeof value === "undefined" || typeof value === "number";
        },
        cacheUpdated: function(wasAjax, wasVisible) {
            if (!this.animInProgress() && wasAjax && wasVisible) {
                this.updateUI(true, false);
            } else {
                if (wasAjax) {
                    this.pendingAsyncDataRequiresPageRefresh = true;
                }
            }
        },
        getNewCellsIfNeeded: function() {
            var numToFetch = this.getNumCellsPerPage();
            if (this.currentCell != 0 && this.preloadNextPage) {
                numToFetch *= 2;
            }
            var slice = this.cache.slice(this.currentCell, this.currentCell + numToFetch);
            slice = $.grep(slice, function(item, index) {
                return typeof item === "number";
            });
            if (!slice.length) {
                return;
            }
            var originalStartIndex = slice[0];
            var numCells = slice.pop() - originalStartIndex + 1;
            var data = this.generator(originalStartIndex, numCells);
            if (data instanceof Array) {
                this.updateCache(originalStartIndex, false, data, false);
            } else {
                if (typeof data === "string") {
                    var self = this;
                    $.ajax({
                        url: data,
                        dataType: "json",
                        timeout: self.ajaxTimeout,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {},
                        success: function(jsonObjArray) {
                            jsonObjArray = self.ajaxResultTransformer(jsonObjArray);
                            if (!jsonObjArray || !(jsonObjArray instanceof Array)) {
                                throw "unexpected value returned from ajax call: " + (jsonObjArray ? (typeof jsonObjArray) : jsonObjArray);
                            }
                            if (jsonObjArray.length < numCells) {
                                jsonObjArray.length = numCells;
                            }
                            self.updateCache(originalStartIndex, false, jsonObjArray, true);
                        }
                    });
                }
            }
        },
        switchVisibleCellsInterval: null,
        animInProgress: function() {
            return this.switchVisibleCellsInterval !== null;
        },
        switchVisibleCells: function(lastDirection, wrapped, focusContent) {
            if (this.animInProgress()) {
                clearInterval(this.switchVisibleCellsInterval);
                this.switchVisibleCellsInterval = null;
            }
            var animateFromRightToLeft = (lastDirection === 1);
            var decrement = lastDirection;
            if (wrapped) {
                animateFromRightToLeft = !animateFromRightToLeft;
                decrement *= -1;
            }
            var indexWithinPage = animateFromRightToLeft ? this.getNumCellsPerPage() - 1 : 0;
            var endIndexWithinPage = animateFromRightToLeft ? 0 : this.getNumCellsPerPage() - 1;
            var startCell = this.currentCell;
            var self = this;
            var finishCellUpdate = function() {
                clearInterval(self.switchVisibleCellsInterval);
                self.switchVisibleCellsInterval = null;
                var hasNoPendingCells = !(self.getAllCells()
                    .hasClass("shoveler-progress"));
                self.updateUI(self.pendingAsyncDataRequiresPageRefresh, hasNoPendingCells);
            };
            if (focusContent) {
                this.rootUl.focus();
            }
            if (lastDirection === 0) {
                internalRemove(this.getAllCells()
                    .children());
                this.switchVisibleCellsInterval = setInterval(function() {
                    for (var i = startCell; i < self.getNumCellsPerPage(); i++) {
                        self.updateCellIfVisible(i);
                    }
                    finishCellUpdate();
                }, this.cellChangeSpeedInMs * 2);
            } else {
                this.switchVisibleCellsInterval = setInterval(function() {
                    var index, currentCacheIndex;
                    var rows = self.rows;
                    var cols = self.getNumCellsPerPage() / rows;
                    for (var i = 0; i < rows; i++) {
                        index = (startCell + indexWithinPage);
                        currentCacheIndex = (index % rows) * cols + Math.floor(index / rows) % cols + startCell;
                        self.updateCellIfVisible(currentCacheIndex);
                        if (indexWithinPage === endIndexWithinPage) {
                            finishCellUpdate();
                            return;
                        }
                        indexWithinPage -= decrement;
                    }
                }, this.cellChangeSpeedInMs);
            }
        },
        updateVisibleCellsImmediately: function(startCell) {
            this.pendingAsyncDataRequiresPageRefresh = false;
            for (var i = 0; i < this.getNumCellsPerPage(); i++) {
                var cacheIndex = startCell + i;
                this.updateCellIfVisible(cacheIndex);
            }
        },
        updateCellIfVisible: function(currentCacheIndex) {
            var cellIndex = currentCacheIndex - this.currentCell;
            var li = this.getAllCells()
                .eq(cellIndex);
            if (!this.isCellEmpty(this.cache[currentCacheIndex])) {
                var cell = this.cache[currentCacheIndex];
                if (li[0] != cell) {
                    var self = this;
                    var shown = false;

                    function tryShowCell() {
                        if (count > 0 || shown) {
                            return;
                        }
                        shown = true;
                        self.cacheImagesLoaded[currentCacheIndex] = true;
                        internalRemove(li.children());
                        li.append(cell)
                            .removeClass("shoveler-progress");
                    }
                    var count = 0;
                    if (!this.cacheImagesLoaded[currentCacheIndex]) {
                        var images = $("img", cell);
                        count = images.length;
                        for (var i = 0; i < images.length; i++) {
                            if (images[i].complete) {
                                count--;
                            } else {
                                images[i].onload = function() {
                                    count--;
                                    tryShowCell();
                                };
                            }
                        }
                    }
                    tryShowCell();
                } else {
                    li.removeClass("shoveler-progress");
                }
            } else {
                internalRemove(li.children());
                if (currentCacheIndex >= this.numCellsTotal) {
                    li.html('<span class="empty">')
                        .removeClass("shoveler-progress");
                } else {
                    li.html('<span class="empty">')
                        .addClass("shoveler-progress");
                }
            }
        },
        updateCache: function(originalStartIndex, isHtml, data, wasAjax) {
            if (data.length === 0) {
                return;
            }
            var self = this;
            var wasVisible = (originalStartIndex < this.currentCell + this.getNumCellsPerPage());
            var didUpdate = false;
            for (var i = 0; i < data.length; i++) {
                var cell = data[i];
                if (!isHtml) {
                    cell = $(self.cellTransformer(cell));
                }
                this.cache[originalStartIndex + i] = cell;
                didUpdate = true;
            }
            if (didUpdate) {
                this.cacheUpdated(wasAjax, wasVisible);
            }
        },
        gotoPage: function(pageNumber, wrapped, focusContent) {
            if (wrapped !== true) {
                wrapped = false;
            }
            if (pageNumber >= this.getNumPages()) {
                pageNumber = this.getNumPages() - 1;
            }
            if (pageNumber < 0 || isNaN(pageNumber)) {
                pageNumber = 0;
            }
            var lastDirection = (this.getCurrentPage() < pageNumber) ? 1 : -1;
            this.setCurrentCell(pageNumber * this.getNumCellsPerPage());
            this.updateStats();
            this.switchVisibleCells(lastDirection, wrapped, focusContent);
        },
        gotoFirstPage: function(focusContent, suppressAnimation) {
            this.setCurrentCell(0);
            this.updateStats();
            if (suppressAnimation) {
                this.getNewCellsIfNeeded();
                this.updateVisibleCellsImmediately(this.currentCell);
            } else {
                this.switchVisibleCells(0, false, focusContent);
            }
        },
        gotoLastPage: function(focusContent, suppressAnimation) {
            this.setCurrentCell((this.getNumPages() - 1) * this.getNumCellsPerPage());
            this.updateStats();
            if (suppressAnimation) {
                this.getNewCellsIfNeeded();
                this.updateVisibleCellsImmediately(this.currentCell);
            } else {
                this.switchVisibleCells(-1, false, focusContent);
            }
        },
        setCurrentCell: function(cell) {
            this.currentCell = cell;
            if (this.state) {
                this.state.set(cell);
            }
        },
        size: function() {
            return this.numCellsTotal;
        }
    });
    amznJQ.declareAvailable("amazonShoveler");
});