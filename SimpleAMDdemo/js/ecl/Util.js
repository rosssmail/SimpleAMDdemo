/* File Created: November 20, 2012 */
define([
        "dojo/_base/declare", "dijit/Dialog", "dojo/_base/lang", "dojo/on", "dojo/dom", "dojo/dom-class", "dojo/_base/Color", "dojo/has", "dojo/_base/sniff"],

    function (declare, Dialog, lang, on, dom, domClass, Color, has) {

        return {

            errorHandler: function (declaredClass, functionName, error, comments, severity) {
                ///<summary>Shows the user an error and sends to the back end</summary>
                ///<param name="Severity">0=Fatal 1=Critical 2=Information</param>"/>

                if (!functionName) {
                    functionName = "unknown";
                }

                //show the error to the user?
                if (ecl.errDialog == null) {
                    ecl.errText = '<p>' + error.message + '</p>';
                    ecl.errDialog = new Dialog({
                        title: declaredClass + "." + functionName,
                        content: ecl.errText,
                        style: "width: 400px"
                    });
                    on(ecl.errDialog, "hide", lang.hitch(this, function () {
                        var self = ecl;
                        setTimeout(lang.hitch(this, function () {
                            self.errDialog.destroyRecursive();
                            self.errDialog = null;
                            self.errText = null;
                        }), 700);
                    }));
                } else { //make sure we only show one dialog -append if it is already open
                    ecl.errText = ecl.errText + '<p>' + error.message + '</p>';
                    if (error.message) {
                        ecl.errDialog.set('content', ecl.errText);
                    }
                }
                //log to the console
                switch (severity) {
                    case 0:
                        //fatal
                        console.error(declaredClass + "." + functionName + ": " + error.message);
                        ecl.errDialog.show();
                        break;
                    case 1:
                        console.warn(declaredClass + "." + functionName + ": " + error.message);
                        ecl.errDialog = null;
                        break;
                    case 2:
                        console.info(declaredClass + "." + functionName + ": " + error.message);
                        ecl.errDialog = null;
                        break;
                    default:
                        console.error(declaredClass + "." + functionName + ": " + error.message);
                        ecl.errDialog.show();
                        break;
                }
            },

            setExtent: function (feature, map) {
                ///<summary>sets the map extent taking in to account point features</summary>
                var extent;
                switch (feature.geometry.type) {
                    case "point":
                        var factor = 10000; //some factor for converting point to extent
                        extent = new esri.geometry.Extent(feature.geometry.x - factor, feature.geometry.y - factor, feature.geometry.x + factor, feature.geometry.y + factor, feature.geometry.spatialReference);
                        break;
                    default:
                        extent = feature.geometry.getExtent();
                        extent = extent.expand(1.25);
                }
                map.setExtent(extent);
            },


            formatGridData: function (data) {
                ///<summary>
                ///IE7bug. Blank cells do not have outline, remove null values. See case 7489 Total: Identify tool/Reporting - column alignment. 
                ///IE7bug. does not support no-wrap. Use nobr
                ///</summary>
                try {
                    if (data == null || data == "" || data == " ") {
                        data = "&nbsp;";
                    }
                    return '<nobr>' + data + '</nobr>';
                } catch (e) {
                    return '<nobr>' + data + ' error in formatGridData: ' + e.message + '</nobr>';
                }
            },

            formatGridLink: function (data) {
                ///<summary>
                ///IE7 issue. Blank cells do not have outline, remove null values. See case 7489 Total: Identify tool/Reporting - column alignment. 
                ///IE7 issue. does not support no-wrap. Use nobr
                ///</summary>
                try {
                    if (data == null || data == "" || data == " ") {
                        return "&nbsp;";
                    }
                    return '<nobr><a href="#">' + data + '</a></nobr>';
                } catch (e) {
                    return '<nobr>' + data + ' error in formatGridData: ' + e.message + '</nobr>';
                }
            },

            formateGridCellImage: function (dt) {
                ///<summary>sets the eSearch icon</summary>
                //*******ALL these images MUST BE preloaded. see GadamaCounts.js *********
                if (!dt) {
                    return "&nbsp;";
                }
                return "<nobr><img src='img/canOilslogo14.png' tooltip='Open in CanOils'/> " + dt + " </nobr>";
            },

            onRowMouseOver: function (evt) {
                ///<summary>when the user clicks on the data grid the current item is zoomed to</summary>
                if (evt.grid == null) {
                    return;
                }
                ;

                var row = evt.grid.getItem(evt.rowIndex);
                if (!row) {
                    return;
                }

                //hide previous tooltip
                if (evt.grid.toolTip) {
                    dijit.hideTooltip(this.grid.toolTip);
                    evt.grid.toolTip = null;
                }
                try {

                    if (evt.cell) {
                        if (evt.cellNode.innerText != ' ' && evt.cellNode.innerText != '') {
                            dijit.showTooltip(evt.cellNode.innerText, evt.cellNode);
                            evt.grid.toolTip = evt.cellNode;
                        }
                    }

                    //once data is sourced from table rather than AGS we should be able to remove this
                    var pf = "";
                    if (row[window.ecl.table + '.OBJECTID']) {
                        pf = window.ecl.table + ".";
                    }

                    var lat = Number(row[pf + 'CyloLatitude']);
                    var lng = Number(row[pf + 'CyloLongitude']);

                    var point = new esri.geometry.Point(lng, lat);
                    point = esri.geometry.geographicToWebMercator(point);
                    var symbol = new ecl.Util.GetSymbology(true);
                    var graphic = new esri.Graphic(point, symbol);
                    window.ecl.map.map.graphics.clear();
                    window.ecl.map.map.graphics.add(graphic);

                } catch (e) {
                    ecl.Util.errorHandler(this.declaredClass, arguments.callee.nom, '', 2);
                }

            },

            onRowClick: function (evt) {
                try {
                    var ulr = "http://10.0.0.13/webreport/tabbedsummarypage.aspx?itemId={0}&lType=modData&compId={1}";
                    if (!evt) {
                        return;
                    }
                    var row = evt.grid.getItem(evt.rowIndex);
                    if (!row) {
                        return;
                    }
                    if (!evt.cell) {
                        return;
                    }

                    //there are some special cells which launch back to can oils
                    if (evt.cell.field == "CyloUWI" || evt.cell.field == "CyloField" || evt.cell.field == "CyloFormation") {
                        var defs = { CyloUWI: { col: "CyloUWIId", compId: "1967" }, CyloField: { col: "CyloFieldId", compId: "1972" }, CyloFormation: { col: "CyloFormationId", compId: "1974"} };
                        ulr = ulr.format(row[defs[evt.cell.field].col], defs[evt.cell.field].compId);
                        window.open(ulr);
                        return;
                    }

                    //once data is sourced from table rather than AGS we should be able to remove this
                    //there are some special cells which launch back to can oils
                    var t = window.ecl.table;
                    if (evt.cell.field == t + ".CyloUWI" || evt.cell.field == t + ".CyloField" || evt.cell.field == t + ".CyloFormation") {
                        var uwi = t + ".CyloUWI", field = t + ".CyloField", formation = t + ".CyloFormation";
                        defs = {};
                        defs[uwi] = { col: "CyloUWIId", compId: "1967" };
                        defs[field] = { col: "CyloFieldId", compId: "1972" };
                        defs[formation] = { col: "CyloFormationId", compId: "1974" };
                        ulr = ulr.format(row[defs[evt.cell.field].col], defs[evt.cell.field].compId);
                        window.open(ulr);
                        return;
                    }

                    //once data is sourced from table rather than AGS we should be able to remove this
                    var pf = "";
                    if (row[window.ecl.table + '.OBJECTID']) {
                        pf = window.ecl.table + ".";
                    }

                    var lat = Number(row[pf + 'CyloLatitude']);
                    var lng = Number(row[pf + 'CyloLongitude']);

                    var point = new esri.geometry.Point(lng, lat);
                    point = esri.geometry.geographicToWebMercator(point);
                    var graphic = new esri.Graphic(point, null);
                    ecl.Util.setExtent(graphic, window.ecl.map.map);
                } catch (e) {
                    ecl.Util.errorHandler(this.declaredClass, arguments.callee.nom, '', 2);
                }

            },

            onRowMouseOut: function () {

                //hide previous tooltip
                if (this.grid.toolTip) {
                    dijit.hideTooltip(this.grid.toolTip);
                    this.grid.toolTip = null;
                }
                window.ecl.map.map.graphics.clear();
            },

            progress: function (show, message) {
                ///<summary>Shows the progress. Requires two divs with data-dojo-attach-point="statusText" and data-dojo-attach-point="statusIcon"
                /// to be present in the template</summary>
                ///<param name="module">A reference to the module </param>
                ///<param name="show">show the progress spinner?</param>
                ///<param name="message">A message to show. A blank string '' will clear the existing message, null will leave it</param>
                try {
                    var icon = this.statusIcon;
                    var text = this.statusText;

                    if (show) {
                        if (icon) {
                            domClass.remove(icon, 'hide');
                        }
                        if (!(message == null)) {
                            if (text) {
                                text.innerHTML = message;
                            } //only update if a message is sent. Send a blank string if you want to clear the message
                        }
                        ;
                    } else {
                        if (icon) {
                            domClass.add(icon, 'hide');
                        }
                        if (!(message == null)) {
                            if (text) {
                                text.innerHTML = message;
                            } //only update if a message is sent. Send a blank string if you want to clear the message
                        }
                        ;
                    }
                    ;
                } catch (e) {
                    ecl.Util.errorHandler(this.declaredClass, arguments.callee.nom, e, '');
                }
            },

            GetSymbology: function (highlight) {
                var oc, fc;
                if (!highlight) {
                    oc = new Color("#00FFFF");
                    fc = new Color("#00FFFF");
                } else {
                    oc = new Color("#FFFF00");
                    fc = new Color("#FFFF00");
                }

                var outline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, oc, 2.5);
                var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, outline, fc);
                return symbol;
            },

            isIE: function () {
                return has("ie");
            }
        };
    });