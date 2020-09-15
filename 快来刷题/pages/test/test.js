// pages/DB/database.js
//获取应用实例
const app = getApp()

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

var Bmob = require('../../utils/bmob.js')
var subjectIds = new Array()
var subjectColorArray = new Array()
var subjectAnswerArray = new Array()
var userAnswers = []
var stdAnswers = []
var touchMoveStart = 0
var touchMoveStartX = 0
var touchMoving = 0
var subjectIndex = 0
var scorePerSubject = 20
var chkbxChecked = {
  'A': false, 'B': false, 'C': false, 'D': false, 'E': false, 'F': false, 'G': false
}

function getArrayItems(arr, num) {
  //新建一个数组，将传入的数组复制过来用于运算，而不是在原数组上操作。
  var tempArray = new Array();
  for (let index in arr) {
    tempArray.push(arr[index]);
  }

  //构建新的数组，保存取出的项目
  var returnArray = new Array();
  for (let ii=0; ii<num; ii++) {
    //判断数组长度，防止下标越界
    if (tempArray.length > 0) {
      //从数组中产生一个随机索引
      var randmIndex = Math.floor(Math.random()*tempArray.length);
      //将此随机索引对应的数组元素复制出来
      returnArray[ii] = tempArray[randmIndex];
      //然后删掉此索引对应的数组元素，此时的tempArray变为新的数组
      tempArray.splice(randmIndex, 1);
    } else {
      //数组中的数据全部取完，即 数组长度 < 要取出的数据数目，则退出
      break;
    }
  }
  return returnArray;
}

function modifyDbTable(tableName, tempdata) {
  var that = this;
  var dbTable = Bmob.Object.extend(tableName);
  var query = new Bmob.Query(dbTable);

  query.equalTo('nickName', tempdata.nickName);

  query.find({
    success: function(result) {
      result[0].set('score', tempdata.score);
      result[0].save();
      console.log('Info >> 成绩写入成功：' + tempdata.score);
    },
    error: function(error) {
      console.log('Info >> 成绩写入失败！\n' + error.code + '--' + error.message);
    }
  });
}

/**
 * 将答案解析为选项
 */
