const app = getApp();
let InputVal = "",
  ImgSuccess = false,
  SubmitInfo = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mileage: '',
    list: [{
      title: "车牌号码",
      value: '',
      name: "hphm"
    }, {
      title: "品牌车型",
      value: '',
      name: 'hpzl'
    }, {
      title: "车架号码",
      value: '',
      name: 'classno'
    }, {
      title: "发动机号",
      value: '',
      name: 'engineno'
    }, {
      title: "上牌年月",
      value: '',
      name: 'drivetime'
    }],
    hid: true,
    imgUrl : 'https://img.wanchepin.com/public/wap/website/carid.png'
  },
  listInit() {
    var arr = this.data.list;
    var brr = arr.map(item => {
      return {
        ...item,
        value: ""
      }
    });
    ImgSuccess = false;
    SubmitInfo = "";
    InputVal = "";
    this.setData({
      list: brr,
      imgUrl : 'https://wcp.wanchepin.com/public/wap/website/carid.png',
      mileage: ''
    })
  },
  inputblur(e) {
    InputVal = e.detail.value;
  },
  submit() {
    if (!ImgSuccess) {
      wx.showToast({
        title: '请上传行驶证照片',
        icon: "none",
        duration: 2000
      })
    } else if (InputVal === "") {
      wx.showToast({
        title: '请输入行驶里程',
        icon: "none",
        duration: 2000
      })
    } else if (isNaN(InputVal)) {
      wx.showToast({
        title: '行驶里程必须为数字',
        icon: "none",
        duration: 2000
      })
    } else {
      app.http.post("/api/diag/saveCarInfo", {
        ...SubmitInfo,
        mileage: InputVal
      }).then(res => {
        wx.showToast({
          title: '保存成功'
        })
        setTimeout(() => {
          app.backToIndex.set("carinfo_addcars", false); //这里设置一个标识，跳转到列表页后如果再点返回，正常情况下是回到添加车辆页//面，这里就可以跳过这一步直接回到首页
          wx.navigateTo({
            url: '/pages/carinfo/carlist/index',
          })
        }, 1500)
      })
      // console.log(InputVal, SubmitInfo);
    }
  },
  chooseImg() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        _this.setData({
          imgUrl: tempFilePaths[0]
        });
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({                
          url:   `${app.globalData.HOST}/api/customer/index/upload`,
          filePath: tempFilePaths[0],
           name:   'b068931cc450442b63f5b3d276ea4297',
           formData:  {                  
            token:  app.globalData.token,
            path: "public/wap/website/"                
          },
           success(res)  { 
            wx.hideLoading();
            res  =  JSON.parse(res.data);                  
            let  imgUrl  =  res.data.url; 
            wx.showLoading({
              title: '正在识别中',
            });
            app.http.post("/api/diag/driverLicenseScan", {
              imgurl: imgUrl 
            }).then(r => {
              console.log(r);
              wx.hideLoading();

              if (!r.length) {
                _this.listInit();
                wx.showModal({
                  title: '提示',
                  content: '识别失败，请重新上传！'
                })
              } else {
                var f = true;
                for (var i in r[0]) {
                  if (!r[0][i] && i !== "mileage") {
                    wx.showModal({
                      title: '提示',
                      content: '识别失败，请重新上传！'
                    })
                    _this.listInit();
                    f = false;
                    break;
                  }
                }

                if (f) {
                  ImgSuccess = true;
                  SubmitInfo = r[0];
                  let obj = r[0],
                    objKeys = Object.keys(r[0]),
                    arr1 = _this.data.list;
                  let crr = arr1.map((item, ind) => {
                    return {
                      ...item,
                      value: item.name === "hpzl" ? (obj["brand_label"] + " / " + obj[item.name]) : obj[item.name]
                    }
                  })
                  _this.setData({
                    list: crr
                  })
                }
              }
            })
          },
            fail:   function (e)  {  
            wx.hideLoading();
            _this.listInit();          
            wx.showToast({                    
              title:   '上传失败',
               icon:   'none'                  
            })                
          }              
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.backToIndex.get("carinfo_addcars")) {
      wx.navigateBack({
        delta: getCurrentPages().length
      })
    }
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