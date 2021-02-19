## 相关命令
`npm i`安装好相关依赖后，运行`node app.js`运行项目。（在`app.js`中写死的一秒中截屏10张图，如果不流畅的话可以将值改大。）

## 将rrweb的录制转成视频
由于rrweb的录制现阶段不会转成视频，需要自己做一层处理。这边采用puppeteer截屏和canvas转换视频处理。

### puppeteer对播放页进行截屏
使用puppeteer对播放页面进行截屏，将对应图片保存到指定目录中。

puppeteer文档：https://zhaoqize.github.io/puppeteer-api-zh_CN/

###  canvas录制视频
canvas转换视频需要用到`captureStream`和`mediaRecorder`，将画布转化后周期性绘制`puppeteer`截屏保存的图片。

`captureStream`的文档：https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/%E6%8D%95%E8%8E%B7%E6%B5%81
`mediaRecorder`的文档：https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder