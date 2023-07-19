# scp 使用
```code
一、确保当前本地环境于线上服务器环境都已经存在.ssh目录(如果不存在百度生成即可)

二、本地上传数据到服务器 (执行命令环境本地)
   1、将本地.ssh/id_rsa.pub (公钥复制到服务器 .ssh/authorized_keys 里面,如果文件不存在新建即可)
   2、本地进行scp的时候需要加载本地 .ssh中的私钥，以此来进行身份校验
    2.1、当前路劲
        /Users/zyn/.ssh // 本地
    2.2、将本地文件推送至远端服务器
        // 下面命令只能在本地的.ssh 文件中执行 其中 id_rsa // 表示本地的私钥文件，也可以通过路径加载  
        scp  -i id_rsa 本地文件   服务器地址  
        scp -i id_rsa /Users/zyn/Work/nginx/6872309__staff.xxx.cn_nginx.tar.gz root@xx.xx.x.xxx:/usr/local/nginx/conf/  (注意这里执行命令的路径是在本地.ssh目录里面)
        // 下面命令可以在任何路径下执行
        scp -i /Users/zyn/.ssh/id_rsa /Users/zyn/Work/nginx/6872309__staff.xxx.cn_nginx.tar.gz root@xx.xx.x.xxx:/usr/local/nginx/conf/  (注意这里执行命令的路径是在本地.ssh目录里面)

三、将服务器数据下载到本地可以采用于上面相反的方式(即scp的顺序进行交换即可)
   1、将服务器的文件下载到本地 (id_rsa)和第二步用法一致
     scp  -i id_rsa 服务器文件地址   本地地址
     scp -i id_rsa  root@10.15.4.201:/usr/local/nginx//conf/nginx.conf  ./     


// 服务之间的测试
root@iZ2ze2c9yl4bmii58nqxi0Z .ssh]# scp -i  id_rsa /data/kubewps/kwhealth/kwhealth_report_2022-01-23-02-03-13.zip root@10.15.5.xx:/tmp
```