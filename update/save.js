var async = require('async');
var db = require('../config').db;
var debug = require('debug')('blog:update:save');

exports.classList = function(list, callback) {
	debug('保存文章分类列表到数据库:%d', list.length);

	async.eachSeries(list, function(item, next) {
		// 查询分类内容是否已经存在
		db.query('select * from "clall_list" where "id" = ? limit 1', [item.id],
			function(err, data) {
				if (err) {
					return next(err);
				}
				if (Array.isArray(data) && data.length >= 1) {
					// 分类已经存在,更新一下
					db.query('update "class_list" set "name" = ?,"url"=? where "id"=?', [item.name, item.url, item.id], next);

				} else {
					// 分类不存在
					db.query('insert into "class_list"("id","name","url") values (?,?,?) ', [item.id, item.name, item.url], next);

				}
			});
	}, callback);
};

exports.articleList = function(class_id, list, callback) {
	debug('保存文章列表到数据库中:%d,%d', class_id, list.length);

	async.eachSeries(list, function(item, next) {
		db.query('select * from "article_list" where "id" =? and "class_id" = ? limit 1 ', [item.id, class_id], function(err, data) {
			if (err) return next(err);

			////////////////////
			// 将发布时间转换为时间戳 //
			////////////////////
			var created_time = new Date(item.time).getTime() / 1000;
			if (Array.isArray(data) && data.length >= 1) {
				// 分类已经存在
				db.query('update "article_list" set "title"=?,"url"=?,"class_id"=?,"create_time"=? where "id" = ? and "class_id"=?', [item.title, item.url, class_id, created_time, item.id, class_id], next);

			} else {
				// 分类不存在
				db.query('insert into "article_list"("id","title","url","class_id","created_time") values(?,?,?,?,?) ', [item.id, item.title, item.url, class_id, created_time], next);
			}
		});
	}, callback);
};

/**
 * 保存文章数量
 * @param  {Number}   class_id [description]
 * @param  {Number}   count    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.articleCount = function(class_id, count, callback) {
	debug('保存文章分类数量:%d,%d', class_id, count);
	db.query('update "class_list" set "count"= ? where "id"= ? ', [count, class_id], callback);

};

exports.articleTags = function(id, tags, callback) {
	debug('保存文章标签:%s,%s', id, tags);

	// 删除旧的标签信息
	db.query('delete from "article_tag" where "id"= ? ', [id], function(err) {
		if (err) return callback(err);
		if (tags.length > 0) {
			// 添加新标签信息
			// 生成SQL代码
			var values = tags.map(function(tag) {
				return '(' + db.escape(id) + ',' + db.escape(tag) + ')';

			}).join(', ');

			db.query('insert into "article_tag"("id","tag") values ' + values, callback);

		} else {
			callback(null);
		}
	});

};

/**
 * 保存文章内容
 * @param  {String}   id       [description]
 * @param  {Array}   tags     [description]
 * @param  {String}   content  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.articleDetail = function(id, tags, content, callback) {
	debug('保存文章内容:%s', id);

	// 检查文章是否存在
	db.query('select "id" from "article_detail" where "id"=?', [id], function(err, data) {
		if (err) return callback(err);

		tags = tags.join('');
		if (Array.isArray(data) && data.length >= 1) {
			db.query('update "article_detail" set "tags"=?,"content"=? where "id"=?', [tags, content, id], callback);


		} else {

			db.query('insert into "article_detail"("id","tags","content") values (?,?,?)', [id, tags, content], callback);
		}
	});
};

/**
 * 检查文章是否存在
 * @param  {String}   id       [description]
 * @param  {Function} callback [description]
 * @return {Boolean}           [description]
 */
exports.isAericleExists = function(id, callback) {
	db.query('select "id" from "article_detail" where "id" = ? ', [id], function(err, data) {
		if (err) return callback(err);

		callback(null, Array.isArray(data) && data.length >= 1);
	});
};