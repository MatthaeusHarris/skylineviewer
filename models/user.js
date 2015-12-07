/**
 * Created by matt on 12/1/15.
 */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    authId: String,
    name: String,
    email: String,
    role: String,
    created: Date,
    limits: {
        concurrentBuilds: Number,
        minZoom: Number,
        maxZoom: Number,
        maps: Number
    }
});

userSchema.index({authId: 1});
userSchema.index({email: 1});

var User = mongoose.model('User', userSchema);
module.exports = User;