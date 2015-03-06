/**
 * Created by thanhnv on 2/28/15.
 */
var Promise = require('bluebird');

module.exports = function (env) {
    env.addFilter('get_sidebar', function (sidebarName, cb) {
        var html = '';
        var promises = [];
        __models.widgets.findAll({
            where: {
                sidebar: sidebarName
            }
        }, {raw: true}).then(function (widgets) {
            for (var i in widgets) {
                var widget = __.getWidget(widgets[i].widget_type);
                promises.push(widget.render(widgets[i]));
            }
            Promise.all(promises).then(function(results){
                cb(null, results);
            });
        });
        return html;
    }, true);
}