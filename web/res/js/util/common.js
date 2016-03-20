
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

//////////////////////////////////////////////////////////////////

function assert(bool, msg) {
    if(!bool) {
        throw msg? msg : "Assertion failed"
    }
}