# docker容器与HOST之间的数据共享
   Tips：Data Volume本质上是Docker Host(运行docker的机器)文件系统中的目录或文件，能够直接被mount到容器的文件系统中。

   Data Volume有以下特点
   (1) 是目录或文件，而非没有格式化的磁盘（块设备）
   (2) 容器可以读写volume中的数据
   (3) volume数据可以被永久地保存，即使使用它的容器已经销毁

   Tips：关于容器中的数据是否进行持久化存储需要，根据场景进行判断 eg:
   （1）Database软件vs Database数据。
   （2）Web应用vs应用产生的日志。
   （3）数据分析软件vs input/output数据。
   （4）Apache Server vs静态HTML文件。
   区分方式
   （1）前者放在数据层中。因为这部分内容是无状态的，应该作为镜像的一部分。
   （2）后者放在Data Volume中。这是需要持久化的数据，并且应该与镜像分开存放。

   关于Data Volume的大小在启动容器的时候，是无法设置的，大小取决于docker host 还未使用的磁盘空间大小

   Tips:docker提供了两种类型的volume:bind mount和docker managed volume。

   1、bind mount是将host上已存在的目录或文件mount到容器。容器启动的时候挂在、停止的时候卸载。

        下面讲通过在docker host里面运行nginx镜像来实现目录的挂在
        1.1、docker search ngixn # 查询使用做多的ngixn镜像，这里使用搜索出来的第一个
        1.2、docker pull docker.io/nginx # 将镜像拉取到本地docker host
        1.3、mkdir -p /usr/local/nginx/conf && mkdir -p /usr/local/nginx/workspace #创建本地挂载目录 conf 存放配置文件、workspace代码存放路径
        1.4、docker run -d -p 80:80 -v /usr/local/nginx/conf:/etc/nginx/conf.d -v /usr/local/nginx/workspace:/usr/share/nginx/html --name nginx  605c77e624dd 
        #启动nginx镜像，并挂在上面的两个目录，将启动的镜像重命名为nginx, 目录挂载可以进行多个挂载，容器端口和docker host 端口进行映射

        Tips：设置容器对虚拟目录只存在读的权限，需要在-v 的路径后面添加ro
        eg： -v /usr/local/nginx/conf:/etc/nginx/conf.d:ro 仅docker host 存在修改的权限
        优点：mount point有很多应用场景，比如我们可以将源代码目录mount到容器中，在host中修改代码就能看到应用的实时效果。再比如将MySQL容器的数据放在bind mount里，这样host可以方便地备份和迁移数据。
        缺点：bind mount的使用直观高效，易于理解，但它也有不足的地方：bind mount需要指定host文件系统的特定路径，这就限制了容器的可移植性，当需要将容器迁移到其他host，而该host没有要mount的数据或者数据不在相同的路径时，操作会失败。
   

        2、 docker managed volume
                不需要指定mount源，指明mount point就行了，挂载源是自动在 /var/lib/docker/volumes/[容器id]/_data 生成
                

上面的两者区别

Data Volume 挂载点可以随意指定、会影响挂载点（隐藏和替换）、可以支持单个文件挂载、可以设置读写权限(默认读写)、移植性弱与docker host 目录产生了绑定

docker managed volume 挂载点不能指定（/var/lib/docker/volumes）、将数据复制到挂载点、仅支持目录挂载、无法进行读写设置、移植性强 无需绑定docker host
