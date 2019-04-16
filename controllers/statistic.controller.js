const Promise = require('bluebird');
const article_crawler = require('../util/article');

var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块
var querystring = require('querystring');

// 完成数据统计工作，包括图表和文章
exports.statisticAll = function(req, res, next) {
    console.log('进入statistic.controller.js');
    // 文章爬取
    article_crawler.huluArticle()
        .then((list) => {
            res.render('statistic', {
                allArticle : list,
            });
        })
        .catch(next);
    // 构造图表数据
};

