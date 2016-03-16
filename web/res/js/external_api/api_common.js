var ApiCommon = (function () {
    var module = {};

    module.requestAndParse = function(url, parse, onSuccess, onFail) {
        request(url, parseAndCallback, onFail);

        function parseAndCallback(response) {
            try {
                var result = parse(response);
            } catch (err) {
                if(onFail){
                    onFail(err);
                } else {
                    throw err;
                }
                return;
            }
            onSuccess(result);
        }
    };

    function request(url, onSuccess, onFail) {
        console.log(url);
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: onSuccess,
            error: onFail
        })
    }

    return module;
}());