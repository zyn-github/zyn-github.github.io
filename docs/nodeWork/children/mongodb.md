```text
一、Mac OSX 平台安装 MongoDB
参考

// 下载地址 https://www.mongodb.com/try/do
// 安装参考地址 https://www.runoob.com/mongodb/mongodb-osx-install.html

一、brew tap mongodb/brew

// 安装之前确保在 /usr/local/var/log 文件夹有读写权限
// @ 符号后面的 4.4 是最新版本号。
二、brew install mongodb-community@4.4

// 安装信息

配置文件：/usr/local/etc/mongod.conf
日志文件路径：/usr/local/var/log/mongodb
数据存放路径：/usr/local/var/mongodb
三、开始、停止、后台开启

brew services start mongodb/brew/mongodb-community
brew services stop mongodb/brew/mongodb-community

mongod --config /usr/local/etc/mongod.conf --fork // 后台开子进程开启
// 子进程开启之后如果需要关闭 可以进入 mongo shell 控制台来实现

// db.adminCommand({ “shutdown” : 1 })

四、通过终端进行命令行操作
cd /usr/local/bin
./mongo
Eg：

```