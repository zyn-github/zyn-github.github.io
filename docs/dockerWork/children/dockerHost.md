# Docker Machine 通过该docker-machine命令可以在不同的主机之上安装docker环境
    官方文档 https://docs.docker.com/desktop/
    下载包地址
        https://github.com/docker/machine/releases
    安装最新版本
        curl -L https://github.com/docker/machine/releases/download/v0.16.2/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine && chmod +x /tmp/docker-machine && sudo cp /tmp/docker-machine /usr/local/bin/docker-machine
    
    下载的执行文件被放到 /usr/local/bin中，执行docker-mahine version验证命令是否可用

    为了得到更好的体验，我们可以安装bash completion script，这样在bash中能够通过Tab键补全docker-mahine的子命令和参数。安装方法是从https://github.com/docker/machine/tree/master/contrib/completion/bash下载completion script
    下载地址 https://github.com/docker/machine/tree/master/contrib/completion/bash
    将其放置到 /etc/bash_completion.d目录下
    然后将如下代码添加到 vim ~/.bashrc
        PS1='[\u@\h \W$(__docker_machine_ps1)]\$ '
    其作用是设置docker-machine的命令行提示符，不过要等到部署完其他两个host才能看出效果。  

    9.1、创建Machine
      Tips1: 对于Docker Machine来说，术语Machine就是运行docker daemon的主机。“创建Machine”指的就是在host上安装和部署docker。
            先执行docker-machine ls查看一下当前的machine
      Tips2: 创建machine要求能够无密码登录远程主机，所以需要先通过如下命令将ssh key复制到 安装的机子
      开始创建
        docker-machine create --driver generic --generic-ip-address=172.24.28.250 host1722428250（起一个名字）