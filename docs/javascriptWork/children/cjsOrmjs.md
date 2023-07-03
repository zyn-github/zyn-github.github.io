# cjs、mjs区别 
```code
1、ES Module 中可以导入 CommonJS 模块
2、CommonJS 中不可以导入 ES Module 模块
3、Commonjs 始终只会导出一个默认成员

TIPS:注意 import 不是解构导出对象

4、在node环境中使用 ES Module 模块的两种方式
   4.1、将文件名称修改为 .mjs
   4.2、新建package.json ，添加 {"type": "module"},这个时候该文件夹下面的所有文件都使用ES Module语法，注意不能使用 CommonJS语法了
        eg: require、__filename __dirname,关键字，只能使用 import 来实现操作
   4.3、如果想针对部分文件使用CommonJS 可以将该文件的名字修改为 .cjs     

 在ES Model 中自己实现  __filename、__dirname
   新建文件、test.mjs
    import Value from './utils.mjs'
    console.log(Value)
    console.log('自己实现 __filename、__dirname')
    import { fileURLToPath } from 'url'
    import {dirname} from 'path'
    console.log('__filename',fileURLToPath(import.meta.url));
    console.log('__dirname',dirname(import.meta.url));
```