
var MessageUI = (function () {
    var module = {};

    var totalCount = 0, filteredCount = 0;

    module.init = _ => {
        $.subscribe('new-items', onNewItems)
        $.subscribe('apply-filter', onApplyFilter)
    };

    module.updateRequestStatus = function () {
        update();
    };

    function onNewItems(_, newItems, filtered, all){
        totalCount = all.length;
        updateFilteredCount(filtered.length);
        update();
    }

    function onApplyFilter (_, filtered) {
        updateFilteredCount(filtered.length);
        update();
    }

    function updateFilteredCount(newCount){
        if(newCount){
            filteredCount = newCount;
        }
    }

    function update() {
        var msg = buildStatusMessage() || buildCountMessage();
        $("#message").text(msg);
    }

    function buildCountMessage() {
        return "Showing " + filteredCount + "/" + totalCount + " items:";
    }

    function buildStatusMessage() {
        var history = RequestLog.getHistory();
        var msg = "";
        if (history) {
            var pendingRequests = history.filter(isPending);
            if (pendingRequests.length) {
                if (Items.count()) {
                    msg = "Finding more...";
                } else {
                    msg = "Finding...";
                }
            }
        }
        return msg;
    }

    function isPending(request) {
        return request.isPending;
    }

    return module;
}());