import compositePoster from '../../../../utils/compositePoster/compositePoster'

const app = getApp()
let WxParse = require('../../../../utils/wxParse/wxParse.js')
var self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
  data: {
    info:'',
  },
  onLoad: function (options) {
    self = this;
    this.setData({
      phone: app.globalData.userInfo.phone || '',
      info: app.varStorage.get('storeDetail'),
    })
  },

  //生成海报
  goDetail(e)
  {
    compositePoster.createPoster({
      data: Object.assign(self.data.info, {
          uid: app.globalData.userInfo.uid,
          pid: app.globalData.userInfo.uid
      })
  })

    let poster_id = e.target.dataset.id;
    //wx.navigateTo({
      //url: '/pages/partner/personal/poster/detail?id=' + poster_id
    //});
  }

})