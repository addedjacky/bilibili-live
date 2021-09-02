const sendMsg = require("../action/sendMsg.js");
const randomGetItem = require("../utils/randomGetItem.js");

const constellationData = {
    '水瓶': {
        colors: ['彩色'],
        number: [4, 8],
    },
    '双鱼': {
        colors: ['湖水绿色', '海蓝色'],
        number: [5, 8],
    },
    '白羊': {
        colors: ['红色', '粉红', '黄色'],
        number: [6, 7],
    },
    '金牛': {
        colors: ['浅绿色', '浅粉红'],
        number: [1, 9],
    },
    '双子': {
        colors: ['白色', '银色'],
        number: [3, 5, 7],
    },
    '巨蟹': {
        colors: ['珍珠色', '白色', '浅蓝'],
        number: [8, 3],
    },
    '狮子': {
        colors: ['金色', '红色', '橙色'],
        number: [5, 9],
    },
    '处女': {
        colors: ['蓝色', '绿色', '黄色'],
        number: [4, 8],
    },
    '天秤': {
        colors: ['宝蓝色', '啡红色', '灰色'],
        number: [6, 9],
    },
    '天蝎': {
        colors: ['黑色', '紫色', '啡红色'],
        number: [3, 5],
    },
    '射手': {
        colors: ['紫色', '深蓝色'],
        number: [9],
    },
    '摩羯': {
        colors: ['啡色', '灰色', '黑色'],
        number: [3, 7],
    }
}

const audienceList = [];

module.exports = async function (page, barrage) {
    const constellationStr = barrage.msg?.replace(/^星座\s/, '');
    if (!constellationData.hasOwnProperty(constellationStr)) {
        await sendMsg(page, '查询星座运势格式为：星座 天蝎');
    } else {
        if (!audienceList.includes(barrage.user)) {
            audienceList.push(barrage.user);
        }
        const cons = constellationData[constellationStr];
        const color = randomGetItem(cons.colors);
        const number = randomGetItem(cons.number);
        const all = Math.floor(Math.random() * 20 + 80);
        await sendMsg(page, `@${barrage.user}，幸运色：${color}，幸运数字：${number}，综合指数：${all}`);
        if (audienceList.length !== 0) {
            const friend = randomGetItem(audienceList);
            await sendMsg(page, `悄悄告诉你，@${friend}的星座是你的速配星座哦`);
        }
    }
}
