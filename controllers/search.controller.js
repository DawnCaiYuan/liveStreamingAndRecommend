const search = require('../util/search');
const Promise = require('bluebird');

function searchAll(req, res, next) {
    var keyword = req.query.keyword;
    if (!keyword) {
        return next();
    }
    let liveJson = [];
    let isLogin = false;
    let uName = '游客';
    // 该用户已经登陆
    if(req.session.userName)
    {
        isLogin = true;
        uName = req.session.userName;
    }
    Promise.map(Object.keys(search), prop => search[prop](keyword).reflect())
        .each(inspection => {
            liveJson = inspection.isFulfilled() ? liveJson.concat(inspection.value()) : liveJson;
        })
        .then(() => liveJson.sort((o1, o2) => {
            if (o1.onlineFlag !== o2.onlineFlag) {
                return o2.onlineFlag ? 1 : -1;
            }
            return o2.audienceNumber - o1.audienceNumber;
        }))
        .then(() => res.render('index', {
            liveJson: liveJson,
            keyword: keyword,
            recommendJson : liveJson.slice(0,4),
            uName : uName,
            isLogin : isLogin,
        }));
}

module.exports = {searchAll};
