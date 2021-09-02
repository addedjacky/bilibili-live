const sendMsg = require('../action/sendMsg.js')
const fs = require('fs');
const path = require("path");

const creditsPath = path.join(__dirname, '../../public/credits.json');

module.exports = async function(page, barrage) {
    const credits = JSON.parse(fs.readFileSync(creditsPath));
    const time = new Date().toISOString().substring(0, 10);
    const user = barrage.user;

    if (!credits.hasOwnProperty(time)) {
        credits[time] = [user];
        await sendMsg(page, `@${user}，签到成功，积分+1，融融更喜欢你啦！`);
    } else {
        // 检查今天有没有签到过
        if (credits[time].includes(user)) {
            await sendMsg(page, `@${barrage.user}，今天已经签到过了哦，明天再来吧！`);
        } else {
            credits[time].push(user);
            await sendMsg(page, `@${barrage.user}，签到成功，积分+1，融融更喜欢你啦！`);
        }
    }

    fs.writeFile(creditsPath, JSON.stringify(credits), () => {
        console.log('积分文件保存成功');
    })
}
