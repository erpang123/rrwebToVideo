const puppeteer = require('puppeteer');
const fs = require('fs')
const open = require('open');
const bodyParser = require('body-parser');//用于req.body获取值的
const express = require('express')
const app = express()
app.use(express.static('public'))

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// 解析 application/json
app.use(bodyParser.json());

var router = express.Router()
// 参数
let dataStr = ''
let allT = 0 // 总时长
let waitTime = 0 // 开始播放的时间
const sLength = 10 // 1秒几张图片
const port = 4000
const addRess = `http://127.0.0.1:${port}/`
const fileUrl = './public/images'

// 图片目录是否存在
const startPupp = () => {
  // 生成指定目录下的文件夹
  fs.readdir(fileUrl, function (err, data) {
    // 如果文件夹存在的话，删除文件夹内的所有文件
    if (data) {
      let files = fs.readdirSync(fileUrl)
      files.forEach(function(file) {
        let fileName = fileUrl + '/' + file
        let stat = fs.statSync(fileName)
        if (!stat.isDirectory()) {
          fs.unlinkSync(fileName)
        }
      })
    } else {
      fs.mkdirSync(fileUrl)
    }
    loopCreateImg()
  })
}
// 截屏函数
const loopCreateImg = function () {
  let strImg = ''
  if (Array.isArray(dataStr)) {
    strImg = JSON.stringify(dataStr)
  }
  (async () => {
    const browser = await puppeteer.launch({
      headless: false
    })
    for (let nowI = 0; nowI <= allT * sLength; nowI++) {
      let page = await browser.newPage()
      waitTime = nowI * (1000 / sLength)
      await page.goto(`${addRess}rrwebVideo.html`)
      await page.setViewport({
        width: 1920,
        height: 1080
      })
      await page.waitForTimeout(200)
      await page.screenshot({
        path: `${fileUrl}/test${nowI}.png`
      })
      page.close()
    }
    open(`${addRess}createVideo.html`)
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
    data: {
      data: dataStr,
      waitTime: waitTime
    }
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

app.listen(port, function () {
  console.log(port + '开启成功')
  open(addRess)
})