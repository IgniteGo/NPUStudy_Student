// pages/user/info/index.js
const app = getApp()
Page({
  data: {
    userInfo: null,
    spinShow: false,
    levelIndex: 0,
    ccAge:0
  },
  onLoad: function(options) {
    this.loadUserInfo()
  },
  loadUserInfo() {
    let _this = this
    _this.setData({
      spinShow: true
    });
    app.formPost('/api/wx/student/user/current', null).then(res => {
      var util=require('../../../utils/util')
      let curTime=util.formatTime(new Date());
      res.response.age =  curTime.slice(0,4) - res.response.birthDay.slice(0,4)
     
      if (res.code == 1) {
        _this.setData({
          userInfo: res.response,
          levelIndex: res.response.userLevel-1
        });
      }
      _this.setData({
        spinShow: false
      });
    }).catch(e => {
      _this.setData({
        spinShow: false
      });
      app.message(e, 'error')
    })
  },
  bindLevelChange: function(e) {
    this.setData({
      levelIndex: e.detail.value
    })
  },
  bindDateChange(e) {
    let {
      value
    } = e.detail;
    this.setData({
      "userInfo.birthDay": value
    })
    var util=require('../../../utils/util')
    let curTime=util.formatTime(new Date());
    let curAge =  curTime.slice(0,4) - value.slice(0,4)
    this.setData({
      "userInfo.age": curAge
    })
  },
  formSubmit: function(e) {
    let _this = this
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    app.formPost('/api/wx/student/user/update', e.detail.value)
      .then(res => {
        if (res.code == 1) {
          wx.reLaunch({
            url: '/pages/my/index/index',
          });
        } else {
          app.message(res.message, 'error')
        }
        wx.hideLoading()
      }).catch(e => {
        app.message(e, 'error')
        wx.hideLoading()
      })
  }
})