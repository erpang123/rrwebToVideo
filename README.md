## 相关命令
`npm i`安装好相关依赖后，运行`node app.js`运行项目。（在`app.js`中写死的一秒中截屏10张图，如果不流畅的话可以将值改大。）

## 将rrweb的录制转成视频
由于rrweb的录制现阶段不会转成视频，需要自己做一层处理。这边采用puppeteer截屏和canvas转换视频处理。

### puppeteer对播放页进行截屏
使用puppeteer对播放页面进行截屏，将对应图片保存到指定目录中。

`puppeteer`的文档：https://zhaoqize.github.io/puppeteer-api-zh_CN/

###  canvas录制视频
canvas转换视频需要用到`captureStream`和`mediaRecorder`，将画布转化后周期性绘制`puppeteer`截屏保存的图片。

`captureStream`的文档：https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/%E6%8D%95%E8%8E%B7%E6%B5%81

`mediaRecorder`的文档：https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder

### 问题
1. 现在的截屏是等待rrweb播放到指定时间后进行的截屏，这样的话在录制时间很长的情况下，截屏也会消耗很长的时间。
2. 考虑想缩短截屏的时间，查看源码发现`rrwebPlayer`中有个`goto`方法跳转到指定时间播放,但在使用中发现在跳转时间时，输入框切换后之前的输入框的输入会被清空掉。若不考虑输入的问题的话可以使用这个方法缩短截屏时间。