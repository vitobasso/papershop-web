/**
 * Created by Victor on 18/07/2015.
 */

var MessageUI = (function () {
    var module = {};

    var total = 0, filtered = 0;

    module.setTotal = function (newTotal) {
        total = newTotal;
        setText();
    };

    module.setFiltered = function (newFiltered) {
        filtered = newFiltered;
        setText();
    };

    module.updateRequestStatus = function () {
        setText();
    };

    function setText() {
        var msg = buildStatusMessage() || buildCountMessage();
        $("#message").text(msg);
    }

    function buildCountMessage() {
        return "Showing " + filtered + "/" + total + " items:";
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