//index.js
//获取应用实例
const app = getApp()
var Bmob = require('../../utils/bmob.js')


/**
 * 构造一个比较函数，降序排列
 */
function huaBy(name) {
  return function(item1, item2) {
    var itm1, itm2;
    if (typeof item1 === 'object' && typeof item2 === 'object' && item1 && item2) {
      itm1 = item1[name];
      itm2 = item2[name];
      if (itm1 === itm2) {
        return 0;
      }
      if (typeof itm1 === typeof itm2) {
        return itm1 < itm2 ? 1 : -1;
      }
      return typeof itm1 < typeof itm2 ? 1 : -1;
    } else {
      throw('error');
    }
  }
}


Page({
  data: {
    userScores: [],
    myScore: null,
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    let loading = {
      duration: 1000
    }
    app.showToast(loading);

    console.log('Info >> 正在加载排行信息......');

    let tempScores = app.globalData.userScores;

    for (let ii = 0; ii < tempScores.length; ii++) {
      if (tempScores[ii].nickName === app.globalData.myInfoScore.nickName) {
        tempScores[ii].score = app.globalData.myInfoScore.score;
      }
    }

    tempScores.sort(huaBy('score'));

    this.setData({
      userScores: tempScores
    })

    for (let ii = 0; ii < tempScores.length; ii++) {
      if (tempScores[ii].nickName === app.globalData.myInfoScore.nickName) {
        this.setData({
          myScore: {
            'index': ii,
            'nickName': tempScores[ii].nickName,
            'score': tempScores[ii].score,
            'avatarUrl': tempScores[ii].avatarUrl
          }
        });
      }
    } 
    console.log('Info >> 排行信息加载完毕。');   
  },

  /**
   * 成绩排序
   */
  onSort: function() {
    var huaObjectArray = new Array();
    var huaScore = {};

    for (let ii=0; ii < 5; ii++) {
      huaObjectArray.push({
        'nickName': 'hua'+ii,
        'score': Math.floor(Math.random()*100)
      });
    }
    huaObjectArray.sort(huaBy('score'));

    for (let ii=0; ii < huaObjectArray.length; ii++) {
      if (huaObjectArray[ii].nickName === 'hua2') {
        huaScore = huaObjectArray[ii];
        huaScore.index = ii;
      }
    }
    this.setData({
      userScores: huaObjectArray,
      myScore: huaScore
    });


  }


});
