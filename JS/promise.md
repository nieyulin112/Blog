# promise源码详解，助力你轻松掌握promise

## 炼狱般的回调
在没有出来promise之前，为了拿到函数的回调结果，我们不得不使用callback function,这种代码的维护和理解是相当恶心了！
下面我们来看看这个恶心的回调

```
let fs = require('fs')
fs.readFile('./test.txt','utf8',function(err,data){
  fs.readFile(data,'utf8',function(err,data){
    fs.readFile(data,'utf8',function(err,data){
      console.log(data)
    })
  })
})

```
人类还是很有智慧的，终于在程序员的努力之下，我们的好对象Promise出现了，他帮我们解决了恶心的回调，消除了我们心中多年的痛，下面请欣赏promise带来高大上的代码

```
let fs = require('fs')
function readFile(url){
  return new Promise((resolve,reject)=>{
    fs.readFile(url,'utf8',function(error,data){
      error && reject(error)
      resolve(data)
    })
  })
}

readFile('./test.txt').then(data=>{
  return read(data)
}).then(data=>{
  return read(data)  
}).then(data=>{
  console.log(data)
})

```

## 走进promise的内心，让你真的更懂它

* Promise/A+
首先我们要知道自己手写一个Promise，应该怎么去写，谁来告诉我们怎么写，需要遵循什么样的规则。当然这些你都不用担心，其实业界都是通过一个规则指标来生产Promise的。让我们来看看是什么东西。传送门☞Promise/A+


* constructor
我们先声明一个类，叫做Promise，里面是构造函数。请看下面代码实现

```
class Promise{
  constructor(executor){
    //控制状态，使用了一次之后，接下来的都不被使用
    this.status = 'pendding'
    this.value = undefined
    this.reason = undefined

    //定义resolve函数
    let resolve = (data)=>{
      //这里pendding，主要是为了防止executor中调用了两次resovle或reject方法，而我们只调用一次
      if(this.status==='pendding'){
        this.status = 'resolve'
        this.value = data
      }
    }

    //定义reject函数
    let reject = (data)=>{
      if(this.status==='pendding'){
        this.status = 'reject'        
        this.reason = data
      }
    }

    //executor方法可能会抛出异常，需要捕获
    try{
      //将resolve和reject函数给使用者      
      executor(resolve,reject)      
    }catch(e){
      //如果在函数中抛出异常则将它注入reject中
      reject(e)
    }
  }
}

```
接下来，我们开始分析上面代码的作用以及底层原理

1.executor：这是实例Promise对象时在构造器中传入的参数，一般是一个function(resolve,reject){}
2.status：``Promise的状态，一开始是默认的pendding状态，每当调用道resolve和reject方法时，就会改变其值，在后面的then方法中会用到
3.value：resolve回调成功后，调用resolve方法里面的参数值
4.reason：reject回调成功后，调用reject方法里面的参数值
5.resolve：声明resolve方法在构造器内，通过传入的executor方法传入其中，用以给使用者回调
6.reject：声明reject方法在构造器内，通过传入的executor方法传入其中，用以给使用者回调

* then

then方法是Promise中最为重要的方法，他的用法大家都应该已经知道，就是将Promise中的resolve或者reject的结果拿到，那么我们就能知道这里的then方法需要两个参数，成功回调和失败回调，直接看代码

```
then(onFufilled,onRejected){  
  if(this.status === 'resolve'){
    onFufilled(this.value)
  }
  if(this.status === 'reject'){
    onRejected(this.reason)
  }
}

```


这里主要做了将构造器中resolve和reject的结果传入onFufilled和onRejected中，注意这两个是使用者传入的参数，是个方法


## 异步的Promise

之前我们只是处理了同步情况下的Promise，简而言之所有操作都没有异步的成分在内。那么如果是异步该怎么办？


* callback

最早处理异步的方法就是callback，就相当于我让你帮我扫地，我会在给你发起任务时给你一个手机，之后我做自己的事情去，不用等你，等你扫完地就会打手机给我，诶，我就知道了地扫完了。这个手机就是callback，回调函数。

首先我们需要改一下构造器里的代码，分别添加两个回调函数的数组，分别对应成功回调和失败回调。他们的作用是当成功执行resolve或reject时，执行callback。


