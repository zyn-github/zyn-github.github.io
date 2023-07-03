#### nginx rewrite 地址重写

> [参考文档](https://gitee.com/ligeyihayou_admin/codes/g3n1ce72swhkm50xvubt890)



```code
# nginx rewrite 实现url的重写
server {
    listen       8090;
    server_name  mapi.bjgas95.com;
    root   /Users/zyn/WebRoot/ligeyihayou/FrontStudy/dist;


    rewrite_log on;

    # 地址重写
        # 为了实现地址的标准化 (在输入 www.baidu.com 和 baidu.com 都可以访问 www.baidu.com) 这个过程叫做地址的重写实现地址标准化
    # 地址转发
        # 当访问A站点，跳转到B站点
    # 地址转发浏览器地址栏中的地址是不改变的 地址重写之后是会发生变化的
    
    # 地址转发会产生一次网络请求，地址重写之后会产生两次请求

    # 地址转发产生在同一站点内，地址重写没有限制

    # 地址转发到的页面可以不用全名路径来表示，地址重写必须使用全路径名称

    # 地址转发的速度高于 地址重写  

    # rewrite regex replacement [flag]

    # regex 使用 "()"标记要截取的内容 注意  uri 不包含接受到的主机地址
        # 正则语法('\' 后面接特殊字符) ('*' 匹配前面的字符零次或者多次)('. 匹配除“\n”之外的所有单个字符')('$' 匹配输入字符串的结束位置)('^' 匹配输入字符串的起始位置)('+' 匹配前面字符串一次或者多次) ('?' 匹配前面字符串的零次或者一次)

        # flag (last, 本条规则匹配完成后继续向下匹配新的location URI规则)
        # flag (break, 本条规则匹配完成后终止，不在匹配任何规则)
        # flag (redirect, 返回302临时重定向)
        # flag (permanent, 返回301永久重定向)

    # replacement 用于匹配成功之后替换RUI中被截取的部分，如果以 http https 开头的 不会进行拼接直接返回给 客户端 

    # rewrite指令接收到uri中的内容是不包含 参数的 例如 ?name=34&age=49 

    # / 访问的 URI


    # ~ 为区分大小写匹配
    # ~* 为不区分大小写匹配
    # !~和!~*分别为区分大小写不匹配及不区分大小写不匹配文件及目录匹配，其中：
    # -f和!-f用来判断是否存在文件
    # -d和!-d用来判断是否存在目录
    # -e和!-e用来判断是否存在文件或目录
    # -x和!-x用来判断文件是否可执行
    #flag标记有：
    # last 相当于Apache里的[L]标记，表示完成rewrite
    # break 终止匹配, 不再匹配后面的规则 重写后不会重新寻找匹配
    # redirect 返回302临时重定向 地址栏会显示跳转后的地址
    # permanent 返回301永久重定向 地址栏会显示跳转后的地址

    location / {
        index index.html index.htm;
    }

    location /books {
        #  ^/(.*)+ 从开会位置匹配,多次单个字符

        # input-> http://mapi.bjgas95.com:8090/books

        rewrite ^/(.*)  http://mapi.bjgas95.com:8097/$1 permanent; # 访问pc端 

        # output-> http://mapi.bjgas95.com:8097/books
    }
}


```