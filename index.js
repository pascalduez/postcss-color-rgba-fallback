/**
 * PostCSS plugin to transform rgba() to hexadecimal
 */
module.exports = function plugin() {
  return function(style) {
    style.eachDecl(function(decl) {
      if (!decl.value || decl.value.indexOf("rgba") === -1) {
        return
      }

      // if previous prop equals current prop
      // if previous prop has hexadecimal value and current prop has rgba() value
      // no need fallback
      var prev = decl.prev()
      if (prev && prev.prop === decl.prop && decl.value.indexOf("rgba") === prev.value.indexOf("#")) {
        return
      }

      var value = transformRgba(decl.value)
      if (value) {
        decl.cloneBefore({value: value});
      }
    })
  }
}

/**
 * transform rgba() to hexadecimal.
 *
 * @param  {String} string declaration value
 * @return {String}        converted declaration value to hexadecimal
 */
function transformRgba(string) {
  var start = string.indexOf("rgba(")
  var end
  var result

  if (start !== -1) {
    // slice 'rgba('
    start += 5
    end = string.indexOf(")", start)
    if (end !== -1) {
      // pop transparency
      result = string.substring(start, end).split(",").slice(0, -1).map(function(item) {
        // convert to hex
        var hex = Number(item.trim()).toString(16).toUpperCase()
        // correct double-char value
        return hex.length === 1 ? hex + hex : hex
      }).join("")

      // slice before 'rgba' and after ')'
      return string.substring(0, start - 5) + "#" + result + string.substring(end + 1)
    }
  }
}
