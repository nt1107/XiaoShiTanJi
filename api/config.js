const fs = require('fs')
const Koa = require('koa')
var Router = require('koa-router')
const db = require('./database')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const path = require('path')
const { koaBody } = require('koa-body')

const https = require('https')
const sslify = require('koa-sslify').default

const homeDir = process.env.HOME || process.env.USERPROFILE

const options = {
  key: fs.readFileSync(path.join(homeDir, 'ssl/www.xtr327.com.key')),
  cert: fs.readFileSync(path.join(homeDir, 'ssl/www.xtr327.com.pem'))
}

const app = new Koa()

app.use(cors())
app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小限制
    }
  })
)
app.use(sslify())

https.createServer(options, app.callback()).listen(3000, (err) => {
  if (err) {
    console.log('服务启动出错', err)
  } else {
    console.log('运行在' + 3000 + '端口')
  }
})

var router = new Router()

router.prefix('/api')
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

module.exports = {
  https,
  router,
  db,
  app
}
