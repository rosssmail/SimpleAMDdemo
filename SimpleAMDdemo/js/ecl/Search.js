define([],

    function () {

        //private variables
        var configOptions;

        //private function
        function initUi() {
            ///<summary>uses the configOptions defined by user to initialise the user interface</summary>
           
        }

        //the module we will return. Includes all publicly accessible properties and functions
        var module = {
            startup: function (options, div) {
                configOptions = options;
            }
        };

        return module;


    });