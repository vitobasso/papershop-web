/**
 * Created by Victor on 08/07/2015.
 */

function identity(object){
    return object;
}

function getId(object) {
    return object.id;
}

function getName(object) {
    return object.name;
}

function getLabel(object) {
    return object.label;
}

function getValue(object) {
    return object.value;
}

function noop() {

}

//////////////////////////////////////////////////////////////////

function mapAsObject(array, keyFunction) {
    var result = {};
    for(var i= 0, elm; elm = array[i]; i++) {
        var key = keyFunction(elm);
        result[key] = elm;
    }
    return result;
}
