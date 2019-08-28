var x = 0;
/**
 * [fact description] 斐波那契数列
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
function fact(n) {
  x++;
  console.log('x', x);
  if(n <= 2) {
    return 1;
  } else {
    return fact(n-1) + fact(n-2);
  }
}
fact(3);
