### 6-1～2 
    ==> 搭建阿里云服务器内的nodejs生产环境
    1. 更新阿里云服务器的系统 
       ==> sudo apt-get update
    2. 安装相关的包模块 
       ==> sudo apt-get install vim openssl build-essential libssl-dev wget curl git (根据需要可能有些没用到，可能还缺少一些)
    3. 使用nvm安装nodejs 
       ==> github中搜索nvm
       ==> 执行脚本 wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
       ==> 安装指定版本的node, nvm install v6.9.5, 这里采用6.9.5
       ==> nvm use v6.9.5, nvm启用指定版本的node
       ==> nvm alais default v6.9.5, nvm 指定系统默认 node 版本为6.9.5
    4. 采用淘宝镜像，解决下载速度缓慢问题
       ==> npm --registry=https://registry.npm.taobao.org install -g npm
       ==> npm --registry=https://registry.npm.taobao.org install -g cnpm
    5. 系统文件监控数目
       ==> echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
    6. 安装常用的工具模块 
       ==> npm i pm2 webpack gulp grunt-cli -g (不一定用的上)
    7. 完成上述，服务器应该已经准备完成，可以在服务器用户的根目录下创建一个文件(app.js)来测试一下
       ==> sudo vi app.js, 文件内容可以简单为以下

       const http = require('http')
		   http.createServer(function (req, res) {
		     res.writeHead(200, {'Content-Type': 'text/plain'})
		     res.end('emmmmmm...')
		   }).listen(8888)
		   console.log('server is listening at http://120.79.203.120:8888/')
	  8. 使用 pm2 工具让服务可以稳定的运行
	   ==> npm install pm2 -g
	   ==> pm2 运行文件, pm2 start app.js
     ==> pm2 关闭服务, pm2 stop app.js/app(文件名或服务名都可以)
	   ==> pm2 列举当前运行的服务, pm2 list
	   ==> pm2 查看某个服务的详细信息, pm2 show appName(服务的名称)
	   ==> pm2 查看实时日志, pm2 logs
     ==> pm2 删除某个服务, pm2 delete app.js/app(文件名或服务名都可以)
	   ==> 退出 pm2, ctrl + C

