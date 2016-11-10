var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');


/* GET admin. */
router.get('/', ensureAthenitcated, function(req, res, next) {
    res.render('admin/main',{title: 'Реєстрація'});
});

router.get('/register', function(req, res, next) {
    res.render('admin/register', {title: 'Реєстрація'});
});

router.post('/register', function(req, res) {
    req.checkBody('name', "Обовйязкове поле").notEmpty();
    req.checkBody('email', "Обовйязкове поле").notEmpty();
    req.checkBody('email', "Невірний формат").isEmail();
    req.checkBody('login', "Обов`язкове поле").notEmpty();
    req.checkBody('password', "Обов`язкове поле").notEmpty();
    req.checkBody('password2', "Паролі не співпадають").equals(req.body.password);
    req.checkBody('name', "Обов`язкове поле").notEmpty();
    var errors = req.validationErrors();

    if(errors){
        res.render('admin/register', {
            errors : errors
        });
    } else {
        var newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        });

        Admin.createAdmin(newAdmin, function (err, admin) {
            if(err) console.error(err);
        });

        req.flash('success', 'Вас зареєстровано');

        res.location('/admin');
        res.redirect('/admin');
    }
    console.log(req.body);

});

router.get('/login',  function(req, res, next) {
    res.render('admin/login', {title: 'Лоґін'});
});
/*,
 failureFlash: 'Невірний лоґін чи пароль'*/
router.post('/login',
    passport.authenticate('local',
        {successRedirect: '/admin',
            failureRedirect: '/admin/login',
            failureFlash: 'Невірний лоґін чи пароль'}),
        function(req, res) {
            req.flash('success', 'Ви увійшли!');
            res.redirect('/admin/login');
    }
);

router.get('/logout', function(req, res, next) {
    req.logout();
    req.flash('success', 'Ви щойно вийшли з адмін сторінки');
    res.redirect('/admin/login');
});

function ensureAthenitcated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/login')
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Admin.getById(id, function(err, user) {
        done(err, user);
    });
});

passport.use( new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password' // this is the virtual field on the model
},function (login, password, done) {
    Admin.getAdminByLogin(login, function (err, admin) {
        if(err) {console.log(err);throw err;}
        if(!admin) {
            console.log(333)
            return done (null, false, {message: 'Невідомий адміністратор'});
        }
        Admin.comparePassword(password, admin.password, function (err, isMatch) {
            if(err) {console.log(err);done(err);}
            if(isMatch){
                return done(null, admin);
            } else {
                return done(null, false, {message: 'Невірний пароль'});
            }
        });
    });
}));

module.exports = router;