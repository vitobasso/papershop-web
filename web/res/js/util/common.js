
function identity(object) {
    return object;
}

function getId(object) {
    return object? object.id : undefined;
}

function getName(object) {
    return object? object.name : undefined;
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
    return obj => obj? obj.id == id : false;
}

function hasName(name){
    return obj => obj? obj.name == name : false;
}

function equals(another){
    return obj => obj? obj == another : false;
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

//////////////////////////////////////////////////////////////////

function assert(bool, msg, hasObjectToLog, obj) {
    if(!bool) {
        if(!msg) msg = "Assertion failed"
        if(hasObjectToLog) console.error(msg, obj)
        throw msg
    }
}