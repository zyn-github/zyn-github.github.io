#### nginx log 日志级别以及定义

> 两种日志的（access.log、error.log）

```text
which nginx # 查看nginx的安装位置
➜  zyn-github.github.io git:(master) ✗ whereis nginx
nginx: /usr/local/bin/nginx /usr/local/share/man/man8/nginx.8
➜  zyn-github.github.io git:(master) ✗ which nginx  
/usr/local/bin/nginx
➜  zyn-github.github.io git:(master) ✗ cd /usr/local/nginx     
➜  nginx ls
client_body_temp conf             fastcgi_temp     html             logs             proxy_temp       sbin             scgi_temp        uwsgi_temp
# logs 默认存放日志的地方
```

#### 定义日志格式

```text
# /usr/local/nginx/conf
cat nginx.conf


 log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

# 上述代码用来定义日志数据的展示格式                   
```

#### 开启日志记录


```code
access_log log_file log_format ;
error_log log_file log_level ; #log_file表示日志文件路径，log_level标识日志事件的安全级别。
```

```text
# 在server里面进行日志配置

server {
  listen       80;
  server_name  zyngn.test.xdf.cn;
  access_log /usr/local/nginx/logs/zyngn.test.xdf.cn.log combined; # 使用默认的日志格式 或者可以使用main 上面定义的
  access_log /usr/local/nginx/logs/zyngn.test.xdf.cn.error.log notice; # 使用默认的日志格式 或者可以使用main 上面定义的
  #access_log logs/zyngn.test.xdf.cn.log combined;
}
# 上面两个路径的定义方式一样的，只是绝对路径和相对路径的区别
```

#### Nginx错误日志的安全级别

```text
emerg：当系统不稳定时，用于紧急消息
alert：生成严重问题的警报消息。
crit：用于紧急情况下立即处理。
error：处理页面时，可能会发生错误。
warn：用于警告消息
notice：您也可以忽略的通知日志 最低级别的日志。
info：有关信息，消息
debug：指向用于调试信息的错误位置。
```


#### 针对特定的路径不进行日志记录
```text
  server {
    location = /favicon.ico {
      log_not_found off;
      access_log off;
    }
  }
location = /favicon.ico 表示当访问/favicon.ico时，
log_not_found off 关闭日志
access_log off 不记录在access.log
```

#### 日志缓存

```text
在nginx里面日志的记录是，进行文件的IO操作的，占用的系统的资源，我们可以使用开启缓存的方式来进行日志的记录的缓存
可以借助open_log_file_cache来进行配置

配置范围：
  http->将整个服务器所有网站，所有页面的日志进行缓存
  server->将某一个网站的所有页面日志，进行缓存
  location->某一个页面的日志，进行缓存

配置语法
open_log_file_cache max=1000 inactive=20s min_uses=3 valid=1m ;
                 -> max 1000 指的是日志文件的FD
                          -> inactive 活跃的时间
                                       -> min_users 3    20秒内小于3次访问的FD，就给你清掉，结合inactive 20s 的时间
                                                     -> valid检查周期
```

#### 开启rewrite日志进行rewrite调试

```code

语法: rewrite_log on | off;
默认值：rewrite_log off;
配置段：http，server，location，if

作用：由ngx_http_rewrite_module模块提供的。用来记录重写日志的，对于调试重写规则建议开启。启用时将在error log中记录notice级别的重写日志。

error_log  /data/log/nginx/error.log notice; # notice（nginx中最低级别的错误）
rewrite_log on; #开启 rewrite 日志
```