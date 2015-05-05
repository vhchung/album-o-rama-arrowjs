/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

let util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash'),
    promise = require('bluebird'),
    sequelize = require('sequelize');

function IndexModule() {
    BaseModuleFrontend.call(this);
    this.path = "/index";
}
let _module = new IndexModule();
_module.index = function (req, res) {

    let index_view = 'index';
    let offset = getRandomInt(0, 1000);
    let o_tag = getRandomInt(0, 50);
    let tm = new Date().getTime();
    console.time('A');
    let Client = require('pg-native');
    let client = new Client();
    client.connect('postgresql://postgres:techmastercms234-@192.168.1.23:5432/orama', function (err) {
        if (err) throw err;
        else
            console.log('connected with connection string!')
    });
    promise.all([
        (function () {
            return new Promise(function (fullfil, reject) {
                client.query('SELECT al.id AS id, al.name AS name, ar.uri AS uri, ar.id AS artist_id, ar.name AS artist, ap.url AS url FROM albums AS al INNER JOIN artists AS ar ON al.artists_id = ar.id  INNER JOIN albums_photos AS ap ON al.id = ap.albums_id  WHERE al.id >= ' + offset + ' AND ap.type = \'large\' ORDER BY al.playcount DESC LIMIT 30', function (err, rows) {
                    if (err) reject(err);
                    fullfil(rows)
                })
            })
        })(),
        (function () {
            return new Promise(function (fullfil, reject) {
                client.query('SELECT t.name AS name, COUNT(t.name) AS _1 FROM tags AS t INNER JOIN albums_tags AS at ON t.id = at.tags_id  GROUP BY 1 HAVING COUNT(*) > 50 LIMIT 10 OFFSET ' + o_tag, function (err, rows) {
                    if (err) reject(err);
                    fullfil(rows)
                })
            })
        })()
        //__models.sequelize.query('SELECT \
        //    al.id, \
        //    al.name, \
        //    ar.uri, \
        //    ar.id as artist_id, \
        //    ar.name as artist, \
        //    ap.url \
        //    FROM albums al  \
        //    JOIN artists ar ON al.artists_id=ar.id \
        //    JOIN albums_photos ap ON al.id=ap.albums_id \
        //    WHERE \
        //    al.id >= ' + offset + ' AND \
        //    ap.type = \'large\' \
        //    ORDER BY al.playcount DESC \
        //    LIMIT 30',
        //    {type: sequelize.QueryTypes.SELECT}
        //),
        //__models.albums_photos.findAll({
        //    where: {
        //        type: 'large',
        //        id: {
        //            $gt: 30 * offset
        //        }
        //    },
        //    limit: 30,
        //    include: [
        //        {
        //            model: __models.albums,
        //            include: [
        //                {
        //                    model: __models.artists
        //                }
        //            ]
        //        }
        //    ]
        //}),
        //__models.sequelize.query('SELECT al.id AS id, al.name AS name, ar.uri AS uri, ar.id AS artist_id, ar.name AS artist, ap.url AS url FROM albums AS al INNER JOIN artists AS ar ON al.artists_id = ar.id  INNER JOIN albums_photos AS ap ON al.id = ap.albums_id  WHERE al.id >= ' + offset + ' AND ap.type = \'large\' ORDER BY al.playcount DESC LIMIT 30',
        //    {type: sequelize.QueryTypes.SELECT}),
        //    __models.sequelize.query('SELECT t.name AS name, COUNT(t.name) AS _1 FROM tags AS t INNER JOIN albums_tags AS at ON t.id = at.tags_id  GROUP BY 1 HAVING COUNT(*) > 50 LIMIT 10 OFFSET ' + o_tag,
        //        {type: sequelize.QueryTypes.SELECT})
        //__models.sequelize.query('SELECT t.name, COUNT(*) \
        //    FROM tags t \
        //    JOIN albums_tags at \
        //    ON t.id = at.tags_id \
        //    GROUP BY t.name \
        //    HAVING COUNT(*) > 50 \
        //    LIMIT 10 \
        //    OFFSET ' + o_tag,
        //    {type: sequelize.QueryTypes.SELECT}
        //)
        //__models.tags.findAll({
        //    offset: o_tag,
        //    limit: 10
        //})
    ]).
        then(function (results) {
            console.timeEnd('A');
            //console.log(results[1]);
            console.log('End Query:', new Date().getTime() - tm);
            _module.render(req, res, index_view, {
                albums: results[0],
                tags: results[1]
            });
        });

};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}