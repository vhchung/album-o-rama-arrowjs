/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var album = require('./controllers/index');
    app.route('/album/:id/:name').get(album.albumById);

};