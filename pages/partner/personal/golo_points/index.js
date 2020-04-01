// pages/partner/personal/golo_points/index.js
const app = getApp()
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    loading: false,
    loaded: false,
    useable_integral: 0,
    page: 1,
  },
  load() {
    const size = 10
    if (!this.data.loading && !this.data.loaded) {
      wx.showLoading()
      this.data.loading = true
      app.http.get('/api/partner.partner/getUserIntegralList', true, {
        page: this.data.page,
        limit: size
      }).then(data => {
        if (data) {
          this.data.list.push(...data.data)
          this.setData({
            list: this.data.list,
            useable_integral:data.useable_integral
          })
          if (data.data.length < size) {
            this.setData({
              loaded: true
            })
          } else {
            this.data.page++
          }
        }
        wx.hideLoading()
        this.data.loading = false
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