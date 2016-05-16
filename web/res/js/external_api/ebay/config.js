//TODO not used yet
var EbayConfig = (function () {
    var module = {};

    var selectedSubdomain = SITE_IDS[0];
    var selectedCountry;

    module.init = function () {
        // setUserLocale();
        // populate('#sub-domain', SITE_IDS); //method in the general Config
        // populate('#country', COUNTRY_CODES);
    };

    function setUserLocale() {
        var userCountryCode = getUserCountry();
        var matchUserCountry = hasId(userCountryCode);
        var matchDefaultCountry = hasId("US");
        selectedCountry = COUNTRY_CODES.find(matchUserCountry)
        || COUNTRY_CODES.find(matchDefaultCountry);
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
        values: SITE_IDS
    };

    var countries = {
        name: "AvailableTo",
        values: COUNTRY_CODES
    };

    return module;
}());