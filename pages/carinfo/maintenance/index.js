const app=getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diag_reort: {},
    car:['左前门','左前翼子板','前机盖','车顶','左后门','左后翼子板','后尾门','底大边','右后门','后翼子板','前保险杠','挡风玻璃','右前门','右前翼子板','后保险杠'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    app.http.post("/api/diag/getMaintenanceReport").then(res => {
      console.log(res.diag_report.data);
      this.setData({
        diag_report: res.diag_report.data,
      }, () => {
        wx.hideLoading();
      });
    })

  },

  showInfo(e){
    var material = e.currentTarget.dataset.material;
    var repairType = e.currentTarget.dataset.repairtype;
    var content = '项目类型：'+repairType+';\r\n'; 
    material = JSON.parse(material);
    content += '更换材料：';
    for(var key in material){
      content += material[key].name+';';
    }
    wx.showModal({
      title: "提示信息", // 提示的标题
      content: content, // 提示的内容
      showCancel: false,
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#000000", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
      },
      fail: function () {
          console.log("接口调用失败的回调函数");
      },
      complete: function () {
          console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
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