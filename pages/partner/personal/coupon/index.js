import compositePoster from '../../../../utils/compositePoster/compositePoster'

const app = getApp()
let WxParse = require('../../../../utils/wxParse/wxParse.js')
var self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
  data: {
    couponList:[]
  },
  onLoad: function (options) {
    self = this;
    this.getMyCoupon();
  },
  toGo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  getMyCoupon()
  {
    wx.showLoading()
    app.http.get('/api/coupon/getcouponlist', {}).then(res => {
      wx.hideLoading()
      this.data.couponList.push(...res)
      this.setData({
        couponList: this.data.couponList
      })
    }).catch((e) => {
      wx.hideLoading()
    })
  },
  goDetails(e)
  {
    let product_ids = e.currentTarget.id;
    if(product_ids.indexOf(",") != -1){
      wx.navigateTo({
        url: '/pages/partner/index/index'
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/partner/detail/detail?id=' + product_ids
      })
    }
  }

})