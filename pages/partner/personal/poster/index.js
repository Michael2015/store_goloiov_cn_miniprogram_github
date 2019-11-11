import compositePoster from '../../../../utils/compositePoster/compositePoster'
const app = getApp()
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
  data: {
    info:'',
    poster_list:[],
    limit:20
  },
  onLoad: function (options) {
    self = this;
    this.getPosterList();
  },

  getPosterList()
  {
    app.http.get('/api/partner.partner/getposterlist').then(res => {
     this.setData({
      poster_list:res
     });
    });
  },
  goDetail(e){
    let id = e.currentTarget.dataset.id;
    let target_poster = this.data.poster_list.filter(function (item, index) {
      return index == id;
    });
    wx.navigateTo({
      url: `/pages/partner/personal/poster/detail?id=${target_poster[0]['id']}`
    })
  }
  

})