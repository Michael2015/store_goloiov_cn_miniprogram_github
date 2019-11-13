// pages/partner/personal/admin/applyrecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: [],
    adminObj: {
      '2': '区/县区域管理员',
      '3': '市区域管理员',
      '4': '省区域管理员'
    },
    applyObj: {
      '0': '审核中',
      '1': ' 已通过',
      '-1': '已驳回'
    }
  }, 

  checkitem(e){
    wx.navigateTo({
      url: `/pages/partner/personal/admin/applydetail?id=${e.currentTarget.dataset.id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.http.get('/api/partner/home/get_my_region_log').then(res => {
      res = res.map(item => {
        return {
          ...item, addtime: new Date(item.addtime* 1000).toLocaleString()
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