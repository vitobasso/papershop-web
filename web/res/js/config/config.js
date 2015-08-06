/**
 * Created by Victor on 06/08/2015.
 */
var Config = (function () {
    var module = {};

    var selectedSite = SITE_IDS[0];
    var selectedCountry;

    module.init = function () {
        setUserLocale();
        //var options = {
        //    autoOpen: false
        //};
        //$("#config").dialog(options);
    };

    function setUserLocale() {
        var userCountryCode = getUserCountry();
        var matchUserCountry = idMatcher(userCountryCode);
        var matchDefaultCountry = idMatcher("US");
        selectedCountry = COUNTRY_CODES.find(matchUserCountry)
        || COUNTRY_CODES.find(matchDefaultCountry);
    }

    function idMatcher(value) {
        return function (obj) {
            return obj.id == value;
        };
    }

    function getUserCountry() {
        var lang = navigator.language;
        var pattern = /(\w\w)-(\w\w)/i;
        var regex = new RegExp(pattern);
        var result = regex.exec(lang);
        return result[2] || "US";
    }

    var sites = {
        name: "Site",
        values: SITE_IDS,
        getValueLabel: getName,
        getValueId: getId
    };

    var countries = {
        name: "AvailableTo",
        values: COUNTRY_CODES,
        getValueLabel: getName,
        getValueId: getId
    };

    return module;
}());