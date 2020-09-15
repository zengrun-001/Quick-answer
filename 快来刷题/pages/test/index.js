// pages/DB/start.js
const app = getApp()
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectNum: 0,
    scorePerSubject: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let paperParameters = wx.getStorageSync('paperParameters');
    this.setData({
      subjectNum: paperParameters.subjectNum,
      scorePerSubject: paperParameters.scorePerSubject,
    });

  },

  /**
   * 点击开始答题，跳转试题页
   */
  loadSubjects: function() {
    let app = getApp();
    let loading = {
      duration: 1500
    };
    app.showToast(loading);
    wx.navigateTo({
      url: '../test/test',
    });
  }

})