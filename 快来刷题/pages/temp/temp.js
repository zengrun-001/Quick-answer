// pages/temp/temp.js


/**
 * 将答案解析为选项
 */
function decodeAnswerToOption() {
  let Answer = 'ABCEFG';
  console.log('Info: >> 您的答案为：' + Answer);
  
  if (Answer) {
    let hua = ((Answer.toUpperCase()).split('')).sort();
    console.log(hua);
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskVisible: false,
    maskDivIndex: null,
    maskDivColorEnable: false,
    currentSubjectIndex: 5,
    huatempArray: {},
    huaChecked: true
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    let huatempArray = {};
    for (let ii=0; ii<100; ii++) {
      if (ii % 2 == 0) {
        huatempArray[ii] = ii+1;
      } else {
        huatempArray[ii] = ii+1;
      }
    }

    this.setData({
      huatempArray: huatempArray,
    });
  
  },

  /**
   * 显示与隐藏答题卡
   */
  showMask: function() {
    this.setData({
      maskVisible: !this.data.maskVisible
    });
    let hua = new Array(10);
    console.log(hua);
    decodeAnswerToOption();

    this.setData({
      huaChecked: !this.data.huaChecked
    });

    console.log(this.data.huaChecked);
  },

  /**
   * 响应答题卡题目点击
   */
  maskDivTap: function(e) {
    let divId = e.currentTarget.id;
    this.setData({
      maskDivIndex: divId,
      currentSubjectIndex: parseInt(divId)+1
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
  
  }
})