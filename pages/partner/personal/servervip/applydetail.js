// pages/partner/personal/admin/applyrecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInfo: [],
    applyStatus: {
      '0': '审核中',
      '1': '已通过',
      '2': '已驳回'
    }
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nid = options.id;
    app.http.get('/api/partner/home/server_vip_apply_detail?id='+nid).then(res => {
      this.setData({
        showInfo: res
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
  viewbigimg: function(e) {
    var imgArr = [];
    imgArr[0] = e.currentTarget.dataset.license
    wx.previewImage({
      current: e.currentTarget.dataset.license, //当前图片地址
      urls: imgArr
    })
  }
})