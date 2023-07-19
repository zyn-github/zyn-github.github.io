# docker的运行
1、docker run是启动容器的方法。可以用三种方式指定启动容器的命令
   （1）CMD指令 适用于 Dockerfile
    (2) ENTRYPOINT指令 适用于 Dockerfile
    (3) 在docker run命令行中指定[会覆盖CMD指令]
2、docker run ubuntu pwd 表示在进入容器之后执行 pwd 查看当前路径的操作

3、查看当前运行的容器情况 
   docker ps
   docker ps -a
   docker conatiner ls -a
   -a会显示所有状态的容器，可以看到，之前的容器已经退出了，状态为Exited

4、使容器可以长期后台运行而不需要长期占用终端[注意容器第一次启动之后会保留上一次启动的参数] 下面的启动方式执行一次即可下次可以通过 docker/start/stop/restart 操作
   (1) docker run ubuntu /bin/bash -c "while true; do sleep 1; done" # 可以执行一个死循环来阻止退出，但是缺点还是会占用一个终端进程
   (2) docker run -d  ubuntu /bin/bash -c "while true; do sleep 1; done" # 完美的方式 使用-d制定后台运行

5、停止后台容器(每个容器相当于一个进程)
   docker stop 7d7f6be12808 #容器的短ID
6、启动容器
   docker start ecstatic_jones # ecstatic_jones 来自于 docker ps -a 返回的NAME标识的容器名字(该名字可以自定义) 
7、进入已经启动的容器之中
   (1) docker attach [容器ID]
   (2) docker exec [容器ID] bash #-it以交互模式打开pseudo-TTY，执行bash，其结果就是打开了一个bash终端。
   attach与exec主要区别如下：
     （1）attach直接进入容器启动命令的终端，不会启动新的进程。
     （2）exec则是在容器中打开新的终端，并且可以启动新的进程。
     （3）如果想直接在终端中查看启动命令的输出，用attach；其他情况使用exec。 
    eg: docker exec -it bbf5ad1adaf7 bash 
8、查看启动命令的输出 docker logs
   docker logs -f [容器ID] #-f的作用与tail -f类似，能够持续打印输出
9、运行容器的最佳实践
   (1)按用途容器大致可分为两类：
      服务类容器和工具类的容器。服务类容器以daemon的形式运行，
        对外提供服务，比如Web Server、数据库等。通过 -d以后台方式启动这类容器是非常合适的。如果要排查问题，可以通过exec -it进入容器。
        工具类容器通常能给我们提供一个临时的工作环境，通常以run -it方式运行   

10、容器的自动重启操作 restart
      启动容器时设置 --restart就可以达到这个效果
      --restart=always意味着无论容器因何种原因退出（包括正常退出），都立即重启；该参数的形式还可以是 --restart=on-failure:3，意思是如果启动进程退出代码非0，则重启容器，最多重启3次。    

11、容器的暂停操作 pause / unpause
    (1)有时我们只是希望让容器暂停工作一段时间，比如要对容器的文件系统打个快照，或者dcoker host需要使用CPU，这时可以执行docker pause
    (2)处于暂停状态的容器不会占用CPU资源，直到通过docker unpause恢复运行

12、删除容器操作
   查看可以操作删除的容器(docker ps -a)
   (1)docker rm ['容器ID', '容器ID', '容器ID']，
   (2)docker rm -v $(docker ps -aq -f status=exited) 如果希望批量删除所有已经退出的容器，可以执行当前命令 
   「docker rm是删除容器，而docker rmi是删除镜像」
       