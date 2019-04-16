const cheerio = require('cheerio');
const Promise = require('bluebird');
const winston = require('winston');
const get = require('superagent').get;


exports.huluArticle = function() {
    /**
     * 爬取小葫芦平台的文章
     * cate: 文章类别
     */
    console.log('进入article.js');
    const url = "https://new.xiaohulu.com/";
    const prefix = "https://new.xiaohulu.com/";
    return new Promise((resolve,reject)=>{
        get(url)
            .then(({text}) => {
                let allArticle = [];
                let $ = cheerio.load(text);
                console.log($('div.channel_container div.channel_center ul li a').text());
                $('div.channel_container div.channel_center ul li').each((idx, ele) => {
                    ele = $(ele);
                    const article_url = $(ele.find('a')[0]).attr('href');
                    console.log(article_url);
                    const article_img = $(ele.find('img')[0]).attr('src');
                    console.log(article_img);
                    const article_title = $(ele.find('dt a')).text();
                    console.log(article_title);
                    const aritcle_date = $(ele.find('dd')[1]).text();
                    console.log(aritcle_date);

                    allArticle.push({
                        article_url: prefix + article_url,
                        article_img: prefix + article_img,
                        article_title: article_title,
                        aritcle_date: aritcle_date,
                    });
                });
                resolve(allArticle);
            })
            .catch(reject);
    });

}