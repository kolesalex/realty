var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/nodeauth');

var db = mongoose.connection;

//AdminSchema

var AdminSchema = mongoose.Schema({
    name : {
        type: String,
        index: true
    },
    login: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
});

var Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.getById = function (id, callback) {
    Admin.findById(id, callback);
}

module.exports.getAdminByLogin = function (login, callback) {
    var query = {login: login};
    Admin.findOne(query, callback);
}

module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

module.exports.createAdmin = function(newAdmin, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newAdmin.password, salt, function(err, hash) {
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });

}