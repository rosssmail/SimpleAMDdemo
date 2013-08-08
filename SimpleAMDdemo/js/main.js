(function () {

    require({
        async: 1,
        mvc: {debugBindings: true},
        deps: ["dojo/parser", "dojo/domReady!"],
        isDebug: true,
        packages: [
            {
                name: "ecl",
                location: location.pathname.replace(/\/[^/]+$/, "") + "/js/ecl"
            }]
    });

    require(["ecl/app", "dojo/parser"],
        function (app) {
            return app.initialize();
        });

})();