import compositePoster from '../../../../utils/compositePoster/compositePoster'
const app = getApp()
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
  data: {
    list:[],
    loading: false,
    loaded: false,
    page: 1,
  },

  load() {
    const size = 10
    if (!this.data.loading && !this.data.loaded) {
      wx.showLoading()
      this.data.loading = true
      app.http.get('/api/partner.partner/getposterlist', {
        page: this.data.page,
        limit: size
      }).then(data => {
        console.log(data)
        if (data) {
          this.data.list.push(...data)
          this.setData({
            list: this.data.list
          })
          if (data.length < size) {
            this.setData({
              loaded: true
            })
          } else {
            this.data.page++
          }
        }
        wx.hideLoading()
        this.data.loading = false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load()
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
    if (this.data.loading) {
      wx.hideLoading()
    }
  },
  /*
  onLoad: function (options) {
    self = this;
    this.getPosterList();
  },
  */
  /*
  getPosterList()
  {
    app.http.get('/api/partner.partner/getposterlist').then(res => {
     this.setData({
      //poster_list:res
       poster_list:[]
     });
    });
  },
  */
  goDetail(e){
    let id = e.currentTarget.dataset.id;
    let list = this.data.list.filter(function (item, index) {
      return index == id;
    });
    wx.navigateTo({
      url: `/pages/partner/personal/poster/detail?id=${list[0]['id']}`
    })
  }
})
