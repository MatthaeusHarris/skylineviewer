/**
 * Created by matt on 12/8/15.
 */

var mongoose = require('mongoose');

var mapSchema = mongoose.Schema({
    userId: String,
    name: String,
    status: String, // May be UPLOADED, RENDERING, or RENDERED
    jobId: String,
    osmFile: String
});

mapSchema.index({userId: 1});
mapSchema.index({jobId: 1});

var Map = mongoose.model('Map', mapSchema);
module.exports = Map;