
var HandlerAssigner = (function () {
    var module = {};

    module.init = () => {
        $.subscribe('init', module.bindSearchFieldEvents)
    };

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
        bindFilterArrowClick();
        bindFilterTitleClick();
        bindFilterItemClick();
        bindFilterItemChange();
    };

    function bindFilterTitleClick() {
        $("#filters").find("> .filter").find(" .title")
            .off().on("click", function () {
                var filterName = this.__data__.name;
                ChartManager.changeAxisByName(filterName);
                FilterUI.refresh();
            })
    }

    function bindFilterItemClick() {
        $("#filters").find("div.filter label")
            .off().on("click", function(){
                $(this).parent().find("input")
                    .prop("checked", invert)
                    .change();
            })
    }

    function invert(i, value){
        return !value;
    }

    function bindFilterItemChange() {
        $("#filters").find("div.filter input")
            .off("change").on("change", function(){
                this.__data__.checked = this.checked;
                Main.applyFilters()
            });

    }

    function bindFilterArrowClick() {
        $("#filters").find("> .filter").find(" .expander")
            .off().on("click", function () {
                var topDiv = this.parentNode;
                var filterDiv = topDiv.parentNode;
                FilterUI.toggleExpanded(filterDiv);
            });
    }

    module.bindRequestLogDialog = function () {
        $("#message").off().on("click", function () {
            setRequestDialogPosition();
            toggleRequestDialog();
        });
    };

    function toggleRequestDialog() {
        var dialogDiv = $("#request-log");
        if (dialogDiv.dialog("isOpen")) {
            dialogDiv.dialog("close");
        } else {
            dialogDiv.dialog("open");
        }
    }

    function setRequestDialogPosition() {
        $("#request-log").dialog("option", "position", {
            my: 'left top',
            at: 'left bottom',
            of: $('#message')
        });
    }

    return module;
}());