```
//存放成功回调的函数
this.onResolvedCallbacks = []
//存放失败回调的函数
this.onRejectedCallbacks = []

let resolve = (data)=>{
  if(this.status==='pendding'){
    this.status = 'resolve'
    this.value = data
    //监听回调函数
    this.onResolvedCallbacks.forEach(fn=>fn())
  }
}
let reject = (data)=>{
  if(this.status==='pendding'){
    this.status = 'reject'        
    this.reason = data
    this.onRejectedCallbacks.forEach(fn=>fn())
  }
}

```

然后是then需要多加一个状态判断，当Promise中是异步操作时，需要在我们之前定义的回调函数数组中添加一个回调函数。
```
if(this.status === 'pendding'){
  this.onResolvedCallbacks.push(()=>{
    // to do....
    let x = onFufilled(this.value)
    resolvePromise(promise2,x,resolve,reject)
  })
  this.onRejectedCallbacks.push(()=>{
    let x = onRejected(this.reason)
    resolvePromise(promise2,x,resolve,reject)
  })
}
```
* resolvePromise

这也是Promise中的重头戏，我来介绍一下，我们在用Promise的时候可能会发现，当then函数中return了一个值，我们可以继续then下去，不过是什么值，都能在下一个then中获取，还有，当我们不在then中放入参数，例：promise.then().then()，那么其后面的then依旧可以得到之前then返回的值，可能你现在想很迷惑。我们先来看下面的代码，我逐步为你一个个的解答


```
then(onFufilled,onRejected){
    //解决onFufilled,onRejected没有传值的问题
    onFufilled = typeof onFufilled === 'function'?onFufilled:y=>y
    //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后then的resolve中捕获
    onRejected = typeof onRejected === 'function'?onRejected:err=>{ throw err ;}
    //声明一个promise对象
    let promise2
    if(this.status === 'resolve'){
      //因为在.then之后又是一个promise对象，所以这里肯定要返回一个promise对象
      promise2 = new Promise((resolve,reject)=>{
        setTimeout(()=>{
          //因为穿透值的缘故，在默认的跑出一个error后，不能再用下一个的reject来接受，只能通过try，catch        
          try{
            //因为有的时候需要判断then中的方法是否返回一个promise对象，所以需要判断
            //如果返回值为promise对象，则需要取出结果当作promise2的resolve结果
            //如果不是，直接作为promise2的resolve结果
            let x = onFufilled(this.value)
            //抽离出一个公共方法来判断他们是否为promise对象
            resolvePromise(promise2,x,resolve,reject)
          }catch(e){
            reject(e)
          }
        },0)
      })
    }
    if(this.status === 'reject'){
      promise2 = new Promise((resolve,reject)=>{
        setTimeout(()=>{
          try{
            let x = onRejected(this.reason)
            resolvePromise(promise2,x,resolve,reject)
          }catch(e){
            reject(e)
          }
        },0)
      })
    }
    if(this.status === 'pendding'){
      promise2 = new Promise((resolve,reject)=>{
        this.onResolvedCallbacks.push(()=>{
          // to do....
          setTimeout(()=>{
            try{
              let x = onFufilled(this.value)
              resolvePromise(promise2,x,resolve,reject)
            }catch(e){
              reject(e)
            }
          },0)
        })
        this.onRejectedCallbacks.push(()=>{
          setTimeout(()=>{
            try{
              let x = onRejected(this.reason)
              resolvePromise(promise2,x,resolve,reject)
            }catch(e){
              reject(e)
            }
          })
        })
      })
    }
    return promise2
  }

```



1.返回Promise？：首先我们要注意的一点是，then有返回值，then了之后还能在then，那就说明之前的then返回的必然是个Promise。
2.为什么外面要包一层setTimeout？：因为Promise本身是一个异步方法，属于微任务一列，必须得在执行栈执行完了在去取他的值，所以所有的返回值都得包一层异步setTimeout。
3.为什么开头有两个判断？：这就是之前想要解决的如果then函数中的参数不是函数，那么我们需要做处理。如果onFufilled不是函数，就需要自定义个函数用来返回之前resolve的值，如果onRejected不是函数，自定义个函数抛出异常。这里会有个小坑，如果这里不抛出异常，会在下一个then的onFufilled中拿到值。又因为这里抛出了异常所以所有的onFufilled或者onRejected都需要try/catch，这也是Promise/A+的规范。当然本人觉得成功的回调不需要抛出异常也可以，大家可以仔细想想。
4.resolvePromise是什么？：这其实是官方Promise/A+的需求。因为你的then可以返回任何职，当然包括Promise对象，而如果是Promise对象，我们就需要将他拆解，直到它不是一个Promise对象，取其中的值。



