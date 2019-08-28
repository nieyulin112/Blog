
var x = 0;
/**
 * [fact description] 阶乘递归函数 常规写法
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
function fact(n) {
  x++;
  console.log(x);
  if(n <= 1){
    return 1;
  } else {
    return fact(n-1) * n;
  }
}
fact(5);
/**
 * [fact description] 阶乘递归函数 精简写法
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
function fact(n) {
  var result = 0;
  result = (n <= 1 && n >= -1)? 1:fact(n-1) * n;
  return result;
};
