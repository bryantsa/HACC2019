const express = require('express');
var router = express.Router();

var User = require('../models/model-user');

router.get('/', function(req, res){


    res.render('view-homepage', {layout: false});
});

module.exports = router;