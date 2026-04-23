"use strict";

exports.regexVal = regexVal;
exports.regexValArr = regexValArr;

// validates an object against a template object
// obj may only contain keys from templateObj
// values must be strings that match regex values in template object
// authAlternatives: optional array of arrays of keys; obj is valid if for at least one group all keys are present and non-empty
function regexVal(templateObj, obj, authAlternatives) {
    const objKeys = Object.keys(obj);
    const objVals = Object.values(obj);
    const templateObjKeys = Object.keys(templateObj);

    // obj must not contain keys outside of templateObj
    if (!objKeys.every(item => templateObj.hasOwnProperty(item))) {
        return false;
    } // values must be of type 'string'
    else if (!objVals.every(item => typeof item == "string")) {
        return false;
    } // if authAlternatives provided, at least one group must have all keys present and non-empty
    else if (authAlternatives && !authAlternatives.some(group => group.every(key => obj[key]))) {
        return false;
    } // present values must satisfy regex
    else if (!objKeys.every(item => templateObj[item].test(obj[item]))) {
        return false;
    } else {
        return true;
    }
}

// validates an object against a template object
// keys must be identical
// values must be strings or array with strings that match regex values in template object
function regexValArr(templateObj, obj) {
    const objKeys = Object.keys(obj);
    const objVals = Object.values(obj);
    const templateObjKeys = Object.keys(templateObj);

    // lengths must be equal
    if (objKeys.length != templateObjKeys.length) {
        return false;
    } // must have the same property names
    else if (!templateObjKeys.every(item => obj.hasOwnProperty(item))) {
        return false;
    } // values must be of type 'string' or array with strings
    else if (!objVals.every(item => typeof item == "string" || (Array.isArray(item) && item.every(item => typeof item == "string")))) {
        return false;
    } // values mast satisfy regex
    else if (!templateObjKeys.every(item => Array.isArray(obj[item]) ? obj[item].every(elem =>  templateObj[item].test(elem)) : templateObj[item].test(obj[item]))) {
        return false;
    } else {
        return true;
    }
}