```
function resolvePromise(promise2,x,resolve,reject){
  //判断x和promise2之间的关系
  //因为promise2是上一个promise.then后的返回结果，所以如果相同，会导致下面的.then会是同一个promise2，一直都是，没有尽头
  if(x === promise2){//相当于promise.then之后return了自己，因为then会等待return后的promise，导致自己等待自己，一直处于等待
    return reject(new TypeError('循环引用'))
  }
  //如果x不是null，是对象或者方法
  if(x !== null && (typeof x === 'object' || typeof x === 'function')){
    //为了判断resolve过的就不用再reject了，（比如有reject和resolve的时候）
    let called
    try{//防止then出现异常，Object.defineProperty
      let then = x.then//取x的then方法可能会取到{then:{}},并没有执行
      if(typeof then === 'function'){
        //我们就认为他是promise,call他,因为then方法中的this来自自己的promise对象
        then.call(x,y=>{//第一个参数是将x这个promise方法作为this指向，后两个参数分别为成功失败回调
          if(called) return;
          called = true
          //因为可能promise中还有promise，所以需要递归
          resolvePromise(promise2,y,resolve,reject)
        },err=>{
          if(called) return;
          called = true
          //一次错误就直接返回
          reject(err)
        })
      }else{
        //如果是个普通对象就直接返回resolve作为结果
        resolve(x)
      }
    }catch(e){
      if(called) return;
      called = true
      reject(e)
    }
  }else{
    //这里返回的是非函数，非对象的值,就直接放在promise2的resolve中作为结果
    resolve(x)
  }
}

```



1.参数promise2（then函数返回的Promise对象），x（onFufilled函数的返回值），resolve、reject（最外层的Promise上的resolve和reject）。

2.为什么要在一开始判断promise2和x？：首先在Promise/A+中写了需要判断这两者如果相等，需要抛出异常，我就来解释一下为什么，如果这两者相等，我们可以看下下面的例子，第一次p2是p1.then出来的结果是个Promise对象，这个Promise对象在被创建的时候调用了resolvePromise(promise2,x,resolve,reject)函数，又因为x等于其本身，是个Promise，就需要then方法递归它，直到他不是Promise对象，但是x（p2）的结果还在等待，他却想执行自己的then方法，就会导致等待。

```
let x1 = new Promise((resolve,reject)=>{
  resolve()
})

let x2 = x1.then(d=>{
    return p2
})

```

3.called是用来干嘛的？：called变量主要是用来判断如果resolvePromise函数已经resolve或者reject了，那就不需要在执行下面的resolce或者reject。

4.为什么取then这个属性？：因为我们需要去判断x是否为Promise，then属性如果为普通值，就直接resolve掉，如果是个function，就是Promise对象，之后我们就需要将这个x的then方法进行执行，用call的原因是因为then方法里面this指向的问题。

5.为什么要递归去调用resolvePromise函数？：相信细心的人已经发现了，我这里使用了递归调用法，首先这是Promise/A+中要求的，其次是业务场景的需求，当我们碰到那种Promise的resolve里的Promise的resolve里又包了一个Promise的话，就需要递归取值，直到x不是Promise对象。


## promise的all和race


* all


all方法可以说是Promise中很常用的方法了，它的作用就是将一个数组的Promise对象放在其中，当全部resolve的时候就会执行then方法，当有一个reject的时候就会执行catch，并且他们的结果也是按着数组中的顺序来排放的，那么我们来实现一下。


```
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function(promises){
  let arr = []
  let i = 0
  function processData(index,data){
    arr[index] = data
    i++
    if(i == promises.length){
      resolve(arr)
    }
  }
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(data=>{
        processData(i,data)
      },reject)
    }
  })
}

```

* race
race方法虽然不常用，但是在Promise方法中也是一个能用得上的方法，它的作用是将一个Promise数组放入race中，哪个先执行完，race就直接执行完，并从then中取值。我们来实现一下吧。

```
Promise.race = function(promises){
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(resolve,reject)
    }
  })
}
```

原理大家应该看懂了，很简单，就是遍历数组执行Promise，如果有一个Promise执行成功就resolve。

## 结尾

今天给大家分析promise的基本用法，以及promise的实现和用它解决什么问题，希望大家可以更好的理解和掌握promise，是自己的技术得到进一步的提升！
