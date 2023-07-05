# filesize

> [filesize](https://www.npmjs.com/package/filesize)


```code
const filesize = require('filesize');
// import { filesize } from 'filesize'

console.log(filesize(1024)); // 1.02 kB

console.log(filesize(1024 * 1024)); // 1.05 MB

console.log(filesize(1024 * 1024 * 1024)); // 1.07 GB

console.log(filesize(1024 * 1024 * 1024 * 1024)); // 1.1 TB
```

用来检测当前库适用于什么环境 CommonJS、AMD、script

```code
   (function(global) {
        // CommonJS, AMD, script tag
        if (typeof exports !== "undefined") { // 只有在node环境下才会存在
            module.exports = filesize;
        } else if (typeof define === "function" && define.amd) {
            define(() => {
                return filesize;
            });
        } else { // 浏览器环境
            global.filesize = filesize;
        }
   })(typeof window !== "undefind" ? window: global) // 区分全局对象
```
代码的详细解析，其中涉及到 指数、对数相关的概念
```code
  console.log('%s %s','1-->>', filesize(1024))
  console.log('%s %o','2-->>', filesize(1024, { output: 'object' }))
  console.log('%s %s','3-->>', filesize(1024, { spacer: '-' }))
  console.log('%s %s','4-->>', filesize(10287, { spacer: '-'})) // 值和单位之间的分隔符  [1, 'kb'].join(spacer)
  console.log('%s %s','6-->>', filesize(0))
  console.log('%s %s','7-->>', filesize(0, { unix: true })) // 返回的不需要 单位
  console.log('%s %s','8-->>', filesize(1024, { base: 2 })) 
  console.log('%s %s','9-->>', filesize(1048976))
  console.log('%s %s','10-->>', filesize(1024, {bits: true}))
  console.log(filesize.partial({spacer: '-'})(29090090))
```
```code
/**
 * filesize
 *
 * @copyright 2018 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.6.1
 */
(function (global) {
	const b = /^(b|B)$/,
		symbol = {
			iec: {
				bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"], // 位展示
				bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"] // 字节单位展示
			},
			jedec: {
				bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
				bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
			}
		},
		fullform = {
			iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
			jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
		};

	/**
	 * filesize
	 *
	 * @method filesize
	 * @param  {Mixed}   arg        String, Int or Float to transform  字符串 数字 浮点型 进行转换
	 * @param  {Object}  descriptor [Optional] Flags  配置项目
	 * @return {String}             Readable file size String  返回文件大小字符串
	 */
	function filesize (arg, descriptor = {}) {
        // debugger
		let result = [],
			val = 0,
			e, base, bits, ceil, full, fullforms, neg, num, output, round, unix, separator, spacer, standard, symbols;

		if (isNaN(arg)) {
			throw new Error("Invalid arguments");
		}

		bits = descriptor.bits === true; // 选择返回单位的类型 bits、bytes
		unix = descriptor.unix === true; // 为真会返回 没有单位的值
		base = descriptor.base || 2; // 默认基数
		round = descriptor.round !== void 0 ? descriptor.round : unix ? 1 : 2;
		separator = descriptor.separator !== void 0 ? descriptor.separator || "" : ""; // 分隔符浮点数之间的
		spacer = descriptor.spacer !== void 0 ? descriptor.spacer : unix ? "" : " "; // 用来最后确认用什么标识符组合 [1, 'kb'].join(spacer)
		symbols = descriptor.symbols || descriptor.suffixes || {};
		standard = base === 2 ? descriptor.standard || "jedec" : "jedec"; // 转换标准
		output = descriptor.output || "string"; // 输出类型
		full = descriptor.fullform === true;
		fullforms = descriptor.fullforms instanceof Array ? descriptor.fullforms : [];
		e = descriptor.exponent !== void 0 ? descriptor.exponent : -1; // 指数 取值范围是 0<= e <=symbol.jedec.length
		num = Number(arg); // 将入参转换为数字类型进行存储
		neg = num < 0; // 记录传入的值是否是小于0
		ceil = base > 2 ? 1000 : 1024; // 上限值
        // debugger



		// Flipping a negative number to determine the size
        // 如果传入的是一个负数，需要将其取反为正数 eg:  -3 翻转 3
		if (neg) {
			num = -num;
		}

		// Determining the exponent 
        // 用来确定指数
		if (e === -1 || isNaN(e)) {
            // 下面的函数返回以 x 为底 y 的对数（即 logx y）
            // 以 num 为低 ceil的对数
            // 如果a的x次方等于N（a>0，且a≠1），那么数x叫做以a为底N的对数（logarithm），记作x=loga N
            // 以 250 为低 1024 的对数
            // 参考  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/log

            // eg num = 1024 ceil = 1024 计算 1024 e 的幂运算是 1024 ,结果是 1
            // eg num = 2048 ceil = 1024 计算 1024 e 的幂运算是 1024 ,结果是 1
            // eg num = 10485760 ceil = 1024 计算 1024 e 的幂运算是 1024 ,结果是 2

            // 也就是  ceil 自身需要 连续相乘 e 次才会 接近 num , 其中 e 会决定单位 是 0 b 1 kb 2 MB 
			e = Math.floor(Math.log(num) / Math.log(ceil)); // 向下取整

			if (e < 0) {
				e = 0;
			}
		}

		// Exceeding supported length, time to reduce & multiply
        // 进行上线控制 因为 symbol 里面的单位值 最大的下标就是  8  最小是 0 
		if (e > 8) {
			e = 8;
		}
        // 0 现在是一个特例，因为字节数能被1整除
		// Zero is now a special case because bytes divide by 1
        // 下面是计算的核心逻辑
		if (num === 0) {
			result[0] = 0;
			result[1] = unix ? "" : symbol[standard][bits ? "bits" : "bytes"][e];
		} else {
            // 幂运算 Math.pow(2, e * 10) // 反向算法是 对数 Math.log
            // 根据上面算出来的 指数 确定 num 需要除以  (b、kb、mb)对应的基数值
            // e === 0 表示 输入值 在 1024 之间 单位就是 b
            // e === 1 表示 输入值 在 大于 1024 * 1 单位就是 kb
            // e === 2 表示 输入值 在 大于 1024 * 1024 单位就是 mb
            // e === 3 表示 输入值 在 大于 1024 * 1024 * 1024 单位就是 gb

            // 所以下面  num 除以 当前最大的基数 就能得出最后的结果
            var cu = (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));
			val = num / cu;
            // console.log(cu, '----show-->>>', arg, e, val)

            // debugger
			if (bits) { // 仅展示 b的单位
				val = val * 8;

				if (val >= ceil && e < 8) { // 如果 转换成 kb  之后超过了 1024 需要将单位换到下一个单位上面去
					val = val / ceil; // 计算  mb 对应的值
					e++; // 前进一个单位 kb->mb
				}
			}

			result[0] = Number(val.toFixed(e > 0 ? round : 0));
			result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];

			if (unix) {
				result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];

				if (b.test(result[1])) {
					result[0] = Math.floor(result[0]);
					result[1] = "";
				}
			}
		}

		// Decorating a 'diff'
		if (neg) {
			result[0] = -result[0];
		}

		// Applying custom symbol
		result[1] = symbols[result[1]] || result[1];

		// Returning Array, Object, or String (default)
		if (output === "array") {
			return result; // 数组的方式返回 输入1024 [1, 'kb']
		}

		if (output === "exponent") { // 以指数的方式返回 输入1024  1
			return e;
		}

		if (output === "object") {
			return {value: result[0], suffix: result[1], symbol: result[1]}; // 输入 1024 {value: 1, suffix: 'KB', symbol: 'KB'}
		}

		if (full) {
			result[1] = fullforms[e] ? fullforms[e] : fullform[standard][e] + (bits ? "bit" : "byte") + (result[0] === 1 ? "" : "s");
		}
		if (separator.length > 0) {
			result[0] = result[0].toString().replace(".", separator);
		}

		return result.join(spacer);
	}

	// Partial application for functional programming
	filesize.partial = opt => arg => filesize(arg, opt);

	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = filesize;
	} else if (typeof define === "function" && define.amd) {
		define(() => {
			return filesize;
		});
	} else {
		global.filesize = filesize;
	}
}(typeof window !== "undefined" ? window : global));

```