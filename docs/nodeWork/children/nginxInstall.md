# nginx在linux操作系统下安装

一、yum便捷安装
> 检查当前机器是否已经安装nginx: which nginx,如果已经安装会显示nginx可执行文件的位置 eg:/usr/sbin/nginx
```text
yum # 检查当前系统是否支持yum命令
# --installroot=/usr/local   表示指定自定义的安装目录
yum install nginx # 进行安装
```

二、查看安装信息

```code
nginx -v # 查看当前安装版本

whereis nginx # 查看安装位置
nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz /usr/share/man/man3/nginx.3pm.gz

# /usr/sbin/nginx 可执行命令的目录
# /etc/nginx 配置文件的存放目录
# /usr/share/nginx log、html默认站点目录位置
```


三、nginx配置403可能得原因

1. 由于启动用户和nginx工作用户不一致所致
   1.1 查看nginx的启动用户，发现是nginx，而为是用root启动的
   1.2 将nginx.config的user改为和启动用户一致
```text
ps aux|grep nginx # 查看nginx的运行账户
root             18417   0.0  0.0 34165100    196   ??  Ss   11:05上午   0:00.01 nginx: master process nginx -c /usr/local/nginx/conf/nginx.conf
```  
2. 缺少index.html，就是配置文件中index index.html index.htm这行中的指定的文件。
3. 权限问题，如果nginx没有web目录的操作权限，也会出现403错误。
```code
chmod -R 755 dir
``` 