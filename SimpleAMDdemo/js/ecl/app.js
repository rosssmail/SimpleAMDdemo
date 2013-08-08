define(["dojo/parser", "ecl/MapManager", "ecl/Menu", "ecl/Bookmark", "ecl/Util", "dojo/topic"],

    function (parser, MapManager, Menu, Bookmark, Util, topic) {

        var initialize;
        initialize = function () {
            //for all config options given to the user we must have defaults
            var configOptions = {
                slider: "true",
                scalebar: "true",
                overviewmap: { show: "true", position: "bottom-right" },
                menu: "true",
                basemap: "topo",
                lng: -122.45,
                lat: 37.75,
                zoom: 13,
                menuItems: [
                    { name: 'Cut', iconClass: 'Cut', eventToRaise: 'View:Cut' },
                    { name: 'Copy', iconClass: 'Copy', eventToRaise: 'View:Copy' },
                    { name: 'Paste', iconClass: 'Paste', eventToRaise: 'View:Search' }
                ]
            };
            MapManager.startup(configOptions, "mapDiv");
            Menu.startup(configOptions, "menu");

            topic.subscribe("Menu/Button/Click", function (eventType) {
                console.log(eventType);
                switch (eventType) {
                    case "View:Search":
                        var a = new Bookmark();
                        a.startup(configOptions, "mapDiv");
                        break;
                }
            });

        };

        return {
            initialize: initialize
        };

    });