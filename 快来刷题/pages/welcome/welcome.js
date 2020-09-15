// pages/welcome/welcome.js
//获取应用实例
const app = getApp()
var Bmob = require('../../utils/bmob.js')

function switchToIndex() {
  setTimeout(function () {
    wx.switchTab({
      url: '../../pages/practice/index',
    })
  }, 3000);
}

Page({
  data: {
    
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      console.log('11111111111111111111111');
      switchToIndex();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log('22222222222222222');
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        switchToIndex();       
      }      
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      console.log('333333333333333333333');
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          switchToIndex();
        }
      });
    }

    if(this.data.hasUserInfo) {
      console.log('HasUserInfo----------------');
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/practice/index',
        })
      }, 3000);
    }

  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    
      var that = this;
      var dbTable = Bmob.Object.extend('Users');
      var query = new Bmob.Query(dbTable);

      query.equalTo('nickName', e.detail.userInfo.nickName);
      query.find({
        success: function (results) {
          if (results.length === 0) {
            let diary = new dbTable();
            diary.set('nickName', that.data.userInfo.nickName);
            diary.set('avatarurl', that.data.userInfo.avatarUrl);
            diary.set('score', 0);

            diary.save(null, {
              success: function (results) {
                console.log('Info >> 用户添加成功: ' + results.id);
              },
              error: function (eror) {
                console.log('Info >> 数据表 Users 写入过程出现错误： ' + error.code + ' -- ' + error.message);
              }
            });
          } else {
            console.log('Info >> 该用户已存在： ' + that.data.userInfo.nickName);
          }
        },
        error: function (error, results) {
          console.log('Info >> 数据表 Users 查找过程出现错误： ' + error.code + ' -- ' + error.message);
        }
      });
      
      console.log('Info >> setStorage: userInfo...');
      wx.setStorage({
        key: 'userInfo',
        data: that.data.userInfo,
      });

      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/practice/index',
        })
      }, 3000);
    } else {
      console.log('Info >> User denied.');
      wx.reLaunch;
    }
  },

  bindBgImgTap: function() {
    if (this.data.hasUserInfo) {
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/practice/index',
        })
      }, 1000);
    }
  }

});
