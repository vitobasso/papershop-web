/**
 * Created by Victor on 03/07/2015.
 */
// https://github.com/lukasolson/simple-js-set/blob/master/set.js

function Set(hashFunction) {
    this._hashFunction = hashFunction || JSON.stringify;
    this._values = {};
    this._size = 0;
}

Set.prototype = {
    add: function add(value) {
        if (!this.contains(value)) {
            this._values[this._hashFunction(value)] = value;
            this._size++;
        }
    },

    addAll: function(array){
        for(var i=0; i<array.length; i++){
            this.add(array[i]);
        }
    },

    remove: function remove(value) {
        if (this.contains(value)) {
            delete this.get(value);
            this._size--;
        }
    },

    get: function(value) {
        return this._values[this._hashFunction(value)];
    },

    contains: function contains(value) {
        return typeof this.get(value) !== "undefined";
    },

    size: function size() {
        return this._size;
    },

    empty: function() {
        return this._size == 0;
    },

    each: function each(iteratorFunction, thisObj) {
        for (var value in this._values) {
            iteratorFunction.call(thisObj, this._values[value]);
        }
    },

    toArray: function(){
        var array = [];
        var i = 0;
        for (var value in this._values) {
            array[i] = this._values[value];
            i++;
        }
        return array;
    }

};