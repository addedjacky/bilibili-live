const path = require("path");
const fs = require("fs");

module.exports = async function (page) {
    const loginBtn = await page.$('#right-part > div.vertical-middle.dp-table.h-100.guest-panel-ctnr.f-left > div > a:nth-child(1) > span');

    // 需要登录
    if (loginBtn) {
        await loginBtn.click();
        const QRBtnSelector = 'body > div.bili-mini-mask > div > div.bili-mini-login-group > div > div:nth-child(6) > button';
        await page.waitForSelector(QRBtnSelector);
        const showQRBtn = await page.$(QRBtnSelector);
        await showQRBtn.click();
        // 获取登录二维码
        const QRSelector = 'body > div.bili-mini-mask > div > div.bili-mini-login-group > div.bili-mini-scan > div > div.bili-mini-scan-qrcode > div > div:nth-child(2) > div.bili-mini-scan-main > div > div > div > div > img';
        await page.waitForSelector(QRSelector);
        const QRSrc = await page.evaluate(() => {
            const imgEl = document.querySelector('body > div.bili-mini-mask > div > div.bili-mini-login-group > div.bili-mini-scan > div > div.bili-mini-scan-qrcode > div > div:nth-child(2) > div.bili-mini-scan-main > div > div > div > div > img');
            return imgEl.src;
        });
        const base64Data = QRSrc.replace(/^data:image\/\w+;base64,/, "");
        const dataBuffer = new Buffer(base64Data, 'base64');
        const QRPath = path.join(__dirname, 'QR.png');
        fs.writeFile(QRPath, dataBuffer, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("二维码保存成功！");
            }
        });
    }

}
