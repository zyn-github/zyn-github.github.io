# 前面记录了如何创建数据共享、这里记录下备份、恢复、迁移、销毁
    8.1、备份
        因为volume实际上是host文件系统中的目录和文件，所以volume的备份实际上是对文件系统的备份。
        可以单独创建一个镜像,同步host文件系统中共享的目录，定期进行备份就可以，可以借助git 来进行备份。
    8.2 恢复
        可以用上面备份的数据复制到共享的目录中就可以
    8.3 迁移
        如果我们想使用更新版本的Registry，这就涉及数据迁移，方法是：
            （1）docker stop当前Registry容器。
            （2）启动新版本容器并mount原有volume。
                docker run -d -p 5000:5000-v /myregistry:/var/lib/registry:latest  

    8.4 销毁
        批量销毁 docker volume rm $(docker volume ls -q)
        docker rm -v [容器id]