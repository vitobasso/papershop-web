
var AspectGuesser = (function () {
    var module = {};

    module.guessAspectsFromTitle = function (newItems) {
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