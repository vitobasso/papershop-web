//TODO use lib?
//https://github.com/KyleAMathews/deepmerge
//https://github.com/unclechu/node-deep-extend
var Merge = (function () {
    var module = {};

    module.mergeObjects = function (oldObj, newObj) {
        assert(typeof oldObj == 'object', "Expected an object", true, oldObj);
        assert(typeof newObj == 'object', "Expected an object", true, newObj);
        assert(!Array.isArray(oldObj), "Expected an object", true, oldObj);
        assert(!Array.isArray(newObj), "Expected an object", true, newObj);

        _.keys(newObj).forEach(function (key) {
            var oldProp = oldObj[key];
            var newProp = newObj[key];
            if (shouldMerge(oldProp, newProp)) { //2 objects or 2 arrays
                if (Array.isArray(oldProp)) {
                    module.mergeArrays(oldProp, newProp, getId)
                } else {
                    module.mergeObjects(oldProp, newProp);
                }
            } else {
                oldObj[key] = newProp;
            }
        });
    };

    function shouldMerge(a, b) {
        return typeof a == 'object'
            && typeof b == 'object'
            && Array.isArray(a) == Array.isArray(b)
    }

    module.mergeArrays = function (oldArray, newArray, getId) {
        assert(Array.isArray(oldArray), "Expected an array", true, oldArray);
        assert(Array.isArray(newArray), "Expected an array", true, newArray);

        newArray.forEach(newItem => {
            var oldFound = oldArray.find(oldItem => getId(oldItem) == getId(newItem));
            oldFound ? module.mergeObjects(oldFound, newItem) : oldArray.push(newItem)
        });
    };

    return module;
}());
