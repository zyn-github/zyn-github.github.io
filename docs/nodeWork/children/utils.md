#### nodejs中的工具集合

> 1、util.callbackify(original)

|  参数   | 类型  | 描述  |
|  ----  | ----  | ----  |
| original  | Function | async 异步函数 |
| Returns  |  Function | 传统回调函数 |

将一个异步函数包装成，符合node风格的错误优先的函数
```code
const util = require('util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```

> 2、util.debuglog(section)

|  参数   | 类型  | 描述  |
|  ----  | ----  | ----  |
| section  | String | 一个字符串，指定要为应用的哪些部分创建 debuglog 函数 |
| Returns  |  Function | 日志函数 |

util.debuglog 用来创建一个函数，基于 NODE_DEBUG 环境变量的存在与否有条件地写入调试信息到 stderr。 如果 section 名称在环境变量的值中，则返回的函数类似于 console.error()。 否则，返回的函数是一个空操作。

```code
const util = require('util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);

// 只有在程序中加上 NODE_DEBUG=foo 才会输出日志信息, NODE_DEBUG 环境变量中可指定多个由逗号分隔的 section 名称。 例如：NODE_DEBUG=fs,net,tls。
 NODE_DEBUG=foo node test.node.js 
```