var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('blog:update');
debug('读取博文类别类表');

request('http://blog.sina.com.cn/u/1776757314',function(err,res) {
	if(err) return console.error(err);
	var $ = cheerio.load(res.body.toString());
	// console.log($.html());
	var classList = [];
	$('.classList li a').each(function() {
		var $me = $(this);
		var item = {
			name: $me.text().trim(),
			url: $me.attr('href')
		};
		var s = item.url.match(/articlelist_\d+_(\d+)_\d\.html/);
		if(Array.isArray(s)) {
			item.id = s[1];
			classList.push(item);
		}
	});
	console.log(classList);
});