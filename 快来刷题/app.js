//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize('c4a8ae6adf965be2d13151da48619d05', '22874397ddcac22cb74e06f84a03be28')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  showToast: function (Msg) {
    let msg = Msg;
    if (!msg.title) {
      msg.title = '加载中';
    }
    if (!msg.icon) {
      msg.icon = 'loading';
    }
    wx.showToast({
      title: msg.title,
      icon: msg.icon,
      image: '',
      duration: msg.duration,
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  globalData: {
    userInfo: null,
    myInfoScore: {},
    userScores: null
  },
})
