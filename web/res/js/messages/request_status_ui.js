/**
 * Created by Victor on 06/08/2015.
 */
var RequestStatusUI = (function () {
    var module = {};

    var divId = RequestLog.statusDivId;

    module.update = function () {
        var history = RequestLog.getHistory();
        if (history.length) {
            show(history)
        } else {
            hide();
        }
    };

    function show(history) {
        var pendingRequests = history.filter(isPending);
        var msg = pendingRequests.length ? "Waiting..." : "";
        $(divId).text(msg)
    }

    function isPending(request) {
        return request.isPending;
    }

    function hide() {
        $(divId).hide();
    }

    return module;
}());