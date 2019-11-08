// pages/partner/personal/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inited: false,
    name: '',
    avatar: '',
    num: 0,
    partner_level: '',
  },
  to: function (e) {
    const data = e.currentTarget.dataset
    const url = data.url
    wx.navigateTo({ url })
  },
  // 跳转之前查看该用户的申请状态
  SeeFlag(e) {
    app.http.get('/api/partner/home/get_region_partner').then(res => {
      //  后台查不到数据说明没有申请过
      if(res == null){
        // 不需要修改路径
      }else if (res.status == 0) {
        // 审核中
        e.currentTarget.dataset.url = "/pages/partner/personal/admin/applyflag"
      } else if (res.status == 1) {
        // 审核通过
        e.currentTarget.dataset.url = `/pages/partner/personal/admin/applyadopt?id=${res.id}`
      } else if (res.status == -1) {
        // 拒绝通过不需要改路径
      }
      this.to(e)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = app.globalData.userInfo
    app.http.get('/api/partner/index').then(data => {
      if (data) {
        this.setData({
          num: data.member_nums,
          name: this.cut(data.nickName),
          avatar: data.avatar || user.avatar,
          partner_level: data.partner_level_label,
          partner_level_num: data.partner_level
        })
      }
      this.data.inited = true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(user)
    //console.log(app.globalData.userInfo)
  },
  cut(str, len = 15) {
    if (str.length > len) {
      return str.substr(0, len)
    } else {
      return str
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    // 刷新数据
    if (this.data.inited) {
      app.http.get('/api/partner/index').then(data => {
        if (data) {
          this.setData({
            num: data.member_nums,
            name: data.nickName,
            avatar: data.avatar,
            partner_level: data.partner_level_label,
            partner_level_num: data.partner_level
          })
        }
      })
    }
  }
})