const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const login = require('./action/login.js');
const poem = require('./ability/poem.js');
const weather = require('./ability/weather.js');
const constellation = require('./ability/constellation.js');
const luck = require('./ability/luck.js');
const signIn = require('./ability/sign-in.js');


(async () => {
  const userdataPath = path.join(__dirname, '../public/userdata');
  if (!fs.existsSync(userdataPath)) {
    fs.mkdirSync(userdataPath);
  }
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: userdataPath,
    // 在chrome://version/中查找可执行文件路径
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();

  // 开始浏览
  await page.goto('https://live.bilibili.com/5948992');
  await login(page);

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  // 刷新一下才能得到websocket
  // 不知道为什么
  if (await page.$('body > div.bili-mini-mask > div') === null) {
    await page.evaluate(() => {
      location.reload();
    });
  }

  // client.on('Network.webSocketCreated',
  //   function (params) {
  //     console.log(`创建 WebSocket 连接：${params.url}`)
  //   }
  // );
  // client.on('Network.webSocketClosed',
  //   function (params) {
  //     console.log(`WebSocket 连接关闭`)
  //   }
  // );
  // client.on('Network.webSocketFrameSent',
  //   function (params) {
  //     console.log(`发送 WebSocket 消息：${params.response.payloadData}`)
  //   }
  // );
  // client.on('Network.webSocketFrameReceived', function (params) {
  //   console.log(`接收websocket消息：${params.response.payloadData}`);
  // })
  let newBarrage = { user: null, msg: null };
  client.on('Network.webSocketFrameReceived',
    async (params) => {
      const quick_news = params.response.payloadData;
      // parse(quick_news)
      // console.log(params);
      console.log('接收websocket');
      const barrage = await page.evaluate(() => {
        const lastMsg = document.querySelector('#chat-items > div:last-child');
        if (!lastMsg) return null;
        // 弹幕是礼物
        if (lastMsg.classList.contains('gift-item')) return null;
        // 弹幕是正常发言
        const user = lastMsg.getAttribute('data-uname');
        const msg = lastMsg.getAttribute('data-danmaku');
        return { user, msg };
      });
      if (barrage) {
        if (newBarrage.user !== barrage.user || newBarrage.msg !== barrage.msg) {
          newBarrage = barrage;
          console.log(newBarrage);
          switch (true) {
            case /^古诗/.test(newBarrage.msg):
              await poem(page);
              break;
            case /^天气\s/.test(newBarrage.msg):
              await weather(page, newBarrage);
              break;
            case /^星座\s/.test(newBarrage.msg):
              await constellation(page, newBarrage);
              break;
            case /^今日运势/.test(newBarrage.msg):
              await luck(page, newBarrage);
              break;
            case /^签到/.test(newBarrage.msg):
              await signIn(page, newBarrage);
              break;
          }
        }
      }
    }
  );
  // client.on('Network.webSocketWillSendHandshakeRequest',
  //   function (params) {
  //     console.log(`准备发送 WebSocket 握手消息`)
  //   }
  // );
  // client.on('Network.webSocketHandshakeResponseReceived',
  //   function (params) {
  //     console.log(`接收到 WebSocket 握手消息`)
  //   }
  // );

})();


