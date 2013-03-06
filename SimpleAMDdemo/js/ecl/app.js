define(["ecl/MapManager2"],
    
    function (MapManager) {

        var initialize;
        initialize = function() {
            //for all config options given to the user we must have defaults
            var configOptions = {
                appid: "ea351fe00d8143d7a66798d9c520d186",
                slider: "true",
                scalebar: "true",
                overviewmap: { show: "true", position: "bottom-right" },
                menu: "true",
                basemap: "topo",
                lng: -122.45,
                lat: 37.75,
                zoom: 13,
            };

            MapManager.startup(configOptions, "mapDiv");
            
        };
        
        return {
            initialize: initialize
        };
        
    });