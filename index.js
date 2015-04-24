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
      if (decl.prev() && decl.prev().prop === decl.prop && decl.value.indexOf("rgba") === decl.prev().value.indexOf("#")) {
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
  var start = string.indexOf("rgba")
  var index = start + 4
  var end
  var result

  if (index !== -1) {
    while (string[index] == 0) {
      index += 1
    }

    if (string[index] === "(") {
      index += 1
      end = string.indexOf(')', index);
      if (end > -1) {
        end += 1
        // pop transparency
        result = string.substring(index, end).split(",").slice(0, -1).map(function(item) {
          // convert to hex
          var hex = Number(item.trim()).toString(16).toUpperCase()
          // correct double-char value
          return hex.length === 1 ? hex + hex : hex
        }).join("")

        return string.substring(0, start) + "#" + result + string.substring(end)
      }
    }
  }
}
