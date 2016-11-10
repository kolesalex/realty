var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});



router.post('/photo', upload.single('pic'), function(req, res) {
    console.log(req.body);
    console.log(req.body.email);
    req.body.login;
    req.body.password;

});

module.exports = router;