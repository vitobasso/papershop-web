
Array.prototype.chunk = function (chunkSize) {
    var array = this;
    return [].concat.apply([],
        array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
    );
};

Array.prototype.pushAll = function (array) {
    this.push.apply(this, array);
};

Array.prototype.find = function (test, ctx) {
    var result = null;
    var array = this;
    this.some(function (element, i) {
        if (test(element, i, array, ctx)){
            result = element;
            return true;
        } else {
            return false;
        }
    });
    return result;
};

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

Array.prototype.count = function(predicate) {
    return this.filter(predicate).length;
};

//////////////////////////////////////////////////////////////////

toUTC = function(datetime) {
    var millis = datetime.getTime() + (datetime.getTimezoneOffset() * 60000);
    return new Date(millis);
};

toLocal = function(utc) {
    var localOffset = new Date().getTimezoneOffset() * 60000;
    var millis = utc.getTime() - localOffset;
    return new Date(millis);
};

getDate = function(datetime) {
    return datetime.setHours(0,0,0,0);
};

addMinutes = function(datetime, value) {
    return new Date(datetime.getTime() + value*60*1000);
};

addHours = function(datetime, value) {
    return new Date(datetime.getTime() + value*60*60*1000);
};

addDays = function(datetime, value) {
    return new Date(datetime.getTime() + value*24*60*60*1000);
};