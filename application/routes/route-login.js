const express = require('express');
var router = express.Router();

var User = require('../models/model-user');

router.get('/', function(req, res){

    res.render('view-login', {
        title: 'login'
    });
});

router.post('/signin', function(req, res){

    //Save filled form data
    req.session.login_data = [
        {
            name: 'email',
            value: req.body.email
        },
        {
            name: 'password',
            value: req.body.password
        }
    ];

    //Form validation
    req.check('email', 'Email is required').notEmpty();
    req.check('email', 'Invalid email address').isEmail();
    req.check('email', 'Email not found').custom(function(value) {
        return new Promise(function(resolve, reject) {
            User.findOne({email: value}, function(err, result) {
                if (err) throw err;
                if (result == null) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    });
    req.check('password', 'Password is required').notEmpty();
    req.check('password', 'Password does not match email').custom(function(value) {
        return new Promise(function(resolve, reject) {
            User.findOne({email: req.body.email}, function(err, result){
                if (err) throw err;
                if(result == null){
                    reject();
                }
                else{
                   if(result.password == value){
                       resolve();
                   }
                   else{
                       reject();
                   }
                }
            }); 
        });   
    });

    var errors = req.getValidationResult();
    errors.then(function(result) {
        req.session.login_errors = result.array({ onlyFirstError: true });
        if (req.session.login_errors.length > 0) {
            console.log('login contains errors:');
            console.log(req.session.login_errors);
            res.redirect('/login');
        } 
        else {
            req.session.login_success = true;
            User.findOne({email: req.body.email}, function(err, result) {
                if (err) throw err;
                req.session.user = result;
                res.redirect('/');
            });
        }
    });
});

module.exports = router;