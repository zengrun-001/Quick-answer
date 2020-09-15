// pages/admin/admin.js

const app = getApp()
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenLoginView: false,
    hiddenContentView: true,
    btnLoginLoading: false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let msg = {
      duration: 2000
    }
    app.showToast(msg);

    let that = this;
    console.log('Login: getStorage ......');
    try {
      wx.getStorage({
        key: 'loginCookie_success',
        success: function(res) {
          let temp = res.data;
          //登录成功，则隐藏
          if (temp) {
            that.setData({
              hiddenLoginView: true,
              hiddenContentView: false,
              btnLoginLoading: false
            });
          } else {
            that.setData({
              hiddenLoginView: false,
              hiddenContentView: true,
              btnLoginLoading: false
            });
          }
        },
      });
      
      
    } catch(e) {
      console.log('getStorage error: ' + e);
      wx.setStorage({
        key: 'loginCookie_success',
        data: 'false',
      });
    }
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('admin onShow.');
    //存储单位信息
    var ArrayCompany = new Array();
    var Company = Bmob.Object.extend("Company");
    var query = new Bmob.Query(Company);
    query.find().then(function (results) {
      console.log('单位信息读取成功......');
      results.forEach(function(result) {
        console.log(result.id);
        ArrayCompany.push(result.id);
      });
      wx.setStorage({
        key: 'ArrayCompany',
        data: ArrayCompany,
      });
    });

  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 返回首页
   */
  returnToIndex: function() {    
    this.setData({
      hiddenLoginView: !this.data.hiddenLoginView,
      hiddenContentView: !this.data.hiddenContentView,
      btnLoginLoading: !this.data.btnLoginLoading
    });

    console.log('返回首页1');
    wx.switchTab({
      url: '../../pages/practice/index',
    });
  },
  
  btnLogin: function(e) {
    let admin = (e.detail.value.inputAdmin).trim();
    let pswd = (e.detail.value.inputPswd).trim();

    console.log('Login: btnLogin ......');

    if ((admin == 'hua') && (pswd == 'hua')) {
      console.log('Login Info: 登录成功');
      this.setData({
        hiddenLoginView: !this.data.hiddenLoginView,
        hiddenContentView: !this.data.hiddenContentView,
        btnLoginLoading: !this.data.btnLoginLoading
      });
      wx.setStorage({
        key: 'loginCookie_success',
        data: 'true',
      });
    } else {
      console.log('Login Info: 登录失败');
      //
    }     

  },

  btnReturnToIndex: function () {
    console.log('Admin: 返回首页');
    // wx.switchTab({
    //   url: '../../pages/practice/index',
    // });
  },

  /**
   * 数据库交联练习
   */
  btnDbTest: function() {
    var Post = Bmob.Object.extend('Users');

    var query = new Bmob.Query(Post);

    console.log('Info >> 查询表 Users ......');
    query.first({
      success: function(object) {
        console.log('Info >> 查得的对象为：' + object.id);
        var post = Bmob.Object.createWithoutData('Users', object.id);

        var Hua = Bmob.Object.extend('hua');
        var hua = new Hua();

        hua.set('parent', post);
        hua.set('child', post);
        hua.save();

      }
    })
  }



})