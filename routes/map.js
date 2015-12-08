/**
 * Created by matt on 11/30/15.
 */
var express = require('express');
var router = express.Router();
var fsp = require('fs-promise');
var path = require('path');
var tiles = require('../lib/tiles');
var auth = require('../lib/auth');
var flash = require('../lib/flash');
var multer = require('multer');
var Map = require('../models/map');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

var multerHandlers = {
    onFileUploadStart: function(file) {
        console.log(file + " started uploading");
    },
    onFileUploadData: function(file, data) {
        console.log(file + " upload complete.");
    },
    onParseEnd: function(req, next) {
        console.log("parseEnd");
        next();
    },
    storage: storage
};

var upload = multer(multerHandlers);

/* GET home page. */
router.get('/map/:user/:city', function(req, res, next) {
    tiles.loadTilesJSON(req.params.user, req.params.city, function(err, data) {
        res.render('map', { title: data.name, mapData: JSON.stringify(data) });
    });

});

router.get('/map/new', auth.ensureAuthenticated, function(req, res, next) {
    res.render('newmap', {title: "New Map"});
});

router.post('/map/new', auth.ensureAuthenticated, upload.single('osm'), function(req, res, next) {
    console.log(req.file);
    flash(req, {
        type: 'info',
        intro: 'Map',
        message: req.body.name + ' uploaded.'
    });
    console.log(req.user);
    // Make target dir
    var userDir = path.resolve(__dirname + '/../public/tiles/' + req.user.username);
    var mapDir = path.resolve(userDir + '/' + req.body.name);
    fsp.mkdirp(mapDir)
        .then(function () {
            console.log("Made dir " + mapDir);
            flash(req, {
                type: 'info',
                intro: 'Map',
                message: 'Directory created.'
            });
            return fsp.move(req.file.path, path.resolve(mapDir + '/' + originalname));
        })
        .then(function() {
            // Move OSM to target dir

            flash(req, {
                type: 'info',
                intro: 'Map',
                message: 'File moved.'
            });
            // Create Database record

            flash(req, {
                type: 'info',
                intro: 'Map',
                message: 'Database record created.'
            });
            res.redirect('/map/new');
        });

});

module.exports = router;
