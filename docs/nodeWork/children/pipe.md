# linux 管道基本操作

一、通过进程名字来获取对应的所有进程号，并保存到指定的文件 ps process status
    ps -ef | grep node | awk '{print $2}'  | xargs >> node.text
    解析
    1、ps -ef 以完整的格式显示所以进程信息
    2、ps -ef | grep node 从所有的进程中过滤出 node进程，返回信息如下
       node      29740  zyn   24u  IPv4 0x6d82c70b452570bf      0t0  TCP *:irdmi (LISTEN)
       node      29740  zyn   45u  IPv4 0x6d82c70b33e3cad7      0t0  TCP 10.201.128.95:irdmi->10.201.128.95:52881 (ESTABLISHED)
    3、ps -ef | grep node | awk '{print $2}'  获取上面每条信息的第二个值，返回信息如下
       29740 29740
    4、ps -ef | grep node | awk '{print $2}'  | xargs 接收上面返回的进程号
    5、>> node.text 写入到 node.text 文件