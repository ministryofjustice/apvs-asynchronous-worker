module.exports.getKeyByValue = function (enumeration, value) {
  var result = null
  Object.keys(enumeration).forEach(function (key) {
    var element = enumeration[key]
    if (typeof element === 'object' && element.value === value) {
      result = element
    }
  })
  return result
}
