var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 模版
var exphbs = require('express-handlebars');
// session
var session = require('express-session');
var flash = require('connect-flash');
// mongodb数据库操作
var mongoose = require('mongoose');
// 权限认证
var passport = require('passport');
// 权限认证的策略,使用本地认证策略
// 该模块可以学习策略模式
var LocalStrategy = require('passport-local').Strategy;


// 配置文件
var dbHelper = require('./db/dbHelper');
var config = require('./config');
var authority = require('./lib/authority');


passport.use(new LocalStrategy(
  function (username, password, done) {
    dbHelper.User.findOne({username: username}, function(err, user){
      if (err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, {message: '用户名不存在'});
      }

      if(!user.validPassword(password)){
        return done(null, false, {message: '密码错误'});
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  done(null, id);
});

var app = express();
// 设置当前环境为开发环境
app.set('env', 'development');

// 连接数据库
try {
  mongoose.connect(config.db.url);
} catch (error) {
  console.log(error);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 模版引擎使用handlebars
// 自定义设置
var hbs = exphbs({
  partialsDir: 'views/partials',
  layoutsDir: 'views/layouts',
  defaultLayout: 'main',
  extname: '.handlebars'
});
app.engine('handlebars', hbs);
// 基本设置
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.db.cookieSecret,
  cookie: {maxAge: 30 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.site = config.site;
  res.locals.success = req.flash(config.constant.flash.success);
  res.locals.error = req.flash(config.constant.flash.error);
  res.locals.session = req.session;
  next();
});
app.use(flash());

// 导入路由模块
var routes = require('./routes/index');
var users = require('./routes/users');
var backend = require('./routes/backend/back-index');

// 路由设置
app.use('/', routes);
app.use('/users', users);
app.use('/back', backend);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
  res.render('404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