### 7-1 
   ==> 使用 nginx 让web服务可以在80端口可以被访问到, 80端口不需要写出来，直接用域名就可以访问
   1. 由于阿里云服务器可能本身带有 apache, 所以要先删掉 apache, 在安装 nginx
      ==> update-rc.d -f apache2 remove
          sudo apt-get remove apache2
   2. 更新包列表
      ==> sudo apt-get update
   3. 安装 nginx
      ==> sudo apt-get install nginx
        nginx -v
   4. 进入 /etc/nginx/conf.d/ 目录新建一个配置文件, 文件命名格式最好采用 项目名-服务器用户名-域名后缀名(com/cn等)-端口名.conf, 比较好记
      ==> cd /etc/nginx/conf.d/
      ==> sudo vi notes-api-tang-cn-8081.conf(举例子用的), 文件内容如下:

      upstream notes-api {
        server 127.0.0.1:8084;
      }
      
      server {
        listen 80;
        server_name localhost;
      
        location / {
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forward For $proxy_add_x_forwarded_for;
      
          proxy_set_header Host $http_host;
          proxy_set_header X-Nginx-Proxy true;
      
          proxy_pass http://notes-api;
          proxy_redirect off;
        }
      }

      ==> 保存，退出并回到上一层目录
   5.  编辑 nginx.conf 文件 
       ==> 找到
           include /etc/nginx/conf.d/*.conf
           include /etc/nginx/sites-enabled/*
           的命令(意思为加载所有项目的配置文件)，去掉注释(#)
   6. 测试 nginx 的配置文件是否编写正确
      ==> sudo nginx -t
      ==> 编写正确后，重启nginx, sudo nginx -s reload
          完成上述，此时便可通过 服务器IP且无端口号 访问
   7. 不显示访问时的 nginx 版本号
      cd /etc/nginx
      sudo vi nginx.conf
      找到 server_tokens off 的命令，解开注释即可
      执行 sudo service nginx reload 重载文件

### 8-1～2
   ==> 多看
    

### 9-1~2
   ==> 部署服务器 mongodb 数据库
   参考地址:https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
   根据参考地址的步骤即可
   1. 连上服务器，执行命令
      ==> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
   2. 选择 Ubuntu 14.04, 复制其命令并执行
      ==> echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
   3. 更新服务器本地的安装包
      ==> sudo apt-get update
   4. 安装mongodb,执行命令
      ==> sudo apt-get install -y mongodb-org
   5. 成功安装后，开启mongodb服务，执行命令
      ==> sudo service mongod start
      检查mongodb服务是否开启成功，检查日志文件，有日志则开启服务成功执行命令
      ==> cat /var/log/mongodb/mongod.log
   6. 连接mongodb服务，默认(没有修改数据库端口，默认连接地址为mongodb//127.0.0.1:27017)执行命令
      ==> mongo
   7. 退出mongodb服务，先退回用户根目录，执行命令
      ==> ctrl + z
      再退出mongodb服务，执行命令
      ==> sudo service mongod stop
   8. 修改数据库的默认端口，执行命令
      ==> sudo vi /etc/mongod.conf
      找到端口port,并修改为19999(其他的也可以)，保存退出并重启mongodb服务，执行命令
      ==> sudo service mongod restart
      重新连接数据库，执行命令
      ==> mongo --port 19999
   9. 向服务器数据库导入数据
      备份用户本地数据(不是服务器的)
      a. 在终端中进入本地(不是服务器的)数据库文件夹目录，执行命令(备份整个数据库，这里名称为shop)
         ==> mongodump -h 127.0.0.1:12345 -d shop -o ./   (据库地址: 127.0.0.1:12345, -d shop: 指定数据库名称，-o ./: 保存在当前路径中)
         打包备份好的文件，执行命令
         ==> tar zcvf shop.tar.gz ./shop   (shop.tar.gz: 打包后的名称，./shop: 要打包的文件夹／文件)
         上传打包后的文件到服务器，执行命令
         ==> scp -P 39999 ./shop.tar.gz tang@120.79.203.120:/home/tang/   (./shop.tar.gz: 要传送的文件)
         解压服务器上的打包文件，执行命令(服务器用户根目录上)
         ==> tar xvf shop.tar.gz   (shop.tar.gz: 要解压的文件)
         在服务器上将解压好的文件导入服务器的数据库上, 执行命令
         ==> mongorestore --host 127.0.0.1:19999 -d shop ./shop/   (--host 127.0.0.1:19999: 数据库地址及端口， -d shop: 数据库名称， ./shop/: 导入数据的数据源文件夹)
      b. 在终端中进入本地(不是服务器的)数据库文件夹目录，执行命令(备份整个数据库，这里名称为shop里面的other数据表)
         mongoexport -h 127.0.0.1:12345 -d shop -c other -o ./other.json  (据库地址: 127.0.0.1:12345, -d shop: 指定数据库名称，-c: 指定数据库的某张表，-o ./: 保存在当前路径中)
         上传备份好的文件到服务器，执行命令
         scp -P 39999 ./other.json tang@120.79.203.120:/home/tang/
         导入上传到服务器的文件到服务器上的数据库，执行命令
         mongoimport --host 127.0.0.1:19999 -d shop -c other ./other.json
         
### 9-3~6
    数据库的权限配置
    待看......

### 10-1～2
   ==> 通过远程仓库码云作为第三方仓库，上传项目代码到服务器 本地 ==> 码云 ==> 服务器
   1. 上传本地代码到第三方git仓库 (这里用码云 git push)
   2. 服务器从第三方仓库获取代码 (在服务器通过 git clone)
      在服务器根目录下创建一个文件夹(temp),进入该文件夹,通过 git clone 下载第三方远程仓库代码, 下载完后，重新安装需要的模块后即可运行项目
   3. 通过 pm2 配置，将本地代码一键上传至服务器, 配置内容为
      ==> 在用户的服务器的根目录下，创建 /www/notes-api 文件夹
      www: 为根目录下的 www 文件夹
      notes-api: 为 www 目录下的文件夹
      在 www 文件夹下面修改 notes-api 文件夹的权限（修改为可读可写）
      ==> sudo chmod 777 notes-api

      {
        "apps": [
          {
            "name": "notes-api",
            "script": "notes-api.js",
            "env": {
              "COMMON_VARIABLE": "true"
            },
            "env_production": {
              "NODE_ENV": "production"
            }
          }
        ],
        "deploy": {
          "production": {
            "user": "tang",
            "host": ["120.79.203.120"],
            "port": "39999",
            "ref": "origin/master",
            "repo": "https://gitee.com/tlh13101587201/notes-api.git",
            "path": "/www/notes-api/production",
            "ssh_options": "StrictHostKeyChecking=no",
            "env": {
              "NODE_ENV": "production"
            }
          }
        }
      }

      4. 上传本地代码到远程仓库，更新远程仓库

      5. 在本地通过终端将远程仓库的代码上传至服务器所执行的命令
         ==> pm2 deploy ecosystem.json production setup (第一次上传代码时)
         ==> pm2 deploy ecosystem.json production (以后每次更新时, 否则会报错)

### 10-3~7
   ==> 修改 nginx 的配置文件，使用户能通过 http协议 + 域名 的方式访问
       cd /etc/nginx/conf.d/
       sudo vi notes-api-tang-cn-8084.conf, 内容修改为:

       upstream notes-api {
         # 本地 + 端口号（每个项目的启动文件的端口号不能一样，且要与对应的 nginx配置文件 的端口号一致）
         server 127.0.0.1:8084;
       }
       
       server {
         # 服务监听的80端口
         listen 80;
         # 本地服务器的http地址(只改了这一句)
         server_name notes-api.tanglihe.cn;
       
         location / {
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
       
           proxy_set_header Host $http_host;
           proxy_set_header X-Nginx-Proxy true;
       
           proxy_pass http://notes-api;
           proxy_redirect off;
         }
       }

### 11-1~3
   1. 申请好证书，下载到本地
   2. 将证书文件上传至服务器，www目录下
      ==> 进入证书目录, 执行命令
          scp -P 39999 ./1_notes-api.tanglihe.cn_bundle.crt tang@120.79.203.120:/home/tang/
          scp -P 39999 ./2_notes-api.tanglihe.cn.key tang@120.79.203.120:/home/tang/
          将文件放在 /www 目录下的 ssl 目录下
          sudo mv 1_notes-api.tanglihe.cn_bundle.crt /www/ssl/
          sudo mv 2_notes-api.tanglihe.cn.key /www/ssl/
   3. ==> 修改 nginx 的配置文件，使用户能通过 https／http/无协议 + 域名 的方式访问
          cd /etc/nginx/conf.d/
          sudo vi notes-api-tang-cn-8084.conf, 内容修改为:

          upstream notes-api {
            server 127.0.0.1:8084;
          }
          
          server {
            listen 80;
            server_name notes-api.tanglihe.cn;
            return 301 https://notes-api.tanglihe.cn$request_uri;
          }
          
          server {
            listen 443;# 443 为ssl证书访问的端口号
            server_name notes-api.tanglihe.cn; # 证书绑定的域名
            ssl on;# 启动ssl认证
            ssl_certificate /www/ssl/1_notes-api.tanglihe.cn_bundle.crt;# 证书文件的地址
            ssl_certificate_key /www/ssl/2_notes-api.tanglihe.cn.key;# 证书key文件的地址
            ssl_session_timeout 5m;
            ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
            ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
            ssl_prefer_server_ciphers on;
          
            # 不是根据协议访问的，重定向到https协议去
            if ($ssl_protocol = "") {
              rewrite ^(.*) https://$host$1 permanent;
            }
          
            location / {
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
          
              proxy_set_header Host $http_host;
              proxy_set_header X-Nginx-Proxy true;
          
              proxy_pass http://notes-api;
              proxy_redirect off;
            }
          }

          测试并重启 nginx 配置文件  

















