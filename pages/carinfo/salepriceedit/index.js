const app = getApp();
let InputVal = '', CanSub = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfo: '',
    list: [{ title: '品牌车型', name: "brand_label", value: "" }, { title: '万公里数', name: "mileage", value: "" }, { title: '购车时间', name: "drivetime", value: "" }, { title: '卖车报价', value: "", name: "sale_price" }]
  },
  sub() {
    if (!InputVal) {
      wx.showToast({
        title: '请填写卖车报价',
        icon: "none"
      })
    }
    else if (CanSub) {
      wx.showLoading({
        title: '正在保存',
      });
      app.http.post("/api/diag/editCarInfo",{
        sale_price: InputVal,
        id: this.data.carInfo.id
      }).then(res => {
        wx.hideLoading();
        console.log(res);
        app.backToIndex.set("carinfo_salepriceedit", false);
        wx.showToast({
          title: '保存成功',
        })
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/carinfo/saleprice/index',
        })
      },1500)
      })
    }
  },
  blur(e) {
    let val = e.detail.value;
    InputVal = val;
    if (isNaN(val)) {
      wx.showToast({
        title: '卖车报价必须为数字',
        icon: "none"
      })
      CanSub = false;
    }
    else {
      CanSub = true;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let carInfo = wx.getStorageSync("carInfo"), list = this.data.list.map(item => {
      return {
        ...item,
        value: item.name === "brand_label" ? (carInfo["brand_label"] + " / " + carInfo["hpzl"]) : carInfo[item.name]
      }
    })
    InputVal = carInfo.sale_price||'';
    CanSub = carInfo.sale_price?true:false;
    this.setData({
      carInfo: wx.getStorageSync("carInfo"),
      list
    }, () => {
      wx.removeStorageSync("carInfo");
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
    console.log(getCurrentPages());
    if (!app.backToIndex.get("carinfo_salepriceedit")) {
      wx.navigateBack({
        delta: getCurrentPages().length
      })
    } 
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