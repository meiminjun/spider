var request = require('request');
var cheerio = require('cheerio');
request('http://cnodejs.org/', function(error, response, body) {
	if (!error && response.statusCode == 200) {
		// console.log(body);
		var $ = cheerio.load(body);

		// console.log("这是"+$);
		$('#sidebar-mask').text("Hello there");

		console.log($.html());
	}
});