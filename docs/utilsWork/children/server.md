# 服务器工具类

> 批量下载node版本校验Hash值

```code
const urllib = require('urllib');
const fs = require('fs');
const util = require('util');


async function getNodeSha256(version, name) {
    return new Promise(async (resolve, reject) => {
        const sb = [];
        const { res } = await urllib.curl(`https://nodejs.org/dist/${version}/SHASUMS256.txt`, {
            rejectUnauthorized: false,
            streaming: true,
            method: 'GET'
        }).catch(e => reject(e && e.message));
        res.on('error', e => reject(e && e.message));
        res.on('data', chunk => {
            sb.push(chunk);
        });
        res.on('close', () => {
            const s = Buffer.concat(sb).toString();
            const rs = {};
            if (s) {
                s.split('\n').forEach(v => {
                    const b = v.replace(/\s+/, '_$_').split('_$_');
                    if (b[1] && b[0]) {
                        rs[b[1]] = b[0];
                    }
                });
            }
            fs.writeFileSync('./hash/' + name, JSON.stringify(rs), { encoding: 'utf-8' });
            resolve(rs);
        });
    });
}

async function main() {
    const supportNode = 'v14.15.0,v14.15.1,v14.15.2,v14.15.3,v14.15.4,v14.15.5,v14.16.0,v14.16.1,v14.17.0,v14.17.1,v14.17.2,v14.17.3,v14.17.4,v14.17.5,v14.17.6,v14.18.0,v14.18.1,v14.18.2,v14.18.3,v14.19.0,v14.19.1,v14.19.2,v14.19.3,v14.2.0,v14.20.0,v14.20.1,v14.21.0,v14.21.1,v14.21.2,v14.21.3,v14.3.0,v14.4.0,v14.5.0,v14.6.0,v14.7.0,v14.8.0,v14.9.0,v15.0.0,v15.0.1,v15.1.0,v15.10.0,v15.11.0,v15.12.0,v15.13.0,v15.14.0,v15.2.0,v15.2.1,v15.3.0,v15.4.0,v15.5.0,v15.5.1,v15.6.0,v15.7.0,v15.8.0,v15.9.0,v16.0.0,v16.1.0,v16.10.0,v16.11.0,v16.11.1,v16.12.0,v16.13.0,v16.13.1,v16.13.2,v16.14.0,v16.14.1,v16.14.2,v16.15.0,v16.15.1,v16.16.0,v16.17.0,v16.17.1,v16.18.0,v16.18.1,v16.19.0,v16.19.1,v16.2.0,v16.3.0,v16.4.0,v16.4.1,v16.4.2,v16.5.0,v16.6.0,v16.6.1,v16.6.2,v16.7.0,v16.8.0,v16.9.0,v16.9.1,v17.0.0,v17.0.1,v17.1.0,v17.2.0,v17.3.0,v17.3.1,v17.4.0,v17.5.0,v17.6.0,v17.7.0,v17.7.1,v17.7.2,v17.8.0,v17.9.0,v17.9.1,v18.0.0,v18.1.0,v18.10.0,v18.11.0,v18.12.0,v18.12.1,v18.13.0,v18.14.0,v18.14.1,v18.14.2,v18.15.0,v18.2.0,v18.3.0,v18.4.0,v18.5.0,v18.6.0,v18.7.0,v18.8.0,v18.9.0,v18.9.1,v19.0.0,v19.0.1,v19.1.0,v19.2.0,v19.3.0,v19.4.0,v19.5.0,v19.6.0,v19.6.1,v19.7.0,v19.8.0'.split(',');
    for (let i = 0; i < supportNode.length; i++) {
        const v = supportNode[i];
        const name = `node-${v}-linux-x64.json`;
        console.log(`-------->>>>开始下载HASH${name}`, i);
        await getNodeSha256(v, name);
        console.log(`-------->>>>开始下载HASH${name}完成\n\n\n`, i, supportNode.length);
    }
}

main();

