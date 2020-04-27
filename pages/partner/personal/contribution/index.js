// pages/partner/personal/contribution/detail.js
const app = getApp()
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 200
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    loaded: false,
    contribution: 0,
    userInfo:{},
    contibutionInfo:{},
    page: 1,
    isRuleTrue: false,
  },
  load() {
    if (!this.data.loaded) {
      wx.showLoading()
      this.data.loaded = true
      app.http.get('/api/partner.partner/getUserContributionDetail', {}, true).then(data => {
        if (data) {
          this.data.list.push(...data.data)
          console.log(data)
          this.setData({
            list: this.data.list,
            userInfo:data.user_info,
            contibutionInfo:data.contribution_info
          })
        }
        wx.hideLoading()
        this.data.loaded = false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //详情页
  goDetail: function () {
    wx.navigateTo({
      url: `/pages/partner/personal/contribution/detail`
    })
  },

  //打开规则提示
  showRule: function () {
    this.setData({
      isRuleTrue: true
    })
  }
  
})