# 工具类(浏览器、服务器)共有部分

> 实现js异步队列刷新

借助Promise异步队列的作用,将需要多次执行的方法，收集去重，等到同步逻辑执行完毕之后再执行，在vue源码中使用到了，对于频繁修改data属性可以起到很好的，节省性能开销的作用
```javascript
    let isFlushing = false
    const queue = new Set()
    const p = Promise.resolve()
    function queueJob(job) {
        queue.add(job)
        if (!isFlushing) {
            isFlushing = true
            p.then(() => {
                try {
                    queue.forEach(job => job())
                } finally {
                    isFlushing = false
                    queue.clear = 0
                    
                }
            })
        }
    }
    function v1() {
        console.log(1)
    }
    function v2() {
        console.log(2)
    }
    queueJob(v1)
    queueJob(v1)
    queueJob(v2)
    queueJob(v2)
```

# nodejs 实现深copy

> 需要区别 for in for of的区别，for-in会遍历对象的整个原型链，性能差；而for-of只遍历当前对象，不会遍历原型链

1. for-in只是获取数组的索引；而for-of会获取数组的值
2. for-in会遍历对象的整个原型链，性能差；而for-of只遍历当前对象，不会遍历原型链
3. 对于数组的遍历，for-in会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)；for-of只返回数组的下标对应的属性值
4. for-of适用遍历数组／字符串/map/set等有迭代器对象的集合，但是不能遍历普通对象（obj is not iterable）

```code
const Util = require('util');
function extend() {
    var target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        options, name, src, copy, clone

    if (length === 1) {
        target = this
        i = 0
    }

    for (; i < length; i++) {
        options = arguments[i]
        if (!options) continue

        for (name in options) {
            src = target[name]
            copy = options[name]

            if (target === copy) continue
            if (copy === undefined) continue

            if (Util.isArray(copy) || Util.isObject(copy)) {
                if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
                if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

                target[name] = Util.extend(clone, copy)
            } else {
                target[name] = copy
            }
        }
    }

    return target
}
const ccc = extend({a:1, open:()=> 3}, {b: 2, open:()=> 4});
console.log(ccc.open()) // 4
console.log(extend({a:1}, {b: 2, a: 9})) // {a: 9, b:2}
```

# 浏览器下面的自定义事件
> Event 和 Custom 都是自定义事件，区别在于CustomEvent可传参数数据

> 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent/initCustomEvent

```code
// 监听
window.addEventListener('zyn', (e) => {
    console.log('----->>>',e,e.detail) // 因为使用的是 new Event 所以无法获取 e.detail 传入的数据
});
// 触发
document.getElementById('Click').addEventListener('click', ()=> {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/Event
    window.dispatchEvent(new Event('zyn'), { detail: 'test' });
})
// 触发
document.getElementById('Click1').addEventListener('click', ()=> {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent
    // CustomEvent 集成自 Event
    window.dispatchEvent(new CustomEvent('zyn', { detail: 'test' }));
})

try {
    new window.Event('custom')
    console.log('--1--')
} catch (exception) {
    console.log(exception, '--2--')
    window.Event = function(type, bubbles, cancelable, detail) {
        var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
        // type 事件名字 [string]
        // canBubble 事件是否沿着 dom 树向上冒泡 [boolean]
        // cancelable 事件是否可取消 [boolean]
        // detail 事件初始化时传入的数据
        event.initCustomEvent(type, bubbles, cancelable, detail)
        return event
    }
}
```

# uncaughtException

> 关于在项目中是否要使用 uncaughtException 来全局拦截错误官方给出的回答是

需要注意，如果打算使用 'uncaughtException' 事件作为异常处理的最后补救机制，这是非常粗糙的设计方式。 此事件不应该当作 On Error Resume Next（出了错误就恢复让它继续）的等价机制。 未处理异常本身就意味着应用已经处于了未定义的状态。如果基于这种状态，尝试恢复应用正常进行，可能会造成未知或不可预测的问题。

此事件的监听器回调函数中抛出的异常，不会被捕获。为了避免出现无限循环的情况，进程会以非零的状态码结束，并打印堆栈信息。

如果在出现未捕获异常时，尝试去恢复应用，可能出现的结果与电脑升级时拔掉电源线出现的结果类似 -- 10次中有9次不会出现问题，但是第10次可能系统会出现错误。

正确使用 'uncaughtException' 事件的方式，是用它在进程结束前执行一些已分配资源（比如文件描述符，句柄等等）的同步清理操作。 触发 'uncaughtException' 事件后，用它来尝试恢复应用正常运行的操作是不安全的。

想让一个已经崩溃的应用正常运行，更可靠的方式应该是启动另外一个进程来监测/探测应用是否出错， 无论 uncaughtException 事件是否被触发，如果监测到应用出错，则恢复或重启应用。