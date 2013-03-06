define(["dijit/Toolbar", "dijit/form/Button", "dojo/_base/array", "dojo/topic"],

    function (Toolbar, Button, array, topic) {

        //private variables
        var configOptions;
        var divToolbar;

        //private function
        function initUi() {
            ///<summary>uses the configOptions defined by user to initialise the user interface</summary>
            var toolbar = new Toolbar({}, divToolbar);
            array.forEach(configOptions, function (item) {
                var button = new Button({
                    label: item.name,
                    showLabel: false,
                    iconClass: "dijitEditorIcon dijitEditorIcon" + item.iconClass,
                    onClick: function () {
                        topic.publish("Menu/Button/Click", item.eventToRaise); //optionally we can pass objects around with publish
                    }
                });

                toolbar.addChild(button);
            });
        }

        //the module we will return. Includes all publicly accessible properties and functions
        var module = {
            startup: function (options, div) {
                configOptions = options.menuItems;
                divToolbar = div;
                initUi();
            }
        };

        return module;


    });