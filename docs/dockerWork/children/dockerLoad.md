# 将docker镜像进行打包
   docker save -o nodejs-zhangyanan28.tar nodejs-cdnpub:v1

   nodejs-zhangyanan28.tar #打包后的镜像的名字
   nodejs-cdnpub:v1 # 需要打包的镜像[REPOSITORY]:[TAG]

   docker加载 tar包
   docker load -i nodejs-zhangyanan28.tar

   docker images #查看镜像是否加载完成

五、保存修改过的镜像 (执行下面commit 操作的时候容器必须是运行状态，否则失败)
   docker commit -a "zhangyanan28" -m "test gcc update" eba9e8d749fb  nodejs-test:v1   
   -a 打包作者 zhangyanan28
   -m 打包描述 test gcc update
   eba9e8d749fb 镜像ID
   nodejs-test:v1 新镜像的名字 [REPOSITORY]:[TAG]
   