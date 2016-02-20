/**
 * Created by Ukun on 16/2/17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
   res.render('zhihao');
});

module.exports = router;