 let app
App({
  onLaunch(options) {
    app = this
    // 版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  http: {
    request(url, method, data, isAll=false) {
      wx.showNavigationBarLoading()
      return new Promise((resolve, reject) => {
        url = `${app.globalData.HOST}${url}`
        let sendData = {
          url,
          method,
          data: {
            token: app.globalData.token
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            let {
              data
            } = res;
            if (data.code === 200) {
              wx.hideNavigationBarLoading()
              if(isAll){
                resolve(data)
              }else{
                resolve(data.data)
              }
            } 
            else if(data.code === 403)
            {
              let share_user_id = app.globalData.shareInfo.share_user_id;
              let share_partner_id = app.globalData.shareInfo.share_partner_id;
              let share_product_id = app.globalData.shareInfo.share_product_id;
              let type = app.globalData.shareInfo.type;
              wx.reLaunch({url:'/pages/login/index?share_user_id='+share_user_id+'&share_partner_id='+share_partner_id+'&share_product_id='+share_product_id+'&type='+type});
              reject(data)
            }
            else {
              wx.hideLoading()
              wx.showModal({
                content: data.msg ? data.msg : '系统错误,稍后重试 ',
                showCancel: false,
                success() {
                  wx.hideLoading()
                  wx.hideNavigationBarLoading()
                }
              })
              reject(data)
            }
          },
          fail(err) {
            wx.hideNavigationBarLoading()
            wx.hideLoading()
            reject(err)
          }
        }
        if (data) {
          sendData['data'] = Object.assign({}, sendData['data'], data)
        }
        wx.request(sendData)
      })
    },
    get(url, data = {}, isAll=false) {
      return this.request(url, "GET", data, isAll)
    },
    post(url, data = {}) {
      return this.request(url, "POST", data)
    },
    socket() {
      //
    }
  },
  varStorage: {
    set(name, val) {
      this[name] = val
    },
    get(name) {
      if (this[name] instanceof Object) {
        return JSON.parse(JSON.stringify(this[name]))
      } else {
        return this[name]
      }
    },
    del(name) {
      delete this[name]
    }
  },
  pageToTop:{
    //n为0是客户端，1是合伙端
    set(n,bol){
      app.globalData.toPageTop[n?'partner':'custom']=bol;
    },
    get(n){
      return app.globalData.toPageTop[n ? 'partner' : 'custom'];
    }
  },
  globalData: {
    userInfo: {},
    partnerInfo: {},
    token: '' || '5b1361e9ce26196099841d72890d3441',
    //token: "7822582cfafe76674744f320cecc6ad1",
    // role: 用户角色 0客户 1合伙人
    role: null,   
    HOST: 'https://wcp.wanchepin.com',
    //HOST: 'https://storemp.golodata.com',
    shareInfo: {},
    tabInst: [],
    toPageTop:{
      custom:true,
      partner:true
    }
  }
})