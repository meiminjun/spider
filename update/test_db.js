var request = require('request');
var cheerio = require('cheerio');
var mysql = require('mysql');
var debug = require('debug')('blog:update');

var db = mysql.createConnection({
	host: '127.0.0.1',
	port:3306,
	database:'sina_blog',
	user:'root',
	password:''
});

db.query('show tables',function(err,tables) {
	if(err) {
		console.error(err.stack);
	} else {
		console.log(tables);
	}

	db.end();
});
