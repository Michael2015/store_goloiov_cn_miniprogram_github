const app = getApp()
let self;
let isDisabled = 1;
Page({
  data: {
    sendingcode:false,
    checkText:'获取验证码',
    code:'',
    phone:''
  },

  setCode(e) {
    let value = e.detail.value;
    this.setData({
        code: value
    })
  },
  getCode()
  {
      let  phone = this.data.phone;
      if (this.data.sendingcode) return
      if (!/^1[\d]{10}$/.test(phone)) {
          wx.showToast({
              title: '请输入正确手机号',
              icon: 'none'
          })
          return
      }
      this.data.sendingcode = true
      app.http.get('/api/server/sms/sendCode', {
          mobile: phone,
          event: 'virtual_property'
      }).then(res => {
          var all = 60 // 30秒
          this.setData({
              checkText: all + 's',
              sendedcode: true
          })
          wx.showToast({
              title: '发送成功',
              icon: 'none'
          })
          const timer = setInterval(() => {
              if (--all <= 0) {
                  clearInterval(timer)
                  this.setData({
                      checkText: '获取验证码'
                  })
                  this.data.sendingcode = false
              } else {
                  this.setData({
                      checkText: all + 's'
                  })
              }
          }, 1000)
      }, e => {
          // 报错了
          this.data.sendingcode = false
      })
  },
  submit()
  {
    if(!this.data.code)
    {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    app.http.get('/api/server/sms/checkCode', {
      phone: this.data.phone,
      smscode: this.data.code
    }).then(res => {
      app.globalData.isCheckPhone = 1;
      wx.navigateBack({delta:1});
    })
  },
  onLoad()
  {
    this.setData({
      phone:app.globalData.userInfo.phone
    });
  }

})