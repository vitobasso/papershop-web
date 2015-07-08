/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var items = new Set(getId, mergeItems);
    var api = new EbayApi();
    var ebayChart = new EbayChart(api, getItems, "#x-axis-select", "#color-select");

    function getItems() {
        return items.toArray();
    }

    function mergeItems(oldItem, newItem) {
        for (var key in  newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    function addItems(newItems) {
        items.addAll(newItems);
        $("#total-count").show().text(items.size());
    }

    /////////////////////////////////////////////////////////

    this.doRequest = function () {
        var params = {
            keywords: $("#keywords").val(),
            listingType: ["AuctionWithBIN", "FixedPrice"],
            aspects: getAspectFilters(),
            itemsPerPage: $("#items-per-page").val(),
            page: $("#page").val()

        };

        api.find(params, function (response) {
            populateChart(params, response)
        });
    };

    function getAspectFilters() {
        var filters = [];
        $("#categories").find("select").each(function (i, aspect) {
            var sel = $(aspect).find("option").filter(":selected");
            if (sel.length > 0) {
                var filter = {
                    name: aspect.__data__.name,
                    values: sel.toArray().map(function (option) {
                        return option.__data__.name
                    })
                };
                filters.push(filter);
            }
        });
        return filters;
    }

    /////////////////////////////////////////////////////////

    function populateChart(requestParams, newItems) {
        guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        addItems(newItems);
        ebayChart.populate(items.toArray());
    }

    function guessAspectsFromTitle(newItems) {
        newItems.forEach(function (item) {
            var category = ebayChart.getCategory(item.category);
            if (category) {
                guessAspectsAndSet(item, category);
            }
        });
    }

    function guessAspectsAndSet(item, category) {
        var guesses = guessAspects(item, category);
        setAspectGuessesToItem(guesses, item);
    }

    function guessAspects(item, category) {
        var bestGuesses = {};
        var words = getAspectCandidates(item);
        for (var i = 0, word; word = words[i]; i++) {
            var match = category.fuzzyValues.get(word);
            if (match) {
                var newGuess = {
                    confidence: match[0][0],
                    value: match[0][1]
                };
                var aspectName = category.aspectValuesMap[match[0][1]].name;
                if (!bestGuesses[aspectName] || bestGuesses[aspectName].confidence < newGuess.confidence) {
                    bestGuesses[aspectName] = newGuess;
                }
            }
        }
        return bestGuesses;
    }

    function getAspectCandidates(item) {
        var words = item.title.split(" ");
        var result = [];
        result.pushAll(words);
        result.pushAll(createNgrams(2, words));
        result.pushAll(createNgrams(3, words));
        return result;
    }

    function createNgrams(n, words) {
        var result = [];
        for (var i = 0, end = words.length - (n-1); i < end; i++) {
            var ngram = createNgram(n, words, i);
            result.push(ngram);
        }
        return result;
    }

    function createNgram(n, words, i) {
        var wordArray = [];
        for (var j = 0; j < n; j++) {
            wordArray.push(words[i + j]);
        }
        return wordArray.join(" ");
    }

    function setAspectGuessesToItem(guesses, item) {
        for (var aspectName in guesses) {
            if (guesses.hasOwnProperty(aspectName)) {
                item.aspects[aspectName] = guesses[aspectName];
            }
        }
    }

    function rememberAspectsFromRequest(requestParams, newItems) {
        var requestAspects = getAspectsFromRequest(requestParams);
        newItems.forEach(function (item) {
            for (var aspectName in requestAspects) {
                if (requestAspects.hasOwnProperty(aspectName)) {
                    item.aspects[aspectName] = {
                        value: requestAspects[aspectName],
                        confidence: 2
                    };
                }
            }
        });
    }

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.aspects.filter(function (aspect) {
            return aspect.values.length == 1;
        });
        var aspectsMap = {};
        singleValueAspects.forEach(function (aspect) {
            aspectsMap[aspect.name] = aspect.values[0];
        });
        return aspectsMap;
    }

    ///////////////////////////////////////////////////////////

    function getId(object) {
        return object.id;
    }

    function getName(object) {
        return object.name;
    }

}

function showError(msg) {
    $("#error-msg").html(msg);
}
