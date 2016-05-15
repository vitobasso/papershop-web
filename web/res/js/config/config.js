
var Config = (function () {
    var module = {};

    var selectedSubdomain = SITE_IDS[0];
    var selectedCountry;

    module.init = function () {
        // setUserLocale();
        populate('#site', Sites.list());
        // populate('#sub-domain', SITE_IDS);
        // populate('#country', COUNTRY_CODES);
        HandlerAssigner.bindDialog("#config", "#config-btn");
    };

    function populate(selectId, data) {
        var select = d3.select("#config")
            .select(selectId);

        var options = select.selectAll('option').data(data, getId)
            .enter().append('option')
            .attr("value", getId)
            .html(getName);

        select.on("change", handleSelection(selectId, Sites.set));
    }

    function handleSelection(selectId, fun){
        return () => fun(getSelectedItem(selectId))
    }

    function getSelectedItem(selectId) {
        var select = d3.select(selectId),
            options = select.selectAll('option'),
            index = select.property('selectedIndex'),
            option = options.filter((d, i) => i === index);
        return option.datum();
    }

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