```

> 批量下载node安装包
```code
const urllib = require('urllib');
const fs = require('fs');
const util = require('util');


async function downloadFile(src, out, pkg) {
    return new Promise(async (resolve, reject) => {
        const handerError = err => {
            const noZipPkg = out.replace(/\.tar\.gz$/, '');
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(err.message);
        };
        const ws = fs.createWriteStream(out, { flags: 'w' });
        const { headers, res } = await urllib.curl(src, {
            rejectUnauthorized: false,
            streaming: true,
            method: 'GET'
        }).catch(err => handerError(err));
        const len = parseInt(headers['content-length'], 10);
        let size = 0;
        res.on('error', err => handerError(err));
        res.on('data', chunk => {
            size += chunk.length;
            process.stdout.write(util.format(`download ${pkg} progress is: %s %s/%s`, ((size / len) * 100).toFixed(2) + '%', size, len));
            process.stdout.write('\r');
            ws.write(chunk);
        });
        res.on('close', () => {
            ws.close();
            resolve(true);
        });
    });
}

async function main() {
    const supportNode = 'v14.15.0,v14.15.1,v14.15.2,v14.15.3,v14.15.4,v14.15.5,v14.16.0,v14.16.1,v14.17.0,v14.17.1,v14.17.2,v14.17.3,v14.17.4,v14.17.5,v14.17.6,v14.18.0,v14.18.1,v14.18.2,v14.18.3,v14.19.0,v14.19.1,v14.19.2,v14.19.3,v14.2.0,v14.20.0,v14.20.1,v14.21.0,v14.21.1,v14.21.2,v14.21.3,v14.3.0,v14.4.0,v14.5.0,v14.6.0,v14.7.0,v14.8.0,v14.9.0,v15.0.0,v15.0.1,v15.1.0,v15.10.0,v15.11.0,v15.12.0,v15.13.0,v15.14.0,v15.2.0,v15.2.1,v15.3.0,v15.4.0,v15.5.0,v15.5.1,v15.6.0,v15.7.0,v15.8.0,v15.9.0,v16.0.0,v16.1.0,v16.10.0,v16.11.0,v16.11.1,v16.12.0,v16.13.0,v16.13.1,v16.13.2,v16.14.0,v16.14.1,v16.14.2,v16.15.0,v16.15.1,v16.16.0,v16.17.0,v16.17.1,v16.18.0,v16.18.1,v16.19.0,v16.19.1,v16.2.0,v16.3.0,v16.4.0,v16.4.1,v16.4.2,v16.5.0,v16.6.0,v16.6.1,v16.6.2,v16.7.0,v16.8.0,v16.9.0,v16.9.1,v17.0.0,v17.0.1,v17.1.0,v17.2.0,v17.3.0,v17.3.1,v17.4.0,v17.5.0,v17.6.0,v17.7.0,v17.7.1,v17.7.2,v17.8.0,v17.9.0,v17.9.1,v18.0.0,v18.1.0,v18.10.0,v18.11.0,v18.12.0,v18.12.1,v18.13.0,v18.14.0,v18.14.1,v18.14.2,v18.15.0,v18.2.0,v18.3.0,v18.4.0,v18.5.0,v18.6.0,v18.7.0,v18.8.0,v18.9.0,v18.9.1,v19.0.0,v19.0.1,v19.1.0,v19.2.0,v19.3.0,v19.4.0,v19.5.0,v19.6.0,v19.6.1,v19.7.0,v19.8.0'.split(',');
    for (let i = 0; i < supportNode.length; i++) {
        const v = supportNode[i];
        const name = `node-${v}-linux-x64.tar.gz`; // 每个平台对应的版本不同 mac->drawin linux-linux
        console.log(`-------->>>>开始下载${name}`);
        await downloadFile(`https://nodejs.org/download/release/${v}/${name}`, `./db/${name}`, name);
        console.log(`-------->>>>开始下载${name}完成\n\n\n`);
    }
}

main();

```
