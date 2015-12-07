/**
 * Created by matt on 11/30/15.
 */

var fs = require('fs');

module.exports = {
    loadTilesJSON: function(user, city, callback) {
        var filename = __dirname + '/../public/tiles/' + user + '/' + city + '/tiles.json';
        this.loadJSON(filename, function(err, data) {
            if (err) return callback(err, null);
            var tiles = {
                name: data.name,
                description: data.description,
                attribution: data.attribution,
                minZoom: data.minzoom,
                maxZoom: data.maxzoom,
                maxBounds: [
                    [data.bounds[1], data.bounds[0]],
                    [data.bounds[3], data.bounds[2]]
                ],
                center: [ data.center[1], data.center[0]],
                zoom: data.center[2],
                tileUrl: '/tiles/' + user + '/' + city + '/{z}/{x}/{y}.png'
            };
            //console.log(tiles);
            callback(null, tiles);
        })

    },

    loadJSON: function(filename, callback) {
        fs.readFile(filename, function(err, data) {
            if (err) return callback(err, null);
            var cleanedUpJSON = data
                .toString()
                .split('\r\n')
                .join('\n')
                .split('\n')
                .filter(function(l) {
                    return l.indexOf('//') === -1;
                })
                .join('');
            try {
                var tileObject = JSON.parse(cleanedUpJSON);
                return callback(null, tileObject);
            } catch(e) {
                return callback(e.message);
            }
        });
    }
};
