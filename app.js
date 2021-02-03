const puppeteer = require('puppeteer');
const fs = require('fs')
const open = require('open');
const bodyParser = require('body-parser');//用于req.body获取值的
const express = require('express')
const app = express()
// var ws = require('ws').Server;
// var wss = new ws({port: 8181});
app.use(express.static('public'))

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// 解析 application/json
app.use(bodyParser.json());

// 生成指定目录下的文件夹
fs.readdir('./public/img', function (err, data) {
  console.log(err, data)
  if (data) {
    fs.rmdirSync('./public/img')
  } else {
    fs.mkdirSync('./public/img')
  }
})

var router = express.Router()

let dataStr = ''
let allT = 0 // 总时长
let sLength = 10 // 1秒几张图片
// websocket连接
// wss.on('connection', function (ws) {
//   console.log('client connected')
//   ws.on('message', function (message) {
//     if (message.indexOf('{') >= 0) {
//       const data = JSON.parse(message).data || ''
//       dataStr = data || ''
//       if (Array.isArray(data) && data.length > 1) {
//         const firstT = data[0].timestamp
//         const lastT = data[data.length - 1].timestamp
//         const hasT = Math.floor((lastT - firstT) / 1000)
//         console.log(hasT)
//         startPupp(hasT)
//       }
//     }
//     wss.clients.forEach(function (client) {
//       client.send(message)
//     })
//   })
// })
// 截屏函数
const startPupp = () => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false
    })
    for (let nowI = 0; nowI <= allT * sLength; nowI++) {
      let page = await browser.newPage()
      let waitTime = nowI * (1000 / sLength)
      await page.goto('http://127.0.0.1:4000/rrwebVideo.html')
      await page.setViewport({
        width: 1920,
        height: 1080
      })
      await page.click('#replayBtn')
      await page.waitForTimeout(waitTime)
      await page.screenshot({
        path: `./public/images/test${nowI}.png`
      })
      page.close()
    }
    open('http://127.0.0.1:4000/createVideo.html')
  })();
}

// 获取录屏数据
router.post('/setEventInfo', function (req, res) {
  dataStr = req.body && req.body.str || ''
  if (Array.isArray(dataStr) && dataStr.length > 1) {
    const firstT = dataStr[0].timestamp
    const lastT = dataStr[dataStr.length - 1].timestamp
    allT = Math.floor((lastT - firstT) / 1000)
    startPupp()
  }
  res.send({
    code: '200',
    data: true
  })
})

// 回传录屏数据
router.get('/pageUrl', function (req, res) {
  res.send({
    code: '200',
    data: dataStr
  })
})

// 回传截屏数量
router.get('/imgLength', function (req, res) {
  res.send({
    code: '200',
    data: allT * sLength
  })
})

app.use('/mock', router)

app.listen(4000, function () {
  console.log('4000开启成功')
  open('http://127.0.0.1:4000/')
})