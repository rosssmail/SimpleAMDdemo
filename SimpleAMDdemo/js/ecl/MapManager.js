/// <reference path="~/esri-jsapi-vsdoc.js" />

define([
        "dojo/_base/lang",
        "dojo/on",
        "esri/map",
        "esri/dijit/Scalebar",
        "esri/dijit/OverviewMap",
        "ecl/map-cereal"
       ],

    function (lang, on, Map, Scalebar, OverviewMap, Cereal) {

        //private variables
        var configOptions;
        var map;

        //private function
        function initUi() {
            ///<summary>uses the configOptions defined by user to initialise the user interface</summary>

            var config = configOptions;
            if (config.scalebar.toLowerCase() === 'true') {
                var scalebar = new Scalebar({ map: map, scalebarUnit: 'metric' });
                scalebar.show();
            }
            if (config.overviewmap.show.toLowerCase() === 'true') {
                var overviewMapDijit = new OverviewMap({
                    map: map,
                    attachTo: config.overviewmap.position,
                    color: "#D84E13",
                    opacity: .40
                });
                overviewMapDijit.startup();
            }
        }

        //the module we will return. Includes all publicly accessible properties and functions
        var module = {

            //public function
            startup: function (options, div) {

                configOptions = options;

                map = new Map(div, {
                    basemap: configOptions.basemap,
                    center: [configOptions.lng, configOptions.lat],
                    zoom: configOptions.zoom
                });

                on(map, "Load", lang.hitch(this, function (e) {
                    // handle the event
                    initUi();
                    cereal = new Cereal({
                        map: map
                    });

                    cereal.toJSON().then(function (json) {
                        console.log(json);
                    });
                }));

            }
        };

        //return AMD module
        return module;


    });