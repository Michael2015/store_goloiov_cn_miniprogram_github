// pages/partner/personal/admin/applyrecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: [],
    applyStatus: {
      '0': '审核中',
      '1': '已通过',
      '2': '已驳回'
    }
  }, 

  checkitem(e){
    wx.navigateTo({
      url: `/pages/partner/personal/servervip/applydetail?id=${e.currentTarget.dataset.id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.http.get('/api/partner/home/server_vip_apply_log').then(res => {
      res = res.map(item => {
        return {
          ...item, time: item.check_time.length ? item.check_time : item.add_time
        }
      })
      this.setData({
        showList: res
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

  }
})