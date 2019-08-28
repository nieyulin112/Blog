## 数据去重

```
function unique(arr) {
    return [...new Set(arr)]
}

```


## 字符串去重

```
String.prototype.unique = function () {
    var obj = {},
    str = '',
    len = this.length;
    for (var i = 0; i < len; i++) {
      if (!obj[this[i]]) {
        str += this[i];
        obj[this[i]] = true;
      }
    }
    return str;
}

去除连续的字符串

function unique(str) {
    return str.replace(/(\w)\1+/g, '$1')
}
```

## reverse底层原理和扩展


```
Array.prototype.reverse = function () {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var temp = this[i];
        this[i] = this[len - 1 - i];
        this[len - 1 - i] = temp;
    }
    return this;
}
```

## 圣杯模式的继承

```
function inherit(Target, Origin) {
    function F() {};
    F.prototype = Origin.prototype;
    Target.prototype = new F();
    Target.prototype.constructor = Target;
    // 最终的原型指向
    Target.prop.uber = Origin.prototype;
}

```

## 找出字符串中第一次只出现一次的字母

```
String.prototype.firstAppear = function () {
    var obj = {},
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (obj[this[i]]) {
            obj[this[i]]++;
        } else {
            obj[this[i]] = 1;
        }
    }
  for (var prop in obj) {

    if (obj[prop] == 1) {
        return prop;
    }
  }
}

```

## 找元素的第n级父元素


```
function parents(ele, n) {
  while (ele && n) {
      ele = ele.parentElement ? ele.parentElement : ele.parentNode;
      n--;
  }
  return ele;
}
```

## 判断元素有没有子元素

```
function hasChildren(e) {
    var children = e.childNodes,
        len = children.length;
    for (var i = 0; i < len; i++) {
        if (children[i].nodeType === 1) {
            return true;
        }
    }
    return false;
}
```


## 获取url中的参数
```
function getWindonHref() {
    var sHref = window.location.href;
    var args = sHref.split('?');
    if (args[0] === sHref) {
        return '';
    }
    var hrefarr = args[1].split('#')[0].split('&');
    var obj = {};
    for (var i = 0; i < hrefarr.length; i++) {
        hrefarr[i] = hrefarr[i].split('=');
        obj[hrefarr[i][0]] = hrefarr[i][1];
    }
    return obj;
}

```
## cookie管理

```
var cookie = {
    set: function (name, value, time) {
        document.cookie = name + '=' + value + '; max-age=' + time;
        return this;
    },
    remove: function (name) {
        return this.setCookie(name, '', -1);
    },
    get: function (name, callback) {
        var allCookieArr = document.cookie.split('; ');
        for (var i = 0; i < allCookieArr.length; i++) {
            var itemCookieArr = allCookieArr[i].split('=');
            if (itemCookieArr[0] === name) {
                return itemCookieArr[1]
            }
        }
        return undefined;
    }
}
```

## 函数柯里化

```
function curryIt(fn) {
  var length = fn.length,
      args = [];
  var result = function (arg) {
    args.push(arg);
    length--;
    if (length <= 0) {
        return fn.apply(this, args);
    } else {
        return result;
    }
  }
  return result
}
```


## 动态设置微信的title

```
function setTitle (title) {
  document.title = title
  let userAgent = window.navigator.userAgent.toLowerCase()
  let isiOS = userAgent.indexOf('applewebkit') >= 0
  let isWechat = userAgent.indexOf('micromessenger') >= 0
  if (isiOS && isWechat) {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = function () {
      setTimeout(function () {
        iframe.remove()
      }, 0)
    }
  }
}

```


## 判断移动端的设备

```
function device () {
  let isType = false
  const u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    isType = false
  } else if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    isType = true
  }
  return isType
}
```


## localStorage设值、获取值、移除和清空

```
save(key, item) {
  window.localStorage.setItem(key, JSON.stringify(item))
},
fetch(key) {
  let localStorage = window.localStorage.getItem(key)
  return localStorage ? JSON.parse(localStorage) : null
},
remove(key) {
  window.localStorage.removeItem(key)
},
clear() {
  window.localStorage.clear()
}
```


## 日期函数的处理
```
function(val, format) {
  var deFormat, formateDate, month, year, date, hours, mins, seconds
  var formats = {
    LLLL: function() {
      return `${year}年${month}月${date}日  ${hours}:${mins}`
    },
    LLL: function() {
      return `${year}年${month}月${date}日`
    },
    llll: function() {
      return `${year}.${month}.${date}  ${hours}:${mins}`
    },
    lll: function() {
      return `${year}.${month}.${date}`
    },
    LL: function() {
      return `${month}月${date}日`
    },
    mm: function() {
      return `${hours}:${mins}`
    },
    Lll: function() {
      return `${year}-${month}-${date}`
    },
    Llls: function() {
      return `${year}/${month}/${date}`
    },
    Lllss: function() {
      return `${year}/${month}/${date} ${hours}:${mins}:${seconds}`
    },
    Lllmm: function() {
      return `${year}-${month}-${date}  ${hours}:${mins}`
    }
  }
  if (!val && typeof val !== 'number') {
    return ''
  }
  deFormat = format || 'LLL'
  formateDate = new Date(val)
  year = formateDate.getFullYear()

  function changeDate(val) {
    var str = '00'
    if (val !== undefined && val !== null) {
      str = val.toString()
      str = str.length < 2 ? `0${str}` : str
    }
    return str
  }

  month = changeDate(formateDate.getMonth() + 1)
  date = changeDate(formateDate.getDate())
  hours = changeDate(formateDate.getHours())
  mins = changeDate(formateDate.getMinutes())
  seconds = changeDate(formateDate.getSeconds())
  return formats[deFormat]()
})
```


## 地址栏中删除某个参数的方法


```
/**
 * [deleteParams description]
 * @param  {[type]} url [description] 当前地址栏的url
 * @param  {[type]} ref [description] 删除参数的名字
 * @return {[type]}     [description] 返回删除参数后的url
 */
export function deleteParams (url, ref) {
  if (url.indexOf(ref) === -1) {
    return url
  }
  var arrUrl = url.split('?')
  var base = arrUrl[0]
  var arrParam = arrUrl[1].split('&')
  var index = -1
  for (var i = 0; i < arrParam.length; i++) {
    var paired = arrParam[i].split('=')
    if (paired[0] === ref) {
      index = i
      break
    }
  }
  if (index === -1) {
    return url
  } else {
    arrParam.splice(index, 1)
    return base + '?' + arrParam.join('&')
  }
}
```


## 获取地址栏参数的值

```
/**
 * [getAId description] 获取地址栏的对应属性的value
 * @param  {[type]} url  [description] 地址栏地址
 * @param  {[type]} name [description] 获取的属性名称
 * @return {[type]}      [description] 获取对应属性的值
 */
export function getUrlValue (url, name) {
  let array = []
  let nameValue
  if (url.includes('&')) {
    array = url.split('&')
    array.forEach(val => {
      if (val.indexOf(name) !== -1) {
        nameValue = val.split('=')[1]
      }
    })
  } else {
    array = url.split('?')
    array.forEach(val => {
      if (val.indexOf(name) !== -1) {
        nameValue = val.split('=')[1]
      }
    })
  }
  return nameValue
}
```