function decodeAnswerToOption() {
  let Answer = userAnswers[subjectIndex];
  for (let ii = 0; ii < ALPHABET.length; ii++) {
    chkbxChecked[ALPHABET[ii]] = false;
  }
  if(Answer) {
    let tempArray = ((Answer.toUpperCase()).split('')).sort();
    for (let ii=0; ii < tempArray.length; ii++) {
      chkbxChecked[tempArray[ii]] = true;
    }
  }
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastHidden: true,
    prevSubjectBtn_disabled: false,
    nextSubjectBtn_disabled: false,
    showRightToptips: false,
    showWrongToptips: false,
    subjectType: '0', // '0': 单选，'1'：多选
    subjectIndex_wxml: subjectIndex + 1,
    subjectNum: 5,
    stdAnswersToWxml: '',
    subject: '',
    options: [],
    score: 0,
    answerAnalysis: '',
    hiddenAnalysis: true,
    optionScrollViewHeight: 300,
    maskHidden: true,
    maskDivIndex: null,
    maskDivColorEnable: false,
    maskSubjectArray: [],
    subjectColorArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let paperParameters = wx.getStorageSync('paperParameters');
    this.setData({
      subjectNum: paperParameters.subjectNum,
    });    
    scorePerSubject = paperParameters.scorePerSubject;    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let res = wx.getStorageSync('totalSubjectIds');
    console.log('Info >> 测试题目加载完毕。');
    subjectIds = getArrayItems(res, this.data.subjectNum); 

    let tempArray = new Array();
    for (let ii = 1; ii <= this.data.subjectNum; ii++) {
      tempArray.push(ii);
      subjectColorArray[ii-1] = '0';
      subjectAnswerArray[ii-1] = '';
      userAnswers[ii-1] = '';
    }
    this.setData({
      maskSubjectArray: tempArray,
      score: 0
    });
    this.loadSubject();
    
    stdAnswers = [];
    subjectIndex = 0;  
    
  },

  //上一题
  prevSubject: function (e) {
    subjectIndex--;
    if (subjectIndex < 0) {
      subjectIndex++;
      this.setData({
        prevSubjectBtn_disabled: true
      })
    } else {
      this.loadSubject();
    }
  },


  //下一题
  nextSubject: function (e) {
    var that = this;

    //验证答案，显示顶部提示窗
    if (userAnswers[subjectIndex] == stdAnswers[subjectIndex]) {
      subjectColorArray[subjectIndex] = '1';
      that.setData({
        showRightToptips: true,
        showWrongToptips: false
      });
      setTimeout(function () {
        that.setData({
          showRightToptips: false
        });
      }, 1000);
      // 答案正确，计算得分
      let answerCount = 0;
      for (let ii=0; ii< subjectColorArray.length; ii++) {
        if (subjectColorArray[ii] == '1') {
          answerCount++;
        }
      }
      that.setData({
        score: answerCount*scorePerSubject
      });
    } else {
      //显示答案解析
      if (userAnswers[subjectIndex] !== '') {
        subjectColorArray[subjectIndex] = '2';
      }
      that.setData({
        showRightToptips: false,
        showWrongToptips: true,
      });
      setTimeout(function () {
        that.setData({
          showWrongToptips: false
        });
      }, 1000);
    }

    subjectIndex++;    

    if (subjectIndex >= subjectIds.length) {
      subjectIndex--;
      this.setData({
        nextSubjectBtn_disabled: true
      });
      //答题结束提示
      wx.showModal({
        title: '答题结束',
        content: '您的成绩为' + that.data.score + '，重新开始？',
        showCancel: true,
        cancelText: '退出',
        cancelColor: 'red',
        confirmText: '重试',
        success: function (res) {
          //点击确认，重新开始；点击退出，则返回上一级
          if (res.confirm) {
            that.onShow();
          } else if (res.cancel) {
            app.globalData.myInfoScore.score = that.data.score;
            modifyDbTable('Users',
              {
                'nickName': app.globalData.userInfo.nickName,
                'score': that.data.score
              });

            wx.switchTab({
              url: '../../pages/rank/rank',
            });
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
      
    } else {
      this.loadSubject();
    }

    // 刷新选项列表 Scroll-view
    this.refreshScrollView();   
  },

  /**
   * 刷新题目
   */
  loadSubject: function() {    
    this.setData({
      prevSubjectBtn_disabled: false,
      nextSubjectBtn_disabled: false
    });

    var that = this;
    var dbTable = Bmob.Object.extend("dbSht_SingleChoose");
    var query = new Bmob.Query(dbTable);
    var tempOptions = new Array();

    query.get(subjectIds[subjectIndex], {
    success: function (result) {
      decodeAnswerToOption();
      for (var ii=0; ii<result.get('optionNum'); ii++) {
        tempOptions.push({'chkbxChecked': chkbxChecked[ALPHABET[ii]], 'alpha': ALPHABET[ii], 'option': result.get('option'+ALPHABET[ii])});
      }
      stdAnswers[subjectIndex] = result.get('answer');

      let tempAnalysis = result.get('analysis');

      if (!tempAnalysis) {
        tempAnalysis = '';
      }
      
      that.setData({
        subjectType: result.get('subjectType'),
        subjectIndex_wxml: subjectIndex + 1,
        subject: result.get('subject'),
        options: tempOptions,
        answerAnalysis: tempAnalysis,
        hiddenAnalysis: true,
        subjectColorArray: subjectColorArray,
      });
    },
    error: function (results, error) {
      console.log("Info >> 题目加载错误：" + error.code + "--" + error.message);
    }  });
  },

  /**
   * 刷新选项列表 Scroll-view
   */
  refreshScrollView: function() {
    var that = this;
    var bodyHeight = 0;
    var subjectHeight = 0;

    wx.createSelectorQuery().select('.huapage').boundingClientRect().exec(function (res) {
      bodyHeight = res[0].height;
      wx.createSelectorQuery().select('.huapage-subject').boundingClientRect().exec(function (res) {
        subjectHeight = res[0].height;

        if (subjectHeight < bodyHeight) {
          that.setData({
            optionScrollViewHeight: bodyHeight - subjectHeight - 20
          })
        } else {
          that.setData({
            optionScrollViewHeight: 350
          })
        }
      });
    });  
  },

  /**
   * 点击选项
   */
  optionsRatioClick: function(e) {
    var tempOption = e.detail.value;
    var Option1 = (tempOption.toString()).replace(/,/g, '');

    var Option2 = (((Option1.toUpperCase()).split('')).sort()).join('');

    userAnswers[subjectIndex] = Option2;
    subjectAnswerArray[subjectIndex] = Option2;

  },

  /**
   * 响应答题卡题目点击
   */
  maskDivTap: function (e) {
    let divId = parseInt(e.currentTarget.id);
    this.setData({
      maskHidden: !this.data.maskHidden   
    });
    if (subjectColorArray[divId] != 2) {
      subjectIndex = divId;
      this.loadSubject();
    }
    
  },

  /**
  * 显示与隐藏答题卡
  */
  showMask: function () {
    this.setData({
      maskHidden: !this.data.maskHidden
    });
  },

  /**
  * 在cell上滑动，显示答题卡
  */
  cellTouchStart: function (e) {
    touchMoveStart = e.touches[0].pageY;
    touchMoveStartX = e.touches[0].pageX;
  },

  /**
   * 在cell上滑动，显示答题卡
   */
  cellTouchMove: function (e) {
    touchMoving = e.touches[0].pageY;
  },

  /**
   * 在cell上滑动，显示答题卡
   */
  cellTouchEnd: function (e) {
    if (((touchMoving - touchMoveStart) > 100) && (touchMoveStartX < 250)) {
      this.showMask();
    }
  },
  
})