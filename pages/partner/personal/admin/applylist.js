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
  handleTime(timeer) {
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
    return new Date(timeer).Format('yy-MM-dd hh:mm:ss'); //"2018-11-15 17:40:00"
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
          ...item, addtime: this.handleTime(item.addtime)
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