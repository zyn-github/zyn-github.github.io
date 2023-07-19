# vue

> Vue中对异常信息的处理

```code
let handleError = null
const utils = {
    foo(fn) {
        callWithErrorHandling(fn)
    },
    // 用户可以调用该函数注册统一的错误处理函数
    registerErrorHandler(fn) {
        handleError = fn
    }
}
function callWithErrorHandling(fn) {
    try {
        fn && fn()
    } catch (e) {
        // 将捕获到的错误传递给用户的错误处理程序
        handleError(e)
    }
}
utils.registerErrorHandler((e) => {
    console.log(e, '----->>>')
})
utils.foo(()=> {
    cv;
})
```

