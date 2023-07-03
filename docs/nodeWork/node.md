# linux日常使用


#### 日常命令

```text
kill -9 pid 根据pid来杀死指定的进程,用来处理端口占用的情况

grep -rn 'keyworld' [path] 递归查找当前文件夹下面的 包含关键字符串的文件

netstat -tlunp 80  查看当前端口占用情况 mac 会异常

which nginx 查看安装包可执行文件的路径

whereis nginx 查看软件包安装路径

whoami 查看当前系统的运行账户

ls | grep 'keyworld' 使用管道将展示的文件进行过滤

cat -n file 查看文件并显示行号

npm config list 查看ngixn的配置信息

md5sum file 用来计算文件的md5值

stat 查看文件的详细信息 创建时间、修改时间

locate 特定字符串 用于搜索整个电脑包含特定字符串的文件
```


#### 系统空间不够查看占用情况

> [参考文档](https://www.cnblogs.com/insane-Mr-Li/p/11209345.html)

1、df -h 命令查看整体磁盘使用情况
```text
➜  ~ df -h           
Filesystem       Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1s6s1  466Gi   11Gi  180Gi     6%  356091 1882564920    0%   /
devfs           205Ki  205Ki    0Bi   100%     710          0  100%   /dev
/dev/disk1s3    466Gi  3.4Gi  180Gi     2%    1179 1882564920    0%   /System/Volumes/Preboot
/dev/disk1s5    466Gi   31Gi  180Gi    15%      31 1882564920    0%   /System/Volumes/VM
/dev/disk1s7    466Gi   60Mi  180Gi     1%     713 1882564920    0%   /System/Volumes/Update
/dev/disk1s2    466Gi  229Gi  180Gi    57% 8028902 1882564920    0%   /System/Volumes/Data
map auto_home     0Bi    0Bi    0Bi   100%       0          0  100%   /System/Volumes/Data/home
/dev/disk2s2    2.4Gi  2.3Gi  177Mi    93%    8881 4294958398    0%   /Volumes/WPS Office
/dev/disk3s1    678Mi  446Mi  232Mi    66%      30 4294967249    0%   /Volumes/网易MuMu下载器
/dev/disk4s1    1.2Gi  1.1Gi  131Mi    90%    9400 4294957879    0%   /Volumes/WeCom_for_mac
/dev/disk1s6    466Gi   11Gi  180Gi     6%  355384 1882564920    0%   /System/Volumes/Update/mnt1
```

2、 使用 du -ah --max-depth=1  /(指定要查看的目录)    可以查看根目录下各个文件占用情况
```text
[root@JZJG-T-CDNJTZYFBPT-FE-CDN-TEST-002 ~]# du -ah --max-depth=1 /neworiental/
483M	/neworiental/jenkins_home
```

3、用find 命令找到当前目录大于500M文件  find . -size +500M

```text
➜  nodeWork find . -size +10M 
./viteCdnWork/vitecdn/node_modules/typescript/lib/tsserverlibrary.js
./viteCdnWork/vitecdn/node_modules/typescript/lib/typescript.js
./viteCdnWork/vitecdn/node_modules/typescript/lib/typescriptServices.js
./viteCdnWork/vitecdn/node_modules/typescript/lib/tsserver.js
./viteCdnWork/node_modules/canvas/build/Release/librsvg-2.2.dylib
./viteCdnWork/node_modules/node-sass/build/Release/sass.a
```

4、find / -type f -size +10000000c -exec du -sh {} \; 查找跟目录下大于10M的文件


5、lsof -n | grep deleted  (查看删除占用)


#### 端口占用情况

1、lsof -i:port 、netstat -nlap | grep port


#### 文本查找
1、grep -rn '关键字' 位置
```text
➜  mock grep -rn 'node_modules' ./
.//node_modules/mockjs/bower.json:8:    "node_modules",
.//node_modules/commander/package.json:24:  "_where": "/Users/zyn/nodeWork/mock/node_modules/mockjs",
.//node_modules/commander/package.json:78:      "/node_modules/"
```
#### 文件压缩处理
```text
tar 

解包：tar xvf FileName.tar
打包：tar cvf FileName.tar DirName
（注：tar是打包，不是压缩！）

.gz
解压1：gunzip FileName.gz
解压2：gzip -d FileName.gz
压缩：gzip FileName

.tar.gz 和 .tgz
解压：tar zxvf FileName.tar.gz
压缩：tar zcvf FileName.tar.gz DirName

.bz2
解压1：bzip2 -d FileName.bz2
解压2：bunzip2 FileName.bz2
压缩： bzip2 -z FileName

.tar.bz2
解压：tar jxvf FileName.tar.bz2
压缩：tar jcvf FileName.tar.bz2 DirName

.bz
解压1：bzip2 -d FileName.bz
解压2：bunzip2 FileName.bz
压缩：未知

.tar.bz
解压：tar jxvf FileName.tar.bz
压缩：未知

.Z
解压：uncompress FileName.Z
压缩：compress FileName

.tar.Z
解压：tar Zxvf FileName.tar.Z
压缩：tar Zcvf FileName.tar.Z DirName

.zip
解压：unzip FileName.zip
压缩：zip FileName.zip DirName

.rar
解压：rar x FileName.rar
压缩：rar a FileName.rar DirName
```
