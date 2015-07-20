/**
 * Created by Victor on 20/07/2015.
 */
var ListenerAssigner = (function () {
    var module = {};

    module.assignSearchFieldListeners = function () {
        onSearchButtonClick();
        onSearchFieldKeyup();
    };

    function onSearchButtonClick() {
        $("#search-button").click(
            ItemFinder.find
        );
    }

    function onSearchFieldKeyup() {
        $("#search-field").keyup(function (e) {
            if (e.keyCode == 13) {
                $("#request-button").click();
            }
        });
    }

    module.assignFilterListeners = function () {
        onFilterTitleClick();
        onFilterOptionDblclick();
    };

    function onFilterTitleClick() {
        $("#filters").find("> .filter").find("> .title").click(function () {
            var filterName = this.__data__.name;
            ChartManager.changeAxisByName(filterName);
        })
    }

    function onFilterOptionDblclick() {
        $("#filters").find("div.filter option").dblclick(
            ItemFinder.find
        )
    }

    return module;
}());

