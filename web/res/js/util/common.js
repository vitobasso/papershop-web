
function identity(object) {
    return object;
}

function getId(object) {
    return object.id;
}

function getName(object) {
    return object.name;
}

function notEmpty(array) {
    return array && array.length > 0;
}

function idOnly(object){
    if(object){
        return {
            id: object.id
        }
    }
}

function hasId(id){
    return obj => obj.id == id
}

function hasName(name){
    return obj => obj.name == name
}

//////////////////////////////////////////////////////////////////

function mapAsObject(array, keyFunction) {
    var result = {};
    for (var i = 0, elm; elm = array[i]; i++) {
        var key = keyFunction(elm);
        result[key] = elm;
    }
    return result;
}

//TODO move to own file
//TODO use lib?
//https://github.com/KyleAMathews/deepmerge
//https://github.com/unclechu/node-deep-extend
function mergeObjects(oldObj, newObj) {
    _.keys(newObj).forEach(function(key){
        var oldProp = oldObj[key];
        var newProp = newObj[key];
        if(shouldMerge(oldProp, newProp)){
            Array.isArray(oldProp)? mergeArrays(oldProp, newProp, getId) : mergeObjects(oldProp, newProp);
        } else {
            oldObj[key] = newProp;
        }
    });
}

function shouldMerge(a, b){
    return typeof a == 'object'
        && typeof b == 'object'
        && Array.isArray(a) == Array.isArray(b)
}

function mergeArrays(oldArray, newArray, getId) {
    newArray.forEach(newItem => {
        var oldFound = oldArray.find(oldItem => getId(oldItem) == getId(newItem));
        oldFound? mergeObjects(oldFound, newItem) : oldArray.push(newItem)
    });
}

//////////////////////////////////////////////////////////////////

function assert(bool, msg) {
    if(!bool) {
        throw msg? msg : "Assertion failed"
    }
}