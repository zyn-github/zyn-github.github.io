# AOP

```code
// const Plane = function() {}
// Plane.prototype.fire = function() {
//     console.log('普通的子弹发射')
// }

// // 下面需要创建一个装饰器的类
// const MissileDecorator = function(plane) {
//     this.plane = plane
// }

// MissileDecorator.prototype.fire = function () {
//     this.plane.fire()
//     console.log('发射导弹的例子')
// }


// const AtomDecorator = function() {
//     this.plane = plane
// }
// AtomDecorator.prototype.fire = function() {
//     this.plane.fire()
//     console.log('发射原子弹的例子')
// }


// new MissileDecorator(new Plane()).fire()

// 上面展示的装饰器的例子，就是在被装饰函数的基础之上，在他的外层添加拥有相同接口的方法，在调用的装饰类的同事也会调用，被装饰类的方法
// 这种动态给对象增加职责的方式，并没有真正的改动对象自身而是将对象放入到了另一个对象之中去了这些对象以一条链的方式进行引用，形成一个聚合对象。这些对象都拥有相同的接口（fire方法），当请求达到链中的某个对象时，这个对象会执行自身的操作，随后把请求转发给链中的下一个对象

// 因为装饰对象和他所装饰的对象拥有一致的接口，所以对使用该对象的客户来说是透明的，被装饰的对象不需要了解他被装饰过，这种透明性使得我们可以递归嵌套多个装饰者的对象


// 装饰器简单的理解是 将一个对象嵌入到另一个对象之中，相当于这个对象被另一个对象包装起来，请求随着这条链传递到所有的对象，每个条件都有处理请求的机会



// -------------------------javascript通过改写原有方法来实现-------------
// const Plane = function() {}
// Plane.prototype.fire = function() {
//     console.log('普通的子弹发射')
// }

// const plane = new Plane()
// // plane.fire()

// // 使用装饰器来处理
// const MissileDecorator = function() {
//     console.log('发射导弹的例子')
// }
// const fire = plane.fire
// plane.fire = function() {
//     fire()
//     MissileDecorator()
// }
// plane.fire()

// -------------------------javascript装饰函数-------------
// 在javascript之中，几乎一切都是对象，其中函数又被称为一等对象。js可以非常方便的给某个对象扩展属性和方法，但是很难再不改变哈函数的情况下给函数增加一些额外的功能，在代码的运行期间我们很难再函数中切入自己的逻辑

// 要想被某个函数增加功能最简单的方式就是修改，这个函数但是这个是最差的办法，直接违反了开放封闭的原则

 var a = function() {
    console.log(1)
}

// 修改的方式，简单粗暴
var a = function() {
    console.log(1)
    console.log(2)
}

// 在很多的时候我们是不希望动用原来的函数的
var a = function() {
    alert(1)
}

var _a = a;

a = function() {
    _a()
    alert(2)
}

Function.prototype.after = function(afterFn) {
    const _this = this; // 保留当前调用函数
    return function() { // 返回新的函数重新调用
        const ret = _this.apply(this, arguments)
        afterFn.apply(this, arguments)
        return ret;
    }
}

Function.prototype.before = function(beforeFn) {
    const _this = this; // 保留当前调用函数
    return function() { // 返回新的函数重新调用
        beforeFn.apply(this, arguments)
        return _this.apply(this, arguments)
    }
}


function log() {
    console.log('进行日志的输出');
    return 'vb'
}

log = log.after(() => {
    console.log('在日志输出之后执行了')
})

log = log.before(() => {
    console.log('在日志输出之前执行了')
})

// const r = log()
// console.log(r)

// 上述方法是在函数的原型基础之上进行扩展的



function Aop(fn, afterFn, beforeFn) {
    const _fn = fn;
    return function() {
        const arg = Array.prototype.slice.call(arguments) // 拦截参数
        arg[0] = arg[0] + ' 参数被拦截了'
        beforeFn && beforeFn.apply(this, arg)
        const ret = _fn.apply(this, arg)
        afterFn && afterFn.apply(this, arg)
        return ret
    }
}



function debug(level) {
    console.log('开始调试了', level)   
}

debug = Aop(debug, (level)=> {
    console.log('开始调试之后执行了', level)
}, (level)=> {
    console.log('开始调试之前执行了', level)
})

debug('error')


```