var model;
define(["dojo/_base/declare", "dojo/parser", "dojo/domReady!", "dojo/_base/lang", "dojo/on", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojox/layout/FloatingPane", "dojo/dom-geometry", "dojo/dom-attr", "dojo/text!./Bookmarks/bookmark.html"],

    function (declare, parser, domReady, lang, on, widgetBase, templatedMixin, widgetsInTemplateMixin, FloatingPane, domGeom, domAttr, template) {

        //DW README
        //Attempt to use dojo MVC but I found it complex and it didn't work that well.

        //the dojo class we are declaring
        return declare([widgetBase, templatedMixin, widgetsInTemplateMixin], {

            templateString: template,
            configOptions: null,
            model: null,

            constructor: function () {
                //function inherited from widget. Important must inherit arguments if using this function
                this.inherited(arguments);
                // run before the UI.
            },

            postCreate: function () {
                //function inherited from widget. Important must inherit arguments if using this function
                this.inherited(arguments);
            },

            startup: function () {
                this.inherited(arguments);
                this._showFloatingPane('mapDiv', 600, 400, 300, 100, 'Bookmarks');
            },

            //method can't actually be private, we follow the dojo naming convention
            _showFloatingPane: function (div, x, y, width, height, title) {
                var mapDiv = dojo.byId(div);

                this.floatingPane.placeAt(mapDiv);
                this.floatingPane.resize = this._fixResizeBug;
                this.floatingPane.resize({ 'w': width, 'h': height });
                this.floatingPane.domNode.style.left = x + "px";
                this.floatingPane.domNode.style.top = y + "px";
                this.floatingPane.set('title', title);

                this.floatingPane.startup();
                this.floatingPane.bringToTop();

            },

            //method can't actually be private, we follow the dojo naming convention
            _fixResizeBug: function (/* Object */dim) {
                //DW bug in IE. if null exit
                if (dim == null) {
                    return;
                }

                // summary: Size the FloatingPane and place accordingly
                // summary: Size the FloatingPane and place accordingly
                dim = dim || this._naturalState;
                this._currentState = dim;

                // From the ResizeHandle we only get width and height information
                var dns = this.domNode.style;
                if ("t" in dim) {
                    dns.top = dim.t + "px";
                } else if ("y" in dim) {
                    dns.top = dim.y + "px";
                }
                if ("l" in dim) {
                    dns.left = dim.l + "px";
                } else if ("x" in dim) {
                    dns.left = dim.x + "px";
                }
                dns.width = dim.w + "px";
                dns.height = dim.h + "px";

                // Now resize canvas
                var mbCanvas = { l: 0, t: 0, w: dim.w, h: (dim.h - this.focusNode.offsetHeight) };
                domGeom.setMarginBox(this.canvas, mbCanvas);

                // If the single child can resize, forward resize event to it so it can
                // fit itself properly into the content area
                this._checkIfSingleChild();
                if (this._singleChild && this._singleChild.resize) {
                    this._singleChild.resize(mbCanvas);
                }

            }

        });

    });