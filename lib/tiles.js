/**
 * Created by matt on 11/30/15.
 */

var fs = require('fs');

module.exports = {
    loadTilesJSON: function(user, city, callback) {
        var tilesObject = require('../public/tiles/' + user + '/' + city + '/tiles.json');
        var tiles = {
            name: tilesObject.name,
            description: tilesObject.description,
            attribution: tilesObject.attribution,
            minZoom: tilesObject.minzoom,
            maxZoom: tilesObject.maxzoom,
            maxBounds: [
                [tilesObject.bounds[1], tilesObject.bounds[0]],
                [tilesObject.bounds[3], tilesObject.bounds[2]]
            ],
            center: [ tilesObject.center[1], tilesObject.center[0]],
            zoom: tilesObject.center[2],
            tileUrl: '/tiles/' + user + '/' + city + '/{z}/{x}/{y}.png'
        };
        console.log(tiles);
        callback(null, tiles);
    }
}
