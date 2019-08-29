## apply的实现

Function.prototype.apply = function(context, arr) {
  let context = Object(context) || window
  context.fn = this
  let result
  if (!arr) {
    result = context.fn()
  } else {
    let args = []
    for(let i = 0, len = arr.length; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  }
  delete context.fn
  return result
}
