// pages/DB/start.js
const app = getApp()
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    imgUrls: [{ url: '/static/img/1.jpg' }, { url: '/static/img/3.jpg' }],
    indicator: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    subjectNum: 0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let loading = {
      duration: 2000
    }

    app.showToast(loading);

    var that = this;
    var Data1 = Bmob.Object.extend("dbSht_SingleChoose");
    var query = new Bmob.Query(Data1);

    query.select('objectId');

    query.find().then(function (results) {
      let tempArray = new Array();
      for (let ii = 0; ii < results.length; ii++) {
        tempArray.push(results[ii].id);
      }
      //存储数据Id
      console.log('Info >> 正在读取试题库 ......');
      wx.setStorage({
        key: 'totalSubjectIds',
        data: tempArray,
      });
      that.setData({
        subjectNum: results.length
      });
      console.log('Info >> 试题库读取完毕。');
    }); 

    //读取成绩
    let userInfo = app.globalData.userInfo;
    app.globalData.myInfoScore.nickName = userInfo.nickName;
    app.globalData.myInfoScore.avatarUrl = userInfo.avatarUrl;
    app.globalData.myInfoScore.score = 0;

    var dbTable = Bmob.Object.extend('Users');
    var query = new Bmob.Query(dbTable);
    let tempScores = new Array();

    query.select('nickName', 'score', 'avatarurl');
    query.descending('score');

    query.find({
      success: function (results) {
        console.log('Info >> 正在读取成绩信息......');
        for (let ii = 0; ii < results.length; ii++) {
          tempScores.push({
            'nickName': results[ii].get('nickName'),
            'score': results[ii].get('score'),
            'avatarUrl': results[ii].get('avatarurl')
          });
          if (app.globalData.userInfo.nickName === results[ii].get('nickName')) {
            app.globalData.myInfoScore.index = ii;
            app.globalData.myInfoScore.nickName = results[ii].get('nickName');
            app.globalData.myInfoScore.score = results[ii].get('score');
            app.globalData.myInfoScore.avatarUrl = results[ii].get('avatarurl');
          }
        }
        app.globalData.userScores = tempScores;
        console.log('Info >> 成绩信息读取完毕。');
      },
      error: function (error) {
        console.log('Info >> 成绩读取失败！\n' + error.code + '--' + error.message);
      }
    });

    //读取试题设置参数
    let paperParameters = {};
    var dbPaper = Bmob.Object.extend('PaperParameters');
    var query = new Bmob.Query(dbPaper);

    query.find({
      success: function (results) {
        console.log('Info >> 正在读取试卷参数......');
        paperParameters['subjectNum'] = results[0].get('subjectNum');
        paperParameters['scorePerSubject'] = results[0].get('scorePerSubject');

        wx.setStorage({
          key: 'paperParameters',
          data: paperParameters,
        });
        console.log('Info >> 试卷参数读取完毕。');
      }, error: function (error) {
        console.log('Info >> 试卷参数读取失败！\n' + error.code + '--' + error.message);
      }
    });

    // 读取单位信息表
    let dictCompany = new Array();
    let company = Bmob.Object.extend('Company');
    let queryCompany = new Bmob.Query(company);

    queryCompany.find({
      success: function (results) {
        console.log('Info >> 正在读取单位信息......');
        results.forEach(function (result) {
          let tempStr = result.get('CmpName');
          dictCompany.push({'Id': result.id, 'CmpName': tempStr});
        });
        wx.setStorage({
          key: 'dictCompany',
          data: dictCompany,
        });
        console.log('Info >> 单位信息读取完毕。');
      },
      error: function (error) {
        console.log('Info >> 单位信息读取失败： ' + error.code + '\n' + error.message);
      }
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
      url: '../practice/practice',
    });
    
  }

})