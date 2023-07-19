# Centos上搭建SVN服务器并实现自动同步至web目录
```text
Centos上搭建SVN服务器并实现自动同步至web目录

1.实现功能
    1.仓库存放在/var/svn,下面仓库名称，project。
    2.用户组里面包括，cmy1和cmy2两个用户。
    3.利用svn的钩子函数，将代码同步到nginx的项目里面，我的站点目录是/WebRoot/cmy

2.搭建svn环境，创建仓库
    1.安装Subversion：
        yum install -y subversion

    2、检测是否安装成功(查看svn版本号)
        svnserve --version

    3、创建版本库
        /先建目录
        mkdir /var/svn
        cd /var/svn
        //创建版本库
        svnadmin create /var/svn/project
        cd project
        //会看到自动生成的版本库文件
        conf  db  format  hooks  locks  README.txt

        至此，svn环境搭建成功。

3.创建用户组及用户：
    1、 进入版本库中的配置目录conf，此目录有三个文件： svn服务综合配置文件（svnserve.conf）、 用户名口令文件（passwd）、权限配置文件（authz）。

    2、修改权限配置文件：vim authz

        [groups]
        # harry_and_sally = harry,sally
        # harry_sally_and_joe = harry,sally,&joe
        lsgogroup = cmy1,cmy2  //添加

        //配置用户组对仓库project的权限
        [project:/]
        @lsgogroup = rw

    3、配置用户名命令文件：vim passwd

        [users]
        # harry = harryssecret
        # sally = sallyssecret
        cmy1 = ligeyihayou1
        cmy2 = ligeyihayou2

    4、配置SVN服务综合配置文件svnserve.conf

        //找到以下配置项，将前面的#号去掉，然后做相应的配置
        anon-access = none  //匿名用户访问权限:无
        auth-access = write     //普通用户访问权限:读、写
        password-db = passwd        //密码文件
        authz-db = authz        //权限配置文件
        realm = /var/svn/project    //版本库所在1

        注意：所有以上的配置项都需要顶格，即前面不能预留空格，否则报错

    5、启动svn服务：

        svnserve -d -r /var/svn
        killall svnserve //停止服务

    6、测试服务器：

        //我们在web目录测试（/WebRoot/cmy）
        cd /WebRoot/cmy
        svn co svn://localhost/project

        如果提示：Checked out revision 1.  表示checkout成功

        //添加文件

        touch index.php

        svn add index.php

        svn commit index.php -m "xx"

        提示：

        Adding         index.php
        Transmitting file data .
        Committed revision 2.           

    7.本地checkout代码

        pc安装svn客户端工具

        右键 checkout 输入svn地址 svn://xxx.xxx.xxx.xxx/project       



4.实现svn更新自动同步到web目录：

    1、在web目录中checkout版本库

        svn co svn://localhost/project /WebRoot/cmy --username cmy1(SVN账号) --password  ligeyihayou1(SVN密码)

    2.进入/var/svn/project/hooks下，建立post-commit文件：
        cp  post-commit.tmpl post-commit

        export LANG=en_US.utf8
        SVN_PATH=/usr/bin/svn
        WEB_PATH=/WebRoot/cmy
        $SVN_PATH update $WEB_PATH --username 'cmy1' --password 'ligeyihayou1' --no-auth-cache

        REPOS="$1"
        REV="$2"

        #mailer.py commit "$REPOS" "$REV" /path/to/mailer.conf

        最后一行需要注销，不然提交会报错。


        修改post-commit用户为www目录用户
            chown root:root post-commit     //我的 /WebRoot/cmy 的用户组和所有者都是root

        给post-commit 执行权限：
            chmod 755 post-commit

5.完成                

```