(function () {

    require({
        async: 1,
        packages: [
            {
                name: "ecl",
                location: location.pathname.replace(/\/[^/]+$/, "") + "/js/ecl"
            }]
    });

    require(["ecl/app"],
        function (app) {
            return app.initialize();
        });

})();