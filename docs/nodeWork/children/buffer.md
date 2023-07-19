# 使用buffer来存储数据的好处
```code
// 使用buffer来存储数据的好处，
// eg 存在一个学生考试成绩的数据库，每条的记录如下 

// 学号       课程代码       分数
// XXXXXX     XXXX         XX

// 其中学号是 六位数字、课程代码是一个4位数字，分数最高是100

// 在使用文本进行存储的时候,例如CSV

// 1000001,1001,99
// 1000002,1001,99

// 上面的每条记录存储需要占用15个字节
// 普通存储
const fs = require('fs');
const a1 = Buffer.from('254');
console.log(a1.length, '普通254储占用字节数')
console.log(a1.toString(), '读取原始值')
// 大端存储法
const a2 = Buffer.alloc(1);

a2.writeUint8(254, 0, 1)
console.log(a2.length, '大端存254储占用字节数')
console.log(a2.readUint8(0, 1), '读取原始值')



// 模拟数据
const mock = [
    { number: 100001, lesson: 1001, score: 99 },
    { number: 100002, lesson: 1001, score: 100 },
    { number: 100003, lesson: 1001, score: 90 },
    { number: 100004, lesson: 1001, score: 1 },
    { number: 100005, lesson: 1001, score: 29 },
]

// 采用二进制进行存储

function writeListToBuf(buf, offest, element) {
     // 存储学号  3个字节
     buf.writeUintBE(element.number, offest, 3);
     // 存储课程号 2个字节即 16位二进制
     buf.writeUInt16BE(element.lesson, offest + 3)
     // 存储成绩 1个字节 即 8位二进制
     buf.writeInt8(element.score, offest + 5)
}
function readListForBuf(buf, offest) {
    return {
        number: buf.readUintBE(offest, 3),
        lesson: buf.readUint16BE(offest + 3),
        score: buf.readInt8(offest + 5)
    }
}



function main() {
    const buf = Buffer.alloc(mock.length * 6);
    let offest = 0;
    for (let index = 0; index < mock.length; index++) {
        const record = mock[index];
        writeListToBuf(buf, offest, record);
        offest += 6;
    }
    const bh = fs.readFileSync('list.db');
    // bh.write(buf)
    // bh.end(()=> {
    //     console.log(fs.readFileSync('./list.db'), '=======>>>');
    // })
    // console.log('存储buffer数据是：', buf);
    // 这里不能比较 fs.readFileSync('./list.db') === buf  因为内存地址不同所以是false
    console.log(fs.readFileSync('./list.db'), '=======>>>');


    // 将buf还原成数据
    let roffest = 0;
    const list = [];
    const ref = fs.readFileSync('./list.db');
    while(roffest< ref.length) {
        list.push(readListForBuf(ref, roffest))
        roffest += 6
    }
    console.log('将buffer数据还原成json：', list);
}


main();




```