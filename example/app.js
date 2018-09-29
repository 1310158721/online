// 一个简单的例子,端口号要与该项目的 nginx配置文件 的端口号要一致
const http = require('http')
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('emmmmmm...')
}).listen(8084)
console.log('server is listening at http://120.79.203.120:8888/')