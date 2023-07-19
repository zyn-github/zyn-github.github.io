#### 子进程中切换nodejs

> 网络下载nodejs包解压、完整性校验、设置子进程node环境变量、生成 sha256、异常错误处理

工具类如下
```code
const fs = require('fs');
const util = require('util');
const urllib = require('urllib');
const childProcess = require('child_process');
const crypto = require('crypto');

async function ajaxFn(url, method, config, callback) {
    return new Promise(async (resolve, reject) => {
        const sb = [];
        const { status, headers, res } = await urllib.curl(url, {
            rejectUnauthorized: false,
            streaming: true,
            method,
            ...config
        });
        res.on('error', err => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(null);
        });
        res.on('data', chunk => {
            sb.push(chunk);
            typeof callback === 'function' && callback(chunk, headers, status);
        });
        res.on('close', () => {
            resolve({ data: Buffer.concat(sb), status, headers });
        });
    });
}


function delFileOrDir(paths, loger) {
    if (!Array.isArray(paths)) {
        paths = [paths];
    }
    for (let i = 0; i < paths.length; i++) {
        const d = paths[i];
        if (fs.existsSync(d)) {
            fs.unlinkSync(d);
            const text = `successfully deleted file ${d}`;
            typeof loger === 'function' ? loger(text) : console.log(text);
        }
    }
}

// 进行文件下载 src 目标地址、out 输出地址、文件名字，采用异步流的方式下载
async function downloadFile(src, out, pkg) {
    return new Promise(async (resolve, reject) => {
        const handerError = err => {
            const noZipPkg = out.replace(/\.tar\.gz$/, '');
            delFileOrDir([out, noZipPkg]);
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
async function decomTar(pos, cwd) {
    return new Promise((resolve, reject) => {
        const p = childProcess.exec(`tar -zxvf ${pos}`, { cwd });
        p.on('close', () => {
            resolve(true);
        });
        p.on('error', err => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false);
        });
    });
}
async function uploadBigFile(oss, localpath, targetpath, callback) {
    return new Promise((resolve, reject) => {
        oss.multipartUpload(targetpath, localpath, {
            progress(p) {
                const ts = targetpath.split('/');
                callback(`Uploading file ${ts[ts.length - 1]}, progress is ${Math.floor(p * 100)}%`);
            }
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(null);
            });
    });
}

// 进行sha256的签名校验
async function calcSha256(filepath) {
    const cv = fs.createReadStream(filepath);
    const sha256 = crypto.createHash('sha256');
    return new Promise((resolve, reject) => {
        cv.on('data', buffer => {
            sha256.update(buffer);
        });
        cv.on('close', () => {
            resolve(sha256.digest('hex'));
        });
        cv.on('error', () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(null);
        });
    });
}

// 获取node包的校验文件
async function getNodeSha256(version) {
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
            resolve(rs);
        });
    });
}
module.exports = {
    downloadFile,
    decomTar,
    uploadBigFile,
    getNodeSha256,
    calcSha256,
    delFileOrDir
};

```
核心逻辑部分
```code
const utils = require('./utils/index');
const path = require('path');
const os = require('os');
const fs = require('fs');
const RedisListFactory = require('./lib/redis');
const OSS = require('ali-oss');

let loggerNo = 1;
const _logger = (...a) => {
    console.log(`==switch versions log ${loggerNo}==>`, ...a); loggerNo++;
};


async function getOssFileHah(name, config) {
    const oss = new OSS(config.oss);
    try {
        return await oss.head(name);
    } catch (e) {
        return false;
    }
}

// 校验文件完整性，校验数据 网络获取或者 读取redis
async function fileVerification(nodeUploadLocalPath, envConfig, config, nodePkg) {

    const nodeSha256 = await utils.calcSha256(nodeUploadLocalPath);
    // 获取 sha256hash校验包的完整性
    // 查看数据库是否存储 该版本的hash
    const hashMap = await getCurrentNodeSha256(envConfig.nodeVersion, config);
    const soureSha256 = hashMap[nodePkg];
    _logger(`${nodePkg} sha256 is `, nodeSha256);
    _logger(`${nodePkg} github sha256 `, soureSha256);
    if (soureSha256 !== nodeSha256) {
        const msg = `${nodePkg} 文件已经损坏，请重试！`;
        const noZipPkg = nodeUploadLocalPath.replace(/\.tar\.gz$/, '');
        utils.delFileOrDir([nodeUploadLocalPath, noZipPkg], _logger);
        _logger(msg);
        throw new Error(msg);
    }
    _logger(`文件${nodePkg}校验成功`);
    return nodeSha256;
}


async function getCurrentNodeSha256(version, config) {
    const redisKey = `nodejs_version_${version}_sha256`;
    const clientRedis = new RedisListFactory(config.redis.client.nodes, redisKey);
    // 查看缓存是否存在
    let hash = await clientRedis.queryAll();
    hash = hash[0] || {};
    if (Object.keys(hash).length) {
        _logger(`node version ${version} HashMap 数据来源于缓存`);
        return hash;
    }
    // 从接口获取之后进行缓存
    const sha256Str = await utils.getNodeSha256(version).catch(e => {
        throw new Error(e);
    });
    await clientRedis.delItem(redisKey);
    await clientRedis.setItem(sha256Str);
    _logger(`node version  ${version} HashMap 数据来源于接口`);
    return sha256Str;
}

// 压缩包解压
const tar = async (pos, cwd, desc, callback) => {
    _logger('解压参数', pos, cwd, desc);
    const result = await utils.decomTar(pos, cwd).catch(() => {
        throw new Error(`解压${desc}异常！`);
    });
    if (result) {
        if (desc) _logger(`tar run ${desc}`);
        callback && callback();
    }
};

// 切换node 版本核心逻辑
async function switchNodeVersion(envConfig, config, nodeDir) {
    const { env } = config;
    envConfig = envConfig.shift();
    if (!envConfig) return {};
    _logger(`Check if it is installed node: nodeVersion:${envConfig ? envConfig.nodeVersion : 'null'},defaultNodeVersion:${config.defaultNodeVersion}`);
    let nodeVersion = config.defaultNodeVersion;
    let nodeUploadLocalPath = '';
    let nodeOSSPath = '';
    let nodeEnvPath = '';
    const codeEnv = env === 'local' ? 'pre' : env; // 访问本地环境进行文件下载回出现问题，所以本地使用测试环境
    if (envConfig && envConfig.nodeVersion && envConfig.nodeVersion !== config.defaultNodeVersion) {
        const ext = '.tar.gz';
        const fileName = `node-${envConfig.nodeVersion}-${os.platform()}-x64`;
        const nodePkg = fileName + ext;
        nodeVersion = envConfig.nodeVersion;
        nodeUploadLocalPath = path.resolve(nodeDir, nodePkg);
        nodeOSSPath = `${config.ossBase[codeEnv]}_vendor/node_versions/${nodePkg}`;
        // 2、检查本地是存在当前node版本,使用即可
        const isGetOss = await getOssFileHah(nodeOSSPath, config); // 确认已经完成上传
        if (!fs.existsSync(path.resolve(nodeDir, fileName))) {
            // 检查不存node包并且不存在压缩包，开启下载
            _logger(`${fileName} the runnable package does not exist`);
            const unzip = async () => {
                await fileVerification(nodeUploadLocalPath, envConfig, config, nodePkg, nodePkg);
                // 解压
                await tar(nodeUploadLocalPath, nodeDir, 'Unzip after downloading', () => {
                    _logger(`tar -zxvf ${nodePkg} is success!`);
                    nodeEnvPath = path.resolve(nodeDir, fileName, 'bin');
                });
            };
            if (!fs.existsSync(nodeUploadLocalPath)) {
                _logger(`${nodePkg} compressed package does not exist`);
                _logger(`xdfstatic hostname is ${config.cdnPMap.get(codeEnv)} codeEnv：${codeEnv}`);
                // 3、需要下载node安装包、检查是否存在于OSS，存在从oss下载，不存在官方下载
                const downloadHostOSS = config.cdnPMap.get(codeEnv).replace(/\/p$/, '/vendor');
                const url = isGetOss ? `${downloadHostOSS}/node_versions/${nodePkg}` : `https://nodejs.org/download/release/${envConfig.nodeVersion}/${nodePkg}`;
                _logger('download parameters ', downloadHostOSS, url, nodeUploadLocalPath);
                const result = await utils.downloadFile(url, nodeUploadLocalPath, nodePkg).catch(e => {
                    throw new Error(e);
                }); // 下载node包
                _logger('install node url is :', url, result ? '下载成功' : '下载失败', result);
                if (!result) {
                    const msg = `${nodePkg} 文件下载异常，请重试！`;
                    _logger(msg);
                    throw new Error(msg);
                }
                // 获取本地包的hash
                _logger(`开始对下载文件${nodePkg}完整性校验`);
                await unzip();
            } else {
                // 4、校验文件成功后 重新解压即可
                _logger(`开始对缓存文件${nodePkg}完整性校验`);
                await unzip();
            }
        } else {
            _logger(`${fileName} Already decompressed locally, env id：`, envConfig.id);
            nodeEnvPath = path.resolve(nodeDir, fileName, 'bin');
        }
        _logger(`当前${fileName}是否需要上传OSS存储：${isGetOss ? '否' : '是'}`);
        if (isGetOss) {
            nodeOSSPath = ''; // 已经上传就无需再上传了
        }
    }
    return {
        nodeVersion,
        nodeEnvPath,
        nodeOSSPath,
        updateEnvId: envConfig.id,
        nodeUploadLocalPath
    };
}
module.exports = switchNodeVersion;
```
设置node子进程的环境变量
```text
child_process.spawn(command[, args][, options])

  command <string> 要运行的命令。
  args <Array> 字符串参数列表。
  options <Object>
    cwd <string> 子进程的当前工作目录。
    env <Object> 环境变量键值对。
    argv0 <string> 显式地设置要发给子进程的 argv[0] 的值。 如果未指定，则设为 command。
    stdio <Array> | <string> 子进程的 stdio 配置。 （详见 options.stdio）
    detached <boolean> 准备将子进程独立于父进程运行。 具体行为取决于平台。（详见 [options.detached]）
    uid <number> 设置该进程的用户标识。（详见 setuid(2)）
    gid <number> 设置该进程的组标识。（详见 setgid(2)）
    shell <boolean> | <string> 如果为 true，则在一个 shell 中运行 command。 在 UNIX 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 一个不同的 shell 可以被指定为字符串。 See [Shell Requirements][] and [Default Windows Shell][]. 默认为 false（没有 shell）。
    windowsVerbatimArguments <boolean> 决定在Windows系统下是否使用转义参数。 在Linux平台下会自动忽略，当指令 shell 存在的时该属性将自动被设置为true。默认值: false。
    windowsHide <boolean> 是否隐藏在Windows系统下默认会弹出的子进程控制台窗口。 默认为: false。
