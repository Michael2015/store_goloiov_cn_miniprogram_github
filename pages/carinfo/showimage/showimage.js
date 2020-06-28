// pages/carinfo/showimage/showimage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    second:[{title:"车牌号码:",value:"cascsc655"},
    {title:"VIN码:",value:"cascsc655"},
    {title:"车辆品牌/车型:",value:"cascsc655"},
    {title:"年款:",value:"cascsc655"},
  ],
  three:[{title:"名称:",value:"cascsc655"},
    {title:"地址:",value:"cascsc655"},
    {title:"联系电话:",value:"cascsc655",icon:"/assets/image/lxdh.png",color:"#007aff"},
    {title:"X431序列号:",value:"cascsc655"},
    {title:"检测时间:",value:"cascsc655"},
    {title:"上传地址:",value:"cascsc655",icon:"/assets/image/dz.png",color:"#007aff"},
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.url);
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      src: options.url
    }, () => {
      wx.hideLoading();
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