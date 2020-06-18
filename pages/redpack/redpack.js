
const app = getApp()
let ImgNum=0,hasRes=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allLoad:true,
    canOpen:false,
    friend:[]
  },
  imgLoad(){
    ++ImgNum;
    if (ImgNum===5){
      hasRes && wx.hideLoading();
      this.setData({
        allLoad: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getLaunchOptionsSync());
    app.http.get('/api/marketing/sendRedPack').then(res => {
      console.log(res)
     // var { timeStamp, nonceStr, package, signType, paySign }
      if (res.package){
      wx.sendBizRedPacket({
        timeStamp: res.timeStamp, // 支付签名时间戳，
        nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
        package: res.package, //扩展字段，由商户传入
        signType: res.signType, // 签名方式，
        paySign: res. paySign, // 支付签名
        success: function (r) {console.log(r)},
        fail: function (e) { console.log(e) }
        })
      }
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
    wx.showLoading({
      title: '加载中',
    })
    app.http.get('/api/golotech/getMyFriends').then(res=>{
      hasRes=true;
      !this.data.allLoad && wx.hideLoading();
        this.setData({
          canOpen:true,
          friend:res.map(item=>{
            return{
              ...item,
              has:true
            }
          }).concat(Array.from({length:5-res.length},()=>{
            return{
              avatar:'',
              nickname:'',
              has:false
            }
          }))
        })
      })
    
  },
tixian(){
  wx.switchTab({
    url: '/pages/partner/income/index'
  })
},
  go_buy(){
    wx.navigateTo({
      url: '/pages/partner/detail/detail?id=374',
    })
  },
  go_wan(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
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
  onShareAppMessage: function (e) {
    console.log(e)
  }
})