```
通过借助env环境信息来配置环境变量字段
```text
console.log(process.env)
  {
    TERM: 'xterm-256color',
    SHELL: '/usr/local/bin/bash',
    USER: 'maciej',
    PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
    PWD: '/Users/maciej',
    EDITOR: 'vim',
    SHLVL: '1',
    HOME: '/Users/maciej',
    LOGNAME: 'maciej',
    _: '/usr/local/bin/node'
  }
  // process.env.PATH = process.env.PATH + '自己的环境变量'

  // 将process.env 传递到 child_process.spawn options中的env即可
```

##  linux下配置环境变量无效
```text
一、问题产生的原因如下
   在系统中设置环境变量 vim /etc/profile、vim ~/.bash_profile,完成之后执行source /etc/profile、source ~/.bash_profile生效，但是重启之后就无效了。


   分析原因是，在终端启动的时候没有使用 /etc/profile 中的环境变量无效，也就是需要自动执行一步 source /etc/profile。

   在linux下面每个终端被启动会涉及到一个自动加载的配置文件的，将上面的 source /etc/profile 添加到该配置文件中即可。

   1、查看当前所使用的终端类型。
   echo $SHELL // 返回 /bin/bash 说明使用的bash、如果mac可能是/bin/zsh，不管是什么 都会存在 vim ~/.bashrc

   bash 终端存在的是 vim ~/.bashrc
   zsh 终端存在的是 vim ~/.zshrc
   // ~/.[终端名字]rc

   在vim ~/.bashrc 添加 source /etc/profile 即可

   if [ -f /etc/bashrc ]; then
        . /etc/bashrc
        source /etc/profile
   fi
```