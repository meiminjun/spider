// MySQL数据库连接配置
var mysql = require('mysql');
exports.db = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	database: 'sina_blog',
	user: 'root',
	password: ''
});

// 博客配置
exports.sina_blog = {
	url: 'http://blog.sina.com.cn/u/1776757314'
};