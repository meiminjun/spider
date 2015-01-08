var async = require('async');

var result = [];

var tt = async.eachSeries;
tt([1,3,2],function(ele,callback) {
	// console.log(ele*ele);
	callback();
	result.push(ele*ele);
	
},function(err) {
	if(err) return console.log(err);
	// console.log(err);
})

console.log(result);