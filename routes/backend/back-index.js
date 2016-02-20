/**
 * Created by Ukun on 16/2/10.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('backend/login', {
       layout: 'back-main'
    });
});

module.exports = router;