# 浏览器工具类

> An awesome project.

#### 1、Array.isArray() instanceof Array 区别

Array.isArray() 用于确定传递的值是否是一个 Array
```code
Array.isArray([1, 2, 3]);  
// true
Array.isArray({foo: 123}); 
// false
Array.isArray("foobar");   
// false
Array.isArray(undefined);  
// false

// 下面的函数调用都返回 true
Array.isArray([]);
Array.isArray([1]);
Array.isArray(new Array());
Array.isArray(new Array('a', 'b', 'c', 'd'))
// 鲜为人知的事实：其实 Array.prototype 也是一个数组。
Array.isArray(Array.prototype); 
 
// 下面的函数调用都返回 false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(17);
Array.isArray('Array');
Array.isArray(true);
Array.isArray(false);
Array.isArray(new Uint8Array(32))
Array.isArray({ __proto__: Array.prototype });

//当检测Array实例时, Array.isArray 优于 instanceof,因为Array.isArray能检测iframes.
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // [1,2,3]
 
// Correctly checking for Array
Array.isArray(arr);  // true
// Considered harmful, because doesn't work though iframes
arr instanceof Array; // false
```
在nodejs中检测的话可以使用 instanceof 来检查

#### 2、void 0 === undefined === true
源码涉及到 undefined 表达都会被编译成 void 0
```code
//源码
const a: number = 6
a === undefined

//编译后
"use strict";
var a = 6;
a === void 0;
```
①某些情况下用undefined判断存在风险，因undefined有被修改的可能性，但是void 0返回值一定是undefined

②兼容性上void 0 基本所有的浏览器都支持

③ void 0比undefined字符所占空间少。
