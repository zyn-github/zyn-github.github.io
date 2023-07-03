# promiseA

> [源码参考](https://gitee.com/ligeyihayou_admin/promise-a)

#### 介绍
自己参照promiseA+规范自定义实现promise

#### 参考资料
    Promise 中文 https://promisesaplus.com.cn/
    Promise 英文 https://promisesaplus.com

#### Promise概念

1.  Promise是一个需要使用 new 操作符创建实例的构造函数，需要传入一个函数executor作为参数，这个函数会立即执行。
2.  executor函数有两个参数，需要自己实现 resolve, reject, 用来处理成功或者是失败的操作
3.  关于状态，Promise存在三个状态
    - 等待态 peding
    - 完成态 resolved
    - 拒绝态 rejected
4.  状态的转换,只能下面两种方式转换，一单变成rejected、resolved，当前的实例状态不可在变，状态是不可逆的
    - peding->resolved
    - peding->rejected
5.  Promise通过resolved、rejected决议的内容，永远都是异步的，内部实现使用了setTimeOut,就算传入的是 resolve(23) 也会被转换为异步
    
6.  Promise通过resolve, reject转换状态之后,结果需要通过实例上面的then来获取,then接收两个函数做完参数
    - onfulfilled 成功回调函数 非必传
    - onrejected 失败回调函数 非必传
    - 非必传 因为在源码中处理了，不传递默认会一直向下传递

```
then
onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : value => value
onrejected = typeof onrejected === 'function' ? onrejected : err => { throw err }
```
7.  Promise中then方法是支持链式调用的，所以then默认会返回一个新的promise,规范文档中也有说明这个
    - onfulfilled 成功的时候执行
    - onrejected 失败的时候执行

#### 开发流程
1.  创建一个Promise类，包含一个 then方法，构造函数接收一个executor函数(并且立即执行)，该函数有两个参数 resolve, reject 也是函数，是类内部私有的实例无法访问
2.  全局定Promise需要使用的三种状态。 

```
const PENDING = "PENDING" // 等待态
const RESOLVED = "RESOLVED" // 完成态
const REJECTED = "REJECTED" // 拒绝态

class Promise {
    // 构造函数接收一个立即执行函数
    constructor(executor) {
        executor()
    }

    then() {
        
    }
}
```

3.  executor 需要传入两个方法()供自己调用来完成成功或者是失败的决策

```
const executor = (resolve, reject) => {
    if(true) {
        resolve(23) // 成功
        return
    }
    reject('我失败了') // 失败
}
const p = new Promise(executor)
```


```
  constructor(executor) {
    // 这里使用箭头函数可以避免this的执行错误问题，永远执行当前实例
    // 下面函数接收一个参数就是，调用下面两个方法时候传递的
    const resolve = (value) => {
        
    }
    
    const reject = (reason) => {
        
    }
    executor(resolve, reject)
}
```

3. 从resolve、reject两个方法中获取到用户传入的值，保存当调用then的时候进行 resolve接收到的值传递给onfulfilled(value)、reject接收到的值传递给onrejected(reason) 

4. 只要是resolve执行了Promise的状态就变成了RESOLVED，reject执行了Promise的状态就变成了REJECTED，不可在变化(默认状态是PENDING)，前面说的两种状态只能在默认状态的基础上变更

```
  constructor(executor) {
    // 这里使用箭头函数可以避免this的执行错误问题，永远执行当前实例
    // 下面函数接收一个参数就是，调用下面两个方法时候传递的

    // 将函数的返回值挂载到 实例上就可以在then中获取到
    this.value = undefined
    this.reason = undefined
    this.status = PENDING // 默认状态
    const resolve = (value) => {
        if (this.status === PENDING) {
             this.value = value
             // 修改为目标状态防止下次再进入执行
             this.status = RESOLVED
        }
    }
    
    const reject = (reason) => {
        if (this.status === PENDING) {
             this.reason = reason
             // 修改为目标状态防止下次再进入执行
             this.reason = RESOLVED
        }
    }

    executor(resolve, reject)
  }

  then(onfulfilled, onrejected) {
    // 判断当前的状态  RESOLVED 调用 onfulfilled
    // 判断当前的状态  REJECTED 调用 onrejected
    if(this.status === RESOLVED) {
        onfulfilled(this.value)
    }

    if(this.status === REJECTED) {
        onrejected(this.reason)
    }
  }  
```
5. 上述代码完成到该步骤可以已经可以正常执行了，但是只能同步的执行resolve或者是reject

```
// 自己开发的Promise
const p = new Promise((resolve, reject) => {
    if(Math.floor(Math.random() * 5) < 3) {
        resolve(23) // 这里可以不用添加return 因为就算下面执行reject因为状态 status 已经是 RESOLVED,执行reject无效
    }
    reject()
})

p.then((data)=> {
   console.log('success', data) 
}, (e)=> {
   console.log('error', e) 
})

// 注意 当前的Promise只支持直接调用 resolve(23), 如果异步调用 setTimeout(()=> resolve(23), 1000) 就无法正常执行可
// 原因 因为调用resolve是在Promise初始化传入的executor里面，现在用定时器调用，就需要等到其他的同步代码执行完了才会调用resolve，明确一点异步调用resolve时候status的状态是默认PENDING，因为在then中还没有对PENDING状态无法获取到回调函数，异步调用会在then运行完之后
// 解决 当调用then的时候检查status === PENDING, 就采用发布订阅模式将回调函数订阅起来，等到resolve执行完之后再发布订阅的函数
```

6. 借助发布订阅模式，当执行到then的时候并且状态为PENDING, 就将当前的成功回调和失败回调订阅起来(数组存储起来) ,等到resolve、reject执行的时候，在定制订阅函数执行

```
  constructor() {
      this.resolveCallbacks = [] // 存储成功态的订阅
      this.rejectCallbacks = [] // 存储失败态的订阅  
      const resolve = (value) => {
        if (this.status === PENDING) {
             this.value = value
             // 修改为目标状态防止下次再进入执行
             this.status = RESOLVED
             this.resolveCallbacks.forEach(fn=> fn()) // 通知发布
        }
    }
    
    const reject = (reason) => {
        if (this.status === PENDING) {
             this.reason = reason
             // 修改为目标状态防止下次再进入执行
             this.reason = RESOLVED
             this.rejectCallbacks.forEach(fn=> fn()) // 通知发布
        }
    }
  }  
  then(onfulfilled, onrejected) {
      if(this.status === PENDING) {
         // 防止后续在回调函数的前后添加逻辑所以这里采用AOP变成方式
         this.resolveCallbacks.push(() => { // 订阅成功回调
            // TODO....
            onfulfilled(this.value)
         })
         this.rejectCallbacks.push(() => {  // 订阅失败回调
            // TODO....
            onrejected(this.reason)
         })
      }
  }

// 上面逻辑添加完成之后当异步调用 resolve、reject, then中也能拿到数据
```

7. then 函数支持链式调用,也就是说 then执行完之后会返回一个新的Promise,用新Promise的 resolve、reject，来讲上次的值，传递给新的Promise的 resolve，这里会出现多种情况
   - 返回值 let x = onrejected(this.reason)、let x = onfulfilled(this.value)
   - x 可能是一个基础类型、可能是对象或者是函数，多以就需要对该返回值x进行判断
   - 如果x是基本类型，直接 resolve
   - 函数或者是对象：获取x.then 如果存在就执行该方法(注意可能不存在需要try catch 抛出异常)catch中直接调用reject返回错误信息即可


```
function resolvePromise(promise2, x, resolve, reject) {
    // 处理上次返回的 x 的值
    // https://promisesaplus.com/#point-48 2.3.1 如果这里的 x 和 promise2 有相同的引用地址 则需要抛出异常,否则会一直不回决议
    // If promise and x refer to the same object, reject promise with a TypeError as the reason.
    if (promise2 === x) { 
        return reject(new TypeError('会导致循环引用'))
    }
    // If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
    // 需要保证下面的  reject、resolve 只能被调用一次
    // Otherwise, if x is an object or function,
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called; // 保证下面的代码仅可以执行一次
        // 返回的是对象或者函数
        // Let then be x.then
        try {
            // If then is a function, call it with x as this
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, y=> {
                    if(called) {
                        return
                    }
                    called = true
                    // 注意这里的 y 也有可以能是 promise
                    // resolve(y)
                    resolvePromise(promise2, y, resolve, reject)// 递归处理
                }, r=> {
                    if(called) {
                        return
                    }
                    called = true
                    reject(r)
                })
            } else {
                // { then: 21 }
                resolve(x)
            }
        } catch (error) {
            if(called) {
                return
            }
            called = true
            reject(error)
        }
    } else {
        // 值类型
        resolve(x) // 直接返回
    }

}

if (this.state === REJECTED) {
            // 失败态
            setTimeout(() => {
                try {
                    const x = onrejected(this.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            }, 0)
        }
```
8. 因为Promise处理过的都会转换成异步函数，所以传递到下个then中的值的获取也全部是异步的。

```
// Promise工厂类
// 定义Promise使用的状态
// 参考 https://promisesaplus.com.cn/
/**
 * 阶段二
 *     因为 promise then 支持链式调用所以在then 里面需要返回一个Promise实例, 通过该实例中的 resolve, reject 将上次回调的函数返回值 传递到下个then中
 * 最终通过单元测试版本
 **/


function resolvePromise(promise2, x, resolve, reject) {
    // 处理上次返回的 x 的值
    // https://promisesaplus.com/#point-48 2.3.1 如果这里的 x 和 promise2 有相同的引用地址 则需要抛出异常,否则会一直不回决议
    // If promise and x refer to the same object, reject promise with a TypeError as the reason.
    if (promise2 === x) { 
        return reject(new TypeError('会导致循环引用'))
    }
    // If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
    // 需要保证下面的  reject、resolve 只能被调用一次
    // Otherwise, if x is an object or function,
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called; // 保证下面的代码仅可以执行一次
        // 返回的是对象或者函数
        // Let then be x.then
        try {
            // If then is a function, call it with x as this
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, y=> {
                    if(called) {
                        return
                    }
                    called = true
                    // 注意这里的 y 也有可以能是 promise
                    // resolve(y)
                    resolvePromise(promise2, y, resolve, reject)// 递归处理
                }, r=> {
                    if(called) {
                        return
                    }
                    called = true
                    reject(r)
                })
            } else {
                // { then: 21 }
                resolve(x)
            }
        } catch (error) {
            if(called) {
                return
            }
            called = true
            reject(error)
        }
    } else {
        // 值类型
        resolve(x) // 直接返回
    }

}


const PENDING = "PENDING" // 等待态
const RESOLVED = "RESOLVED" // 完成态
const REJECTED = "REJECTED" // 拒绝态
class Promise {
    constructor(executor) {
        // 初始化状态
        this.state = PENDING

        // 默认值
        this.value = undefined // 因为这个值需要再 resolve、reject 获取 而在 then 里面使用所以变成实例属性，这样可以跨函数作用域访问
        this.reason = undefined // 因为这个值需要再 resolve、reject 获取 而在 then 里面使用所以变成实例属性，这样可以跨函数作用域访问

        this.resolveCallbacks = [] // 存储成功态的订阅
        this.rejectCallbacks = [] // 存储失败态的订阅

        // 采用箭头函数来避免this指向的问题
        // 状态只能从 PENDING->RESOLVED、PENDING->REJECTED
        const resolve = (value) => {
            if (this.state === PENDING) {
                this.state = RESOLVED
                this.value = value // 赋值之后就不可变
                // 发布成功态的订阅
                this.resolveCallbacks.forEach(fn => fn())
            }
        }

        const reject = (reason) => {
            if (this.state === PENDING) {
                this.state = REJECTED
                this.reason = reason // 赋值之后就不可变
                // 发布成功态的订阅
                this.rejectCallbacks.forEach(fn => fn())
            }
        }


        // 立即执行这个方法
        // 高阶函数的特性、这里需要try catch 保证能够捕获异常信息
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error) // 出错之后就自动执行 reject
        }
    }

    // 接收两个函数 成功回调, 失败回调
    // 每个then 结束之后会返回一个 promise

    then(onfulfilled, onrejected) {
        // 处理 回调函数不存在的情况
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : value => value
        onrejected = typeof onrejected === 'function' ? onrejected : err => {
            throw err
        }
        // 创建一个promise，将其返回，以供下一个 then 使用
        // 将上次 onfulfilled、onrejected 的返回值，使用 resolve 传递到下个then中的成功回调中，中途出现的错误使用reject传递到下个then的失败回调中
        // 获取上一次回调的值
        // let x = onfulfilled(this.value)、onrejected(this.value)
        // x 如果是一个简单值 就直接调用 resolve ,如果还是一个promise 那就执行then 之后再进行返回
        // 添加一个方法来 处理 x 的返回状态
        // 参考 https://promisesaplus.com.cn/ 2.2.7.1
        const promise2 = new Promise((resolve, reject) => {
            // 根据状态判断来调用不同回调
            // 状态改变了、this.value必然已经被赋值了
            // 同步
            if (this.state === RESOLVED) {
                // 成功态
                // 这里的 setTimeout 可以根据不同的平台来实现
                // setTimeout or setImmediate, MutationObserver or process.nextTick 类似于 Vue 实现$nextTick采用优雅降级的方式来实现是更好的
                setTimeout(() => {
                    try {
                        const x = onfulfilled(this.value)
                        // 这里存在一个坑，代码在执行的过程中 promise2 还没有返回, 所以resolvePromise获取不到第一个参数
                        // 解决办法 将resolvePromise 放在异步中执行, 当同步代码执行完成在执行异步队列中的 resolvePromise调用
                        // 这里值得注意的事 也需要将 onfulfilled 返回值也加到异步中
                        // 注意： 因为promise中then返回的 不管是同步还是异步 都按异步处理 resolve(2) 虽然可以立即执行，但是也需要按异步处理
                        // 注意：上面的try catch 无法捕获异步代码中的异常这里需要继续 try catch， 将错误向上抛出
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }

            if (this.state === REJECTED) {
                // 失败态
                setTimeout(() => {
                    try {
                        const x = onrejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }

            // 这里需要在 PENDING 状态时候收集then的回调，当状态变为 RESOLVED、REJECTED二者之一在执行
            // 主要是在处理异步的等待
            // 采用发布订阅的模式来实现
            // 创建两个数组来存储订阅的then的回调函数
            // 处理异步
            if (this.state === PENDING) {
                // 等待态
                // onrejected(this.value)
                this.resolveCallbacks.push(() => {
                    // 采用AOP 这里可以进行额外的扩展
                    setTimeout(()=> {
                        try {
                            const x = onfulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
                this.rejectCallbacks.push(() => {
                    // 采用AOP 这里可以进行额外的扩展
                    setTimeout(()=> {
                        try {
                            const x = onrejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
            }
        })
        return promise2
    }
}

Promise.defer = Promise.deferred = function() {
    let dtd = {}
    dtd.promise = new Promise((resolve, reject)=> {
        dtd.resolve = resolve
        dtd.reject = reject
    })
    return dtd
}

module.exports = Promise
```

9. 给promise扩展简便的用法

```
Promise.defer = Promise.deferred = function() {
    let dtd = {}
    dtd.promise = new Promise((resolve, reject)=> {
        dtd.resolve = resolve
        dtd.reject = reject
    })
    return dtd
}

// 使用方式
const promise = Promise.defer()
setTimeout(() => {
    promise.resolve(34)
}, 2000)

promise.promise.then((data) => {
    console.log(data) // 34
})


```
10. 开发完成之后需要运行测试用例看是否满足promise规范, 采用npm promises-aplus-tests

```
{
  "name": "promise",
  "version": "1.0.0",
  "description": "",
  "main": "promise.js",
  "scripts": {
    "dev": "node test.promise.js",
    "test": "promises-aplus-tests promise_1.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  }
}

```
11. all race 等方法待补充