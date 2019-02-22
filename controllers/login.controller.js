
// const crawler = require('../util/crawler');
// const Promise = require('bluebird');
// var fs = require('fs'); //文件模块
// var path = require('path'); //系统路径模块
// var querystring = require('querystring');

// function userLogin({query: {uName}}, res, next) {
//     // var categoryPath = req.params.categoryPath;
//     // var uName = req.query.uName;
//     // console.log(categoryPath);
//     // console.log(uName);
//     if (!uName) {
//         return next();
//     }
//     let liveJson = [];
//     let recommendJson = [];
//     Promise.map(Object.keys(crawler), prop => crawler[prop]('lol').reflect())
//     // 对于每个promise，如果处于完成状态，将json组装起来，否则维持原状
//     .each(inspection => {
//         liveJson = inspection.isFulfilled() ? liveJson.concat(inspection.value()) : liveJson;
//     })
//     // 将直播间按照 观众人数 排序
//     .then(() => liveJson.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber))
//     .then(() => {
//         let myFile = path.join(__dirname, 'data/recommend.txt');
//         var data = fs.readFileSync(myFile,"utf8");
//         data.toString().split('}').forEach(function(v,i,a){
//             v = v.toString()+"}";
//             if(i!= 4){
//                 var a = [JSON.parse(v)];
//                 recommendJson = recommendJson.concat(a);
//             }
//         });
//         return recommendJson;
//     })
//     // 将这些爬取数据传给/index 界面
//     .then((value) => res.render('index', {
//         category: Object.assign({
//             path: 'lol',
//         }),
//         isLogin : true,
//         liveJson: liveJson.slice(0, 150),
//         recommendJson : recommendJson,
//         uName : uName,
//     }))
//     .catch(next);
// }

// module.exports = {userLogin};
