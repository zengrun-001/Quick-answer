// pages/about/about.js
const app = getApp()
var Bmob = require('../../utils/bmob.js')
var currentUserId = ''
var dictCompany = new Array()

/**
 * 由字典的值确定键
 */
function dictValueToKey(Dict, value) {
  for (let ii=0; ii < Dict.length; ii++) {
    if (Dict[ii].CmpName == value) {
      return Dict[ii].Id;
    }
  }
  return '';
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    arrayCompanyName: null,
    arrayCompanyId: null,
    pckCompanyIndex: 0,
    initPhone: '',
    initName: '',
    showRightToptips: false,
    showWrongToptips: false,
    rightToptipsMessage: '',
    wrongToptipsMessage: ''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let loading = {
      duration: 2000
    }

    app.showToast(loading);

    let currentUser = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: currentUser,
    });

    let tempCmpName = new Array();
    dictCompany = wx.getStorageSync('dictCompany');
    for (let ii=0; ii < dictCompany.length; ii++) {
      tempCmpName.push(dictCompany[ii].CmpName);
    }

    that.setData({
      arrayCompanyName: tempCmpName,
    });

    let users = Bmob.Object.extend('Users');
    let query = new Bmob.Query(users);
    let currentCompany = tempCmpName[0];
    
    query.equalTo('nickName', currentUser.nickName);
    query.include('company');
    query.find({
      success: function (results) {
        console.log('Info >> 正在加载用户详细信息......');
        currentUserId = results[0].id;
        currentCompany = results[0].get('company').CmpName;
        if (!currentCompany) {
          currentCompany = tempCmpName[0];
        }
        that.setData({
          initName: results[0].get('realname'),
          initPhone: results[0].get('phone'),
          pckCompanyIndex: tempCmpName.indexOf(currentCompany)
        });
        console.log('Info >> 用户详细信息加载完毕。');
      },
      error: function (error) {
        console.log('Info >> 用户详细信息查询失败： ' + error.code + '\n' + error.message);
      }
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },

  /**
   * 响应Company Picker
   */
  pckCompany: function(e) {
    console.log('Info >> Company picker: ' + e.detail.value);
    this.setData({
      pckCompanyIndex: e.detail.value
    });
  },

  /**
   * 检查手机号格式
   */
  checkPhone: function(value) {
    let that = this;
    let regPhone = new RegExp("^1[3578][0-9]{9}$");

    if (!regPhone.test(value)) {
      that.setData({
        showWrongToptips: true,
        wrongToptipsMessage: '手机号格式不正确'
      });

      setTimeout(function () {
        that.setData({
          showWrongToptips: false,
          wrongToptipsMessage: '手机号格式不正确'
        });
      }, 1000);
    }
  },

  /**
   * 响应手机输入框失去焦点
   */
  phoneBlur: function(e) {    
    this.checkPhone(e.detail.value);
  },

  /**
   * 响应“保存”按钮
   */
  btnSave: function(e) {
    let that = this;
    let Phone = e.detail.value.Phone;
    let userName = e.detail.value.userName;
    let regPhone = new RegExp("^1[3578][0-9]{9}$");

    if (regPhone.test(Phone)) {
      let tempCmpName = this.data.arrayCompanyName[this.data.pckCompanyIndex];
      let tempCmpId = dictValueToKey(dictCompany, tempCmpName);

      let Users = Bmob.Object.extend('Users');
      let query = new Bmob.Query(Users);

      query.get(currentUserId, {
        success: function (result) {
          let toast = {
            title: '保存成功',
            icon: 'success',
            duration: 2000
          }
          app.showToast(toast);

          console.log('Info >> 设置用户详细信息成功：' + currentUserId);

          let company = Bmob.Object.createWithoutData('Company', tempCmpId);
          result.set('realname', userName);
          result.set('phone', Phone);
          result.set('company', company);
          result.save();
        }
      });
    } else {
      that.checkPhone(Phone);
    }   
  }

})