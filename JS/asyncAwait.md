### async await的基本的语法

async函数返回一个 Promise 对象，可以使用then方法添加回调函数。当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```
async function getBlogs() {
  const s = await getBlog()
  return s
}
getBlgs().then(result => {
  console.log('result', result)
})
```
