/**
 * Created by Victor on 20/07/2015.
 */
var ListenerAssigner = (function () {
    var module = {};

    module.bindSearchFieldEvents = function () {
        bindSearchButtonClick();
        bindSearchFieldKeyup();
    };

    function bindSearchButtonClick() {
        $("#search-button").off().on("click",
            ItemFinder.find
        );
    }

    function bindSearchFieldKeyup() {
        $("#search-field").off().on("keyup", function (e) {
            if (e.keyCode == 13) {
                $("#search-button").click();
            }
        });
    }

    module.bindFilterListeners = function () {
        bindFilterTitleClick();
        bindFilterOptionDblclick();
    };

    function bindFilterTitleClick() {
        $("#filters").find("> .filter").find("> .title")
            .off().on("click", function () {
                var filterName = this.__data__.name;
                ChartManager.changeAxisByName(filterName);
        })
    }

    function bindFilterOptionDblclick() {
        $("#filters").find("div.filter option")
            .off().on("dblclick",
                ItemFinder.find
        )
    }

    return module;
}());

