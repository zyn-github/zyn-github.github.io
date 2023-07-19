# 资源限制

三、资源限制
1、一个docker host上会运行若干容器，每个容器都需要CPU、内存和IO资源。对于KVM、VMware等虚拟化技术，用户可以控制分配多少CPU、内存资源给每个虚拟机。
    对于容器，Docker也提供了类似的机制避免某个容器因占用太多资源而影响其他容器乃至整个host的性能。

2、解决办法,使用内存限额
   容器可使用的内存包括两部分：物理内存和swap，可以使用下面的命令来进行设置
   （1）-m或 --memory：设置内存的使用限额，例如100MB,2GB。
   （2）--memory-swap：设置内存+swap的使用限额。
    docker run -m 200M --memory-swap=300M ubuntu # 允许该容器最多使用200MB的内存和100MB的swap，默认情况下都是-1就是没有限制
    如果在启动容器时只指定 -m而不指定 --memory-swap，那么 --memory-swap默认为 -m的两倍
3、CPU限额
   默认设置下，所有容器可以平等地使用host CPU资源并且没有限制。Docker可以通过 -c或 --cpu-shares设置容器使用CPU的权重。如果不指定，默认值为1024。 