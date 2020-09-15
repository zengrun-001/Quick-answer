//logs.js
const util = require('../../utils/util.js')
var Bmob = require('../../utils/bmob.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    });
    setTimeout(function () {
      wx.switchTab({
        url: '../../pages/test/index',
      })
    }, 5000);
  }
})
