/**
 * Created by Ukun on 16/2/10.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var utils = require('utility');

var dbHelper = require('../../db/dbHelper');
var config = require('../../config');
var webHelper = require('../../lib/webHelper');

/**
 * 跳转后台主页面,判断是否登录,
 * 未登录则跳转到登录页面
 */
router.get('/', function (req, res, next) {
  res.render('backend/login', {
    layout: 'back-main'
  });
});

/**
 * 跳转登录页面
 */
router.get('/login', function (req, res) {
  res.render('backend/login', {
    layout: 'back-main'
  });
});

/**
 * 用户登录
 */
router.post('/login', passport.authenticate({
  failureRedirect: '/login',
  failureFlash: '用户或密码错误'
}), function (req, res, next) {
  var username = req.body.username;
  dbHelper.User.findOne({username: username}).exec(function () {
    if (err) {
      next(err);
    } else if (!user.status) {
      req.flash(config.constant.flash.error, '账户已被禁用，请联系管理员');
      res.redirect('/login');
    } else {
      req.session.user = user;
      req.flash(config.constant.flash.success, '欢迎回来, ' + username);
      res.redirect('/main');
    }
  })
});

/**
 * 跳转注册页面
 */
router.get('/register', function (req, res) {
  res.render('backend/register', {
    layout: 'back-main'
  });
});
/**
 * 用户注册
 */
router.post('/register', function (req, res, next) {  //  注册信息验证function
  var user = req.body;
  if (!user.username || !user.password) {
    req.flash(config.constant.flash.error, '用户名或密码不能为空!');
    res.redirect('/register');
    return;
  }
  if (!user.email) {
    req.flash(config.constant.flash.error, '邮箱不能为空!');
    res.redirect('/register');
    return;
  }
  if (user.password != user.confirm_password) {
    req.flash(config.constant.flash.error, '两次输入的密码不一致');
    res.redirect('/register');
    return;
  }
  next();
}, function (req, res, next) {
  var user = req.body;
  var User = dbHelper.User;

  async.parallel({
    username: function (callback) {
      User.findOne({username: user.username}, function (err, doc) {
        callback(null, doc);
      });
    },
    email: function (callback) {
      User.findOne({email: user.email}, function (err, doc) {
        callback(null, doc);
      })
    }
  }, function (err, result) {
    if (results.username) {
      req.flash(config.constant.flash.error, '用户名已被占用');
      res.redirect('/register');
      return;
    }
    if (results.email) {
      req.flash(config.constant.flash.error, '邮箱已被占用');
      res.redirect('/register');
      return;
    }
    user.password = utils.md5(user.password, 'base64');
    User.create(user, function (err, doc) {
      webHelper.reshook(err, next, function () {
        req.flash(config.constant.flash.success, '注册成功');
        res.redirect('/login');
      });

    });
  });
});

/**
 * 退出登录
 */
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
  req.session.destroy();
})

module.exports = router;