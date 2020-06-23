const app = getApp()
let CarNum = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showShadow: false,
    weibao:'',
    carinfo:'',
    importArr: [{
      name: '诊断报告',
      inner_id: 1,
      src: "https://wcp.wanchepin.com/public/wap/x431/diag_report.png"
    }, {
      name: '维保记录',
      inner_id: 2,
        src: "https://wcp.wanchepin.com/public/wap/x431/maintenance.png"
    }, {
      name: '车辆估值',
      inner_id: 3,
        src: "https://wcp.wanchepin.com/public/wap/x431/car_value.png"
    }, {
      name: '卖车报价',
      inner_id: 4,
        src: "https://wcp.wanchepin.com/public/wap/x431/sale_price.png"
    }, {
      name: '违章查询',
      inner_id: 5,
        src: "https://wcp.wanchepin.com/public/wap/x431/break_rule.png"
    }, {
      name: '常见故障',
      inner_id: 6,
        src: "https://wcp.wanchepin.com/public/wap/x431/common_fault.png"
    }],
    chePu: []
  },
  toLogin(){
    var token = app.globalData.token;
    if (!token){
      wx.navigateTo({
        url: "/pages/login/index?type=x431",
      })
    }
  },
  toAddCar(){
    wx.navigateTo({
      url: '/pages/carinfo/addcars/index',
    })
  },
  navigate(e) {
    if (!CarNum) {
      wx.showModal({
        title: '提示',
        content: '您暂未绑定车辆，请先绑定',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/carinfo/addcars/index',
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      let innertype = e.currentTarget.dataset.innertype,
        routeName = '';
      switch (innertype) {
        case 1:
          routeName = 'report';
          break;
        case 2:
          routeName = 'maintenance';
          break;
        case 3:
          routeName = 'carvalue';
          break;
        case 4:
        //  console.log(this.data.carinfo.carInfo.sale_price)
        if (this.data.carinfo.carInfo.sale_price){
            routeName = 'saleprice';
        }
         else{
            routeName = 'salepriceedit';
         }
          break;
        case 5:
          routeName = 'illegalquery';
          break;
        case 6:
          routeName = 'commonfaults';
          break;
        default:
          break;
      }
      if (routeName) {
        if (routeName ==="salepriceedit"){
          wx.setStorageSync("carInfo",this.data.carinfo.carInfo);
        }
        wx.navigateTo({
          url: '/pages/carinfo/' + routeName + "/index",
        })
      }
    }


  },
  toCarlist() {
    wx.navigateTo({
      url: '/pages/carinfo/carlist/index',
    })
  },
  toAddcar() {
    wx.navigateTo({
      url: "/pages/carinfo/addcars/index",
    })
  },
  toGo(e) {
    app.pageToTop.set(0, false);
    if (e.target.dataset.adinfo) {
      let {
        kind,
        url,
        appid
      } = e.target.dataset.adinfo;
      // console.log(kind, url, appid)

      switch (kind) {
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
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    
    //广告部分
    const chePu = await app.http.post('/api/Marketing/getAdv', {
      type: 2
    });
    this.setData({
      chePu,
      showShadow: app.globalData.token?true:false
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    app.backToIndex.allBack();//设置标识为已回到首页
    const firstIndex = await app.http.post('/api/diag/getMyCar');
   // console.log("请求", firstIndex);
    CarNum = firstIndex.is_band_car;
    this.setData({
      carcount: firstIndex.is_band_car,
      carinfo: firstIndex
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})