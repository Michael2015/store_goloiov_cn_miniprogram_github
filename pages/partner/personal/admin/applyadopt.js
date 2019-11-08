// pages/partner/personal/admin/applyadopt.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyObj:{},
    levelObj:{
      '2':'区县区域管理员',
      '3':'市区域管理员',
      '4':'省区域管理员'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id
    app.http.get('/api/partner/home/get_my_region_log_detail',{id:options.id}).then(res=>{
      this.setData({
        applyObj:res
      })
    })
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