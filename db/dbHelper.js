/**
 * Created by Ukun on 16/2/18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('utility');
var Promise = require('bluebird');
var async = require('async');
var config = require('../config');

/**
 * 获取用户数据
 * @private
 */
var _getUser = function () {
  // 定义用户数据格式
  var userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: config.constant.role.user},
    email: {type: String},
    phone: {type: String},
    status: {type: Boolean, default: true}
  }, {
    timestamps: {               // 添加数据更改时的时间
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
  // 添加方法
  userSchema.methods.validPassword = function (password) {
    return utils.md5(password, 'base64') == this.password;  // 加密验证
  };
  var User = mongoose.model('User', userSchema);
  return Promise.promisifyAll(User);
};

module.exports = {
  User: _getUser()
};
