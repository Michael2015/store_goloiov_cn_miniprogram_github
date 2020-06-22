const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ""
  },
  toXuanze(e){
    var id = e.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '您确定要选择该车辆为默认车辆吗？',
      success(res) {
        if (res.confirm) {
          app.http.post("/api/diag/editCarInfo", {
            is_default: 1,
            id
          }).then(res => {
            wx.showToast({
              title: '设置成功'
            })
            setTimeout(() => {
              wx.reLaunch({
                url: "/pages/firstindex/index",
              })
            }, 1600)

          })
        } else if (res.cancel) {

        }
      }
    })


    
    
  },
  toDetail(e){
   // console.log(e)
    app.backToIndex.set("carinfo_cardetails", true);
    var id =e.target.dataset.id;
    wx.navigateTo({
      url: "/pages/carinfo/cardetails/index?id="+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(getCurrentPages());
    wx.showLoading({
      title: '加载中',
    });
    app.http.post("/api/diag/getCarList").then(res=>{
     // console.log(res.carInfo)
       this.setData({
         list: res.carInfo
       }, () => {
         wx.hideLoading();
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