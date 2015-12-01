/**
 * Created by matt on 11/30/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var tiles = require('../lib/tiles');

/* GET home page. */
router.get('/:user/:city', function(req, res, next) {
    tiles.loadTilesJSON(req.params.user, req.params.city, function(err, data) {
        res.render('map', { title: data.name, mapData: JSON.stringify(data) });
    });

});

router.get('/matt/cabaceo/tiles.jsonp', function(req, res, next) {
    var data = require('/home/matt/git/skylineviewer/public/tiles/matt/cabaceo/tiles.json');
    //res.header({'Content-Type': 'application/json'});
    res.jsonp(data);
    res.end();
});

module.exports = router;
