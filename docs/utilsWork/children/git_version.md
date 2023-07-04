# GIT版本管理命令

> 日常命令总结

#### 1、仓库操作相关
```text
git init                    # 初始化本地的仓库，用于新项目创建
git remote -v               # 查看远程仓库的地址
git remote show origin      # 查看远程仓库信息 比-v详细
git clone                   # 克隆代码库
git config --global user.name # 配置用户名
git config --global user.email "xxx@xxx.com"
git config --global color.ui true
git config --global color.status auto
git config --global color.diff auto
git config --global color.branch auto
git config --global color.interactive auto
git config --global --unset http.proxy
```
#### 2、提交操作
```text
git status                   # 查看当前仓库状态（包含未提交状态）
git add xyz                  # 添加文件 xyz到暂存区
git add .                    # 添加当前路径被修改的文件、文件夹到暂存区
git commit -m 'xxx'          # 提交代码 附加提交信息
git commit --amend -m 'xxx'  # 合并上一次提交（用于反复修改）
git commit -am 'xxx'         # 将add和commit合为一步
git rm xxx                   # 删除文件
git rm -r *                  # 递归删除当前目录中的所有
git log -1                   # 显示1行日志 -n为n行
git log -5                   # 显示5行日志 -n为n行  
git log --stat               # 显示提交日志及相关变动文件 
git log -p -m                # 相比 git log --stat 更加详细
git show dfb0                # 显示某个提交的详细内容
git show HEAD                # 显示HEAD(最近一次)提交日志
git show HEAD^               # 显示HEAD的父（上一个版本）的提交日志 ^^为上两个版本 ^5为上5个版本
git tag                      # 显示已存在的tag
git tag -a v2.0 -m 'xxx'     # 增加v2.0的tag
git show v2.0                # 显示v2.0的日志及详细内容
git log v2.0                 # 显示v2.0的日志
git diff HEAD^               # 比较与上一个版本的差异
git diff HEAD -- ./lib           # 比较与HEAD版本lib目录的差异
git diff origin/master..master         # 比较远程分支master上有本地分支master上没有的
git diff origin/master..master --stat  # 只显示差异的文件，不显示具体内容
```

#### 3、分支操作
```text
git branch                                                # 显示本地分支
git branch --contains 50089                               # 显示包含提交50089的分支
git branch -a                                             # 显示所有分支
git branch -r                                             # 显示所有原创分支
git branch --merged                                       # 显示所有已合并到当前分支的分支
git branch --no-merged                                    # 显示所有未合并到当前分支的分支
git branch -m master master_copy                          # 本地分支改名
git checkout -b master_copy                               # 从当前分支创建新分支master_copy并检出
git checkout -b master master_copy                        # 上面的完整版
git checkout features/performance                         # 检出已存在的features/performance分支
git checkout --track hotfixes/BJVEP933                    # 检出远程分支hotfixes/BJVEP933并创建本地跟踪分支
git checkout v2.0                                         # 检出版本v2.0
git checkout -b devel origin/develop                      # 从远程分支develop创建新本地分支devel并检出
git checkout -- README                                    # 检出head版本的README文件（可用于修改错误回退）
git merge origin/master                                   # 合并远程master分支至当前分支
git cherry-pick ff44785404a8e                             # 合并提交ff44785404a8e的修改
git push origin master                                    # 将当前分支push到远程master分支
git push origin :hotfixes/BJVEP933                        # 删除远程仓库的hotfixes/BJVEP933分支
git push --tags                                           # 把所有tag推送到远程仓库
git fetch                                                 # 获取所有远程分支（不更新本地分支，另需merge）
git fetch --prune                                         # 获取所有原创分支并清除服务器上已删掉的分支
git pull origin master                                    # 获取远程分支master并merge到当前分支
git mv README README2                                     # 重命名文件README为README2
git reset --hard HEAD                                     # 将当前版本重置为HEAD（通常用于merge失败回退）
git rebase
git branch -d hotfixes/BJVEP933                           # 删除分支hotfixes/BJVEP933（本分支修改已合并到其他分支）
git branch -D hotfixes/BJVEP933                           # 强制删除分支hotfixes/BJVEP933
git ls-files                                              # 列出git index包含的文件
git show-branch                                           # 图示当前分支历史
git show-branch --all                                     # 图示所有分支历史
git whatchanged                                           # 显示提交历史对应的文件修改
git revert dfb02e6e4f2f7b573337763e5c0013802e392818       # 撤销提交dfb02e6e4f2f7b573337763e5c0013802e392818
git ls-tree HEAD                                          # 内部命令：显示某个git对象
git rev-parse v2.0                                        # 内部命令：显示某个ref对于的SHA1 HASH
git reflog                                                # 显示所有提交，包括孤立节点
git show HEAD@{5}
git show master@{yesterday}                               # 显示master分支昨天的状态
git log --pretty=format:'%h %s' --graph                   # 图示提交日志
git show HEAD~3
git show -s --pretty=raw 2be7fcb476
git stash                                                 # 暂存当前修改，将所有至为HEAD状态
git stash list                                            # 查看所有暂存
git stash show -p stash@{0}                               # 参考第一次暂存
git stash apply stash@{0}                                 # 应用第一次暂存
git grep "delete from"                                    # 文件中搜索文本“delete from”
```


#### 4、使用场景 回滚、撤销

```text
git reset --hard HEAD^ 回退到上个版本
git reset --hard HEAD~n n代表会推到n次前的操作
git reset --hard commit_id 进入指定commit的
git push origin HEAD --force
git revert commit_id  撤回某一次操作，会生成一条新的操作记录，进入编辑行，编辑完后，使用:wq保存退出即可。
git merge --abort 撤销本地未提交合并
git branch -D demo_dev //删除本地分支
git push origin --delete demo_dev  //删除远程分支
```