var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var debug = require('debug')('blog:update');

function readArticleList (url,callback) {
	debug('读取博文列表:%s',url);

	request(url,function(err,res) {
		if(err) return callback(err);

		var $ = cheerio.load(res.body.toString());

		var articleList = [];
		$('.articleList .articleCell').each(function () {
			var $me = $(this);
			var $title = $me.find('.atc_title a');
			var $time = $me.find('.atc_tm');

			var item = {
				title: $title.text().trim(),
				url: $title.attr('href'),
				time: $time.text().trim()
			};

			var s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);
			if(Array.isArray(s)) {
				item.id = s[1];
				articleList.push(item);
			}
		});
		callback(null,articleList);
	});
}

function readArticleDetail (url, callback) {
	debug('读取博文内容：%s',url);
	request(url,function(err,res) {
		if (err) return callback(err);

		var $ = cheerio.load(res.body.toString());

		var tags = [];
		$('.blog_tag h3 a').each(function() {
			var tag = $(this).text().trim();
			if(tag) {
				tags.push(tag);
			}
		});

		var content = $('.articalContent').html().trim();

		callback(null,{tags:tags,content:content});

	});
}

readArticleList('http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html',function(err, articleList) {
	if(err) return console.error(err.stack);

	async.eachSeries(articleList, function(article,next) {
		readArticleDetail(article.url,function(err,detail) {
			if(err) console.log(err.stack);

			console.log(detail);
			next();
		});
	},function(err) {
		if(err) return console.error(err.stack);
		console.log('完成');
	});
});