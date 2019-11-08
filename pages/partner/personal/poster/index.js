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
  //生成海报
  goDetail(e)
  {
    let id = e.currentTarget.dataset.id;
    let target_poster = this.data.poster_list.filter(function (item, index) {
      return index == id;
    });
    compositePoster.createPoster({
      data: Object.assign({
          id : 0,// 商品id
          uid: app.globalData.userInfo.uid,//合伙人ID
          pid: app.globalData.userInfo.uid,//店铺ID
          type:'poster',
          image:target_poster[0].img_url,
          store_name:target_poster[0].name
      })
  })
  }

})