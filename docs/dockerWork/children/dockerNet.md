# docker网络
 
Docker安装时会自动在host上创建三个网络，我们可用docker network ls命令查看 
    NETWORK ID          NAME                DRIVER              SCOPE
    a3d405e98a01        bridge              bridge              local
    e155fb302a9b        host                host                local
    6718afeea40d        none                null                local

1、none网络 
   none网络就是什么都没有的网络。挂在这个网络下的容器除了lo，没有其他任何网卡。容器创建时，可以通过 --network=none指定使用none网络
   docker run -it --network=nono  ubuntu  
   疑问：上述网络的作用是什么
   封闭意味着隔离，一些对安全性要求高并且不需要联网的应用可以使用none网络，比如某个容器的唯一用途是生成随机密码，就可以放到none网络中避免密码被窃取
2、host网络
   连接到host网络的容器共享Docker host的网络栈，容器的网络配置与host完全一样。可以通过 --network=host指定使用host网络
   docker run -it --network=host  ubuntu     
   在容器中可以看到host的所有网卡，并且连hostname也是host的
   直接使用Docker host的网络最大的好处就是性能，如果容器对网络传输效率有较高要求，则可以选择host网络。当然不便之处就是牺牲一些灵活性，比如要考虑端口冲突问题，Docker host上已经使用的端口就不能再用了。Docker host的另一个用途是让容器可以直接配置host网路，比如某些跨host的网络解决方案，其本身也是以容器方式运行的，这些方案需要对网络进行配置，比如管理iptables，大家将会在后面进阶技术章节看到。

3、bridge桥接
    Docker安装时会创建一个命名为docker0的Linux bridge。如果不指定--network，创建的容器默认都会挂到docker0上
    brctl show
    bridge name	bridge id		STP enabled	interfaces
    docker0		8000.02428678936b	no		vetheed78f3