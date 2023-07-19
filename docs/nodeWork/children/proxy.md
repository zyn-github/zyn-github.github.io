# nodejs 实现Api 代理

```code
const http = require('http');

function proxy(req, res) {
    const option = {
        host: req.host,
        port: 3000,
        headers: req.headers,
        path: '/remote',
        agent: false,
        method: 'GET'
    };
    const httpProxy = http.request(option, (response)=> {
        response.pipe(res)
    })
    // console.log('--req--->>', req)
    // console.log('--=======--->>\n\n')
    // console.log('--httpProxy--->>', httpProxy)

    // 这句话的作用可以理解为 对httpProxy设置headers 对应的信息，因为是先执行同步代码在执行异步代码
    // 就是简写方式
    // httpProxy.setHeader('xxx', req.xxx) 
    req.pipe(httpProxy)
    // console.log('--req--->>', req)
}

const app = http.createServer((req, res)=> {
    if('/remote' === req.url) {
        res.writeHead(200, { 'Content-type': 'text/plain'})
        return res.end('Hello Remote Page\n');
    } else {
        proxy(req, res)
    }
})


app.listen(3000, ()=> {
    console.log(`Server run at http://127.0.0.1:${app.address().port}`)
})
```