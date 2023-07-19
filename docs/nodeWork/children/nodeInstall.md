# linux安装node
一、下载node安装包到本地 
     wget https://nodejs.org/dist/v9.3.0/node-v9.3.0-linux-x64.tar.xz
二、解压及重命名
    tar -xf node-v9.3.0-linux-x64.tar
    mv node-v9.3.0-linux-x64 node-v9.3.0  
三、添加环境变量
    export NODE_HOME=/usr/local/node-v9.3.0/bin
    export PATH=$PATH:$NODE_HOME  
四、检测安装
    node -v && npm -v     

五、编辑profile
    vim /etc/profile
    # 在文件最后添加
    PATH=$PATH:/usr/local/node-v9.3.0/bin
    export PATH   
六、重新启动 profile
    source /etc/profile        