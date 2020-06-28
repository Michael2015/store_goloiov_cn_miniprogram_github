const app=getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:""
  },
  toUrl(e){
    let url = e.currentTarget.dataset.url;
   // console.log(url);
    wx.navigateTo({
      url: "/pages/common/goout/index?url=" + url,
    })
  /*  switch (kind) {
      case 1:
      case 2:
      case 3:
        wx.navigateTo({
          url
        })
        break;
      case 4:

        wx.navigateToMiniProgram({
          appId: appid,
          path: url,
          success(res) {
            // 打开成功
            // console.log(res)
          }
        })
        break;
      case 5:
        wx.navigateTo({
          url: "/pages/common/goout/index?url=" + url,
        })
        break;
      default:
        break;
    }*/
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    app.http.post("/api/diag/getDiagReport").then(res => {

      console.log(res);
      this.setData({
        list: res
      }, () => {
        wx.hideLoading();
      });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})