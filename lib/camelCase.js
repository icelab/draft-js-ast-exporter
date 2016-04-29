"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * CamelCase
 * @param  {String} str String with "under_score"
 * @return {String} UnderScore is now CamelCased
 */
function camelCase(str) {
  var capitaliseLead = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  str = str.replace(/_([a-z])/g, function (group) {
    if (group[1]) {
      return group[1].toUpperCase();
    }
  });
  if (capitaliseLead) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return str;
  }
}

exports.default = camelCase;