const randomGetItem = require("../utils/randomGetItem.js");
const sendMsg = require("../action/sendMsg.js");

const yiList = [
    '上船',
    '送小心心',
    '盖楼（疯狂暗示）',
    '放礼花',
    '吃瓜',
    '夸融融',
    '签到',
    '打榜',
    '为融融打call',
    '给融融么么哒',
    '吃辣条',
    '喝冰阔洛',
    '发动态',
]
const jiList = [
    '装b',
    '吃瓜',
    'b克拉',
    '吃辣条',
    '喝阔洛',
    '玩手机',
    '熬夜',
    '生气',
    '伤心',
    '减肥',
];

module.exports = async function (page, barrage) {
    const yi = randomGetItem(yiList);
    const ji = randomGetItem(jiList);
    await sendMsg(page, `@${barrage.user}，今日宜${yi}，忌${ji}`);
}
