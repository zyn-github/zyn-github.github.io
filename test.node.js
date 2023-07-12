const util = require('util');
const debuglog = util.debuglog('foo');

async function fn() {
  setTimeout(()=> {
    return 23;
  }, 200)
  debuglog('---->>>')
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) {
    // console.log(err, '-->>')
  };
  console.log(ret);
});

// const util = require('util');

const cvb = util.deprecate(function() {
  for (let i = 0, len = arguments.length; i < len; ++i) {
    process.stdout.write(arguments[i] + '\n');
  }
}, 'util.puts: 使用 console.log 代替');

cvb()