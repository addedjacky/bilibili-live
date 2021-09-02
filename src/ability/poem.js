const axios = require("axios");
const sendMsg = require("../action/sendMsg.js");

let poemToken;
axios.get('https://v2.jinrishici.com/token').then(({data}) => {
    if (data.status === 'success') {
        poemToken = data.data;
    }
});

module.exports = async function (page) {
    let poem;
    try {
        const {data} = await axios.get('https://v2.jinrishici.com/sentence', {
            headers: {
                'X-User-Token': poemToken
            }
        });
        poem = data;
    } catch (e) {
        console.error(e);
        return;
    }
    await sendMsg(page, poem.data.content);
}
