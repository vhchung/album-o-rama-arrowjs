var BaseWidget = require('../base_widget'),
    util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird');
;

var _base_config = {
    alias: "post-archives",
    name: "Archives",
    description: "Archives post",
    author: "ZaiChi",
    version: "0.1.0",
    options: {
        id: '',
        title: '',
        show_post_count: ''
    }
};

function PostArchives() {
    PostArchives.super_.call(this);
    _.assign(this, _base_config);
    this.files = BaseWidget.prototype.getAllLayouts.call(this, _base_config.alias);
}

util.inherits(PostArchives, BaseWidget);

PostArchives.prototype.render = function (widget) {
    var sql;
    var _this = this;
    if(widget.data.show_post_count == '1'){
        sql = "SELECT count(id) AS count, ConCat(to_char(created_at, 'YYYY-MM'),'-01') AS date, ConCat(to_char(created_at, 'YYYY-MM'),'-99') AS dateX FROM posts WHERE type='post' GROUP BY date, dateX ORDER BY date DESC";
    }else{
        sql = "SELECT ConCat(to_char(created_at, 'YYYY-MM'),'-01') AS date, ConCat(to_char(created_at, 'YYYY-MM'),'-99') AS dateX FROM posts WHERE type='post' GROUP BY date, dateX ORDER BY date DESC";
    }
    return new Promise(function (resolve, reject) {
        __models.sequelize.query(sql).then(function (archives) {
            resolve(BaseWidget.prototype.render.call(_this, widget, {items: archives[0]}));
        });
    });
};

module.exports = PostArchives;