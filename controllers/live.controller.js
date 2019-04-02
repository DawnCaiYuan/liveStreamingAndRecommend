/**
 * 处理访问请求
 */
const Promise = require('bluebird');

const crawler = require('../util/crawler');
const categories = require('../config/category');

var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块
var querystring = require('querystring');



// 对外暴露get方法，用于get请求的处理
exports.get = function(req, res, next) {
    // 获取类别
    let categoryPath = 'lol';
    if(req.params.categoryPath){
        categoryPath = req.params.categoryPath;
    }
    let category = categories[categoryPath];
    // let categoryName = category.name;
    let liveJson = [];
    let recommendJson = [];
    let recommendReason = []; //推荐理由一共四个
    let averHot = 0;
    let sumHot = 0;
    let rollContent = "";
    let myContent = '';
    if (!category) {
        return next();
    }
    let isLogin = false;
    let uName = '游客';
    // 该用户已经登陆
    if(req.session.userName)
    {
        isLogin = true;
        uName = req.session.userName;
    }
    let myFile = './controllers/data/users/'+uName;
    /** 用于处理一个数组，或者 promise 数组.
     *  promise.map(Iterable<any>|Promise<Iterable<any>> input,
     *              function(any item, int index, int length) mapper,
     *              [Object {concurrency: int=Infinity} options])
     * 
     */
    Promise.map(Object.keys(crawler), prop => crawler[prop](categoryPath).reflect())
        // 对于每个promise，如果处于完成状态，将json组装起来，否则维持原状
        .each(inspection => {
            liveJson = inspection.isFulfilled() ? liveJson.concat(inspection.value()) : liveJson;
        })
        // 将直播间按照 观众人数 排序
        .then(() => liveJson.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber))
        // 保存前150个房间号信息到文件中去
        .then(() => {
            liveJson.forEach(function(v,i,a){
                myContent = myContent + JSON.stringify(v);
            })
            //先创建该用户的文件夹
            fs.mkdir(myFile,function(err){
                if(err){
                    console.log(err);
                }
            });
            fs.writeFile(myFile+'/dylive.json',myContent,function(err) {
                if(err){
                    console.log(err);
                }
            });
            fs.exists(myFile+'/recommend.txt',function(exists){
                if(exists){
                }
                if(!exists){
                    fs.writeFile(myFile+'/recommend.txt','',function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                })
        })
        // 登陆过的用户开始推荐
        .then(() => {setTimeout(() => {
            if(isLogin){
                // let myFile = path.join(__dirname, 'data/recommend.txt');
                var data = fs.readFileSync(myFile + '/recommend.txt',"utf8",function(err){
                    if(err){
                        console.log(err);
                    }
                });
                if(!data)
                {
                    recommendJson = liveJson.slice(0,4);
                }
                else{
                    try{
                        data.toString().split('}').forEach(function(v,i,a){
                            // {推荐1}{推荐2}{推荐3}{推荐4}[推荐理由]
                            if(i!= 4){
                                v = v.toString()+"}";
                                var b = [JSON.parse(v)];
                                recommendJson = recommendJson.concat(b);
                            }
                            else{
                                // 最后一个切分应该是[推荐理由],类型为string
                                // // 先将单引号转为双引号才能解析
                                // var reg = new RegExp( '\'' , "g" )
                                // v = v.replace(reg,'\"');
                                var b = JSON.parse(v);
                                for (var i=0;i<4;i++)
                                {
                                    recommendReason = recommendReason.concat("根据您看过的房间号为:"+b.pop()+"的直播间进行推荐");
                                }
                                // recommendReason:["理由1","理由1","理由1","理由1"]
                                // recommendJson: [{'titile':"", "snapshot":""},{},{},{}]
                            }
                        });
                    }catch(e){
                        recommendJson = [];
                        for (var i=0;i<4;i++)
                        {
                            var r = parseInt(Math.random()*100, 10)
                            recommendJson = recommendJson.concat(liveJson[r]);
                            recommendReason = recommendReason.concat("根据您最近所看直播推荐");
                        }
                    }
                }
            }
            else{
                recommendJson = liveJson.slice(0,4);
                for (var i=0;i<4;i++)
                {
                    recommendReason = recommendReason.concat("您还没有登陆");
                }
            }
            // 将recomendReason一条一条插入到recommendJson中去
            recommendJson.forEach(function(v,i,a){
                // v当前内容,i当前下标
                recommendJson[i].rReason = recommendReason[i];
            });
            // 最后处理一下滚动部分内容
            // 直播类型 + 当前直播类别总热度平均热度
            liveJson.slice(0,150).forEach(function(v,i,a){
                // v当前内容,i当前下标
                sumHot = sumHot + parseInt(v.audienceNumber);
            });
            averHot = sumHot/150;
            // 构造滚动内容
            rollContent = "当前所处类别：" + category.name + " ；该类别当前总热度为：" + sumHot.toString() + "；该类别平均热度为：" + averHot.toString();
        }, 2000);})
        // 将这些爬取数据传给/index 界面
        .then(() => {setTimeout(() => {
            res.render('index', {
                category : category,
                // category: Object.assign({
                //     path: categoryPath,
                //     name: categoryName,
                // }),
                isLogin : isLogin,
                liveJson: liveJson.slice(0, 150),
                uName : uName,
                recommendJson : recommendJson,
                rollContent : rollContent,
            })
        }, 2000);})
        .catch(next);
};

exports.getOne = function(req, res, next) {
    var categoryPath = req.params.categoryPath;
    var platform = req.params.platform;
    let category = categories[categoryPath];
    if (!category || !crawler[platform] || !category[platform]) {
        return next();
    }
    let isLogin = false;
    let uName = '游客';
    // 该用户已经登陆
    if(req.session.userName)
    {
        isLogin = true;
        uName = req.session.userName;
    }
    crawler[platform](categoryPath)
        .then((list) => {
            list.sort((o1, o2) => o2.audienceNumber - o1.audienceNumber);
            var recommendJson = list.slice(0,4);
            var recommendReason = ["您还没有登陆","您还没有登陆","您还没有登陆","您还没有登陆"];
            recommendJson.forEach(function(v,i,a){
                // v当前内容,i当前下标
                recommendJson[i].rReason = recommendReason[i];
            });
            res.render('index', {
                category: Object.assign({
                    path: categoryPath,
                    platform,
                }, category),
                liveJson: list.slice(0, 150),
                isLogin : isLogin,
                uName : uName,
                recommendJson : recommendJson,
                rollContent : "滚动部分",
            });
        })
        .catch(next);
};
