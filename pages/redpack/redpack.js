
const app = getApp()
let ImgNum=0,hasRes=false,Token="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allLoad:true,
    canOpen:false,
    hadOpen:null,
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
    wx.showLoading({
      title: '加载中',
    });
    var flag=false;
    Token=app.globalData.token;
if(wx.getStorageSync(Token+'hasOpen')){
  flag=true;
}
this.setData({
  hadOpen: flag
},()=>{
wx.hideLoading();
});
   
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
    /*wx.showLoading({
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
      }) */
    
  },
openRedPack(){
  wx.setStorageSync(Token+'hasOpen', true);
  this.setData({
    hadOpen:true
  });
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