module.exports = async function (page, msg) {
    try {
        await page.type('#control-panel-ctnr-box > div.chat-input-ctnr.p-relative > div:nth-child(2) > textarea',
            msg
        );
        await page.click('#control-panel-ctnr-box > div.bottom-actions.p-relative > div > button');
    } catch (e) {
        console.error(e);
    }
}
