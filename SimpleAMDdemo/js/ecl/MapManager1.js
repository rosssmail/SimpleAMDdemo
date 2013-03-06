/// <reference path="~/esri-jsapi-vsdoc.js" />

//An anonymous module that returns an object literal dependent on esri/map"

define(["esri/map"],

    function (map) {

        var myModule = {

            startup: function () {
                ///<summary>create the map</summary>

                this.map = new esri.Map("mapDiv", {
                    basemap: "topo",
                    center: [-122.45, 37.75], //long, lat
                    zoom: 13
                });

            }

        };
        
        return myModule;

    });