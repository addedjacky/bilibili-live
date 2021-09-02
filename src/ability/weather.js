const axios = require("axios");
const sendMsg = require("../action/sendMsg.js");
const fs = require("fs");
const path = require("path");

const codeList = JSON.parse(fs.readFileSync(path.join(__dirname, '../../public/adcode.json')));

module.exports = async function (page, barrage) {
    let weather;
    try {
        const {data} = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
            params: {
                key: '49b31f83b45ed25a1748335fa8a4cd1b',
                city: codeList[barrage.msg?.replace(/^天气\s/, '')]
            }
        });
        weather = data;
    } catch (e) {
        console.error(e);
        return;
    }
    if (weather.status === '0') {
        await sendMsg(page,'查询天气格式为：天气 北京市');
    } else {
        const lives = weather.lives[0];
        await sendMsg(page, `@${barrage.user}，${lives.city}${lives.weather}，温度${lives.temperature}度，风向${lives.winddirection}`);
    }
}
