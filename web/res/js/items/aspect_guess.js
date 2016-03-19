
var AspectGuesser = (function () {
    var module = {};

    module.mapValues = function(category) {
        category.aspectValuesMap = mapByValue(category.aspects);
        var values = Object.keys(category.aspectValuesMap);
        category.fuzzyValues = FuzzySet(values);
    };

    function mapByValue(aspects) {
        var map = {};
        for (var i = 0, aspect; aspect = aspects[i]; i++) {
            for (var j = 0, value; value = aspect.values[j]; j++) {
                map[value.name] = aspect;
            }
        }
        return map;
    }

    module.guessFromTitle = function (newItems) {
        newItems.forEach(function (item) {
            var category = Categories.get(item.category);
            if (category && category.fuzzyValues) {
                guessAspects(item, category);
            }
        });
    };

    function guessAspects(item, category) {
        var guesses = generateGuesses(item, category);
        setAspectGuessesToItem(guesses, item);
    }

    function generateGuesses(item, category) {
        var bestGuesses = {};
        var words = getAspectCandidates(item);
        for (var i = 0, word; word = words[i]; i++) {
            var match = category.fuzzyValues.get(word);
            if (match) {
                var confidence = match[0][0];
                var valueName = match[0][1];
                var aspect = category.aspectValuesMap[valueName];
                var newGuess = createGuess(aspect, valueName, confidence);
                var aspectName = aspect.name;
                if (!bestGuesses[aspectName] || bestGuesses[aspectName].confidence < newGuess.confidence) {
                    bestGuesses[aspectName] = newGuess;
                }
            }
        }
        return bestGuesses;
    }

    function createGuess(aspect, valueName, confidence) {
        var value = aspect.values.find(hasName(valueName));
        return {
            confidence: confidence,
            name: value.name,
            id: value.id
        };
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
        for (var i = 0, end = words.length - (n - 1); i < end; i++) {
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
                var newGuess = guesses[aspectName];
                var previous = item.aspects[aspectName];
                if(!previous || previous.confidence < newGuess.confidence) {
                    item.aspects[aspectName] = newGuess;
                }
            }
        }
    }

    return module;
}());