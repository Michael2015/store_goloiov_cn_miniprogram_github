const app = getApp();
let that = this;
let Id = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pla: "请输入",
    plaClass: 'pla_class_none',
    list: [{
        title: "车牌号码",
        value: '',
        name: "hphm"
      }, {
        title: "车辆品牌",
        value: '',
        name: 'brand_label'
      },
      {
        title: "车辆车型",
        value: '',
        name: 'hpzl'
      },
      {
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
      },
      {
        title: "行驶里程",
        value: '',
        name: 'mileage'
      }
    ],
  },
  bindDateChange(e) {
    this.setData({
      "list[5].value": e.detail.value
    })
  },
  blur(e) {
    var val = e.detail.value,
      ind = Number(e.target.dataset.ind),
      list = this.data.list;
    list[ind].value = val;
    this.setData({
      list: list
    });
  },
  save() {
    var list = this.data.list,
      flag = true;
    for (var i in this.data.list) {
      if (list[i].value === "") {
        wx.showToast({
          title: '请填写' + list[i].title,
          icon: "none"
        });
        flag = false;
        break;
      } else if (list[i].name === "mileage" && isNaN(list[i].value)) {
        wx.showToast({
          title: '行驶里程必须为数字',
          icon: "none"
        });
        flag = false;
        break;
      }
    }
    if (flag) {
      var list1 = this.data.list,
        obj = {};
      for (var i of list1) {
        obj[i.name] = i.value;
      }
      console.log(obj);
      app.http.post("/api/diag/editCarInfo", {
        id: Id,
        ...obj
      }).then(res=>{
        wx.showToast({
          title: '保存成功'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/carinfo/carlist/index',
          })
        }, 1700)
      })
    }

  },
  del() {
    wx.showModal({
      title: '提示',
      content: '您确定要删除该车辆信息吗？',
      success(res) {
        if (res.confirm) {
          app.http.post("/api/diag/editCarInfo", {
            id: Id,
            is_del:1
          }).then(res=>{
            wx.showToast({
              title: '删除成功'
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/carinfo/carlist/index',
              })
            }, 1700)

          })
        } else if (res.cancel) {
         
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    var id = options.id;
    Id = id;
    app.http.post("/api/diag/getCarList", {
      id
    }).then(res => {
      //  console.log(res.carInfo[0]);
      var brr = this.data.list,
        drr = res.carInfo[0];
      var crr = brr.map(item => {
        return {
          ...item,
          value: drr[item.name]
        }
      });
      this.setData({
        list: crr
      })
    });

    //app.http.post("/api/diag/editCarInfo");
    ///api/diag / getCarList
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