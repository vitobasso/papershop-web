/**
 * Created by Victor on 03/07/2015.
 *
 * Based on: https://github.com/lukasolson/simple-js-set/blob/master/set.js
 */

function Set(hashFunction) {
    this._hashFunction = hashFunction || JSON.stringify;
    this._values = {};
    this._size = 0;
}

Set.prototype = {
    add: function (value) {
        var key = this._hashFunction(value);
        if (!this.contains(value)) {
            this._values[key] = value;
            this._size++;
        }
    },

    addAll: function (array) {
        for (var i = 0, elm; elm = array[i]; i++) {
            this.add(elm);
        }
    },

    addMerge: function (value, mergeFunction) {
        var key = this._hashFunction(value);
        if (!this.contains(value)) {
            this._values[key] = value;
            this._size++;
        } else {
            var oldValue = this._values[key];
            mergeFunction(oldValue, value);
        }
    },

    addMergeAll: function (array, mergeFunction) {
        for (var i = 0, elm; elm = array[i]; i++) {
            this.addMerge(elm, mergeFunction);
        }
    },

    addMap: function (array, mapFunction) {
        for (var i = 0, elm; elm = array[i]; i++) {
            this.add(mapFunction(elm));
        }
    },

    remove: function (value) {
        if (this.contains(value)) {
            delete this.get(value);
            this._size--;
        }
    },

    get: function (value) {
        return this._values[this._hashFunction(value)];
    },

    contains: function (value) {
        return typeof this.get(value) !== "undefined";
    },

    size: function () {
        return this._size;
    },

    empty: function () {
        return this._size == 0;
    },

    each: function (iteratorFunction, thisObj) {
        for (var key in this._values) {
            iteratorFunction.call(thisObj, this._values[key]);
        }
    },

    toArray: function () {
        var array = [];
        var i = 0;
        for (var key in this._values) {
            array[i] = this._values[key];
            i++;
        }
        return array;
    },

    filter: function (filterFunction) {
        var array = [];
        for (var key in this._values) {
            var value = this._values[key];
            if (filterFunction(value)) {
                array.push(value);
            }
        }
        return array;
    }

};