const app = getApp()
Component({
  properties: {
    data: {
      type: Object,
    },
    partner: {
      type: Object,
    },
    sharetype: {
      type: String,
    },
    id: {
      type: Number,
    }
  },
  data: {
    showPlatoonPopup: false,
    showModal: false,
    joinMask: false,
    is_promoter: 0
  },
  methods: {
    //领取优惠券
    show_modal() {
      let coupon_id = this.data.data.coupon_id;
      let coupon_price = this.data.data.coupon_price;
      let coupon_date = this.data.data.coupon_date;
      this.setData({
        coupon_id: coupon_id,
        coupon_price: coupon_price,
        coupon_date: coupon_date,
        showModal: true,
      });
    },
    hide_modal() {
      this.setData({
        showModal: false,
      })
    },
    //领取优惠券
    get_coupon(e) {
      app.http.post('/api/coupon/setcoupon', {
        coupon_id: this.data.coupon_id,
      }).then(res => {
        wx.showToast({
          title: '领取成功',
          icon: 'none',
        })
        this.setData({
          showModal: false,
        })
      })
    },
    openPlatoonPopup() {
      this.setData({
        showPlatoonPopup: true
      })
    },
    closePlatoonPopup() {
      this.setData({
        showPlatoonPopup: false
      })
    },
    toGPDesc() {
      wx.navigateTo({
        url: '/pages/partner/personal/helper/gongpai'
      })
    },
    checkJoinMask() {
      this.setData({ joinMask: !this.data.joinMask })
    },
    joinTeam() {
      // console.log(this.properties)
      // console.log(app.globalData)
      // if (app.globalData.token === '') {
      //   let share_user_id = app.globalData.shareInfo.share_user_id;
      //   let share_partner_id = app.globalData.shareInfo.share_partner_id;
      //   let share_product_id = app.globalData.shareInfo.share_product_id || this.properties.id;
      //   let url;
      //   if (this.properties.sharetype) {
      //     url = '/pages/login/index?type=share&share_user_id=' + share_user_id + '&share_partner_id=' + share_partner_id + '&share_product_id=' + share_product_id;
      //   }
      //   else {
      //     url = '/pages/login/index?share_user_id=' + share_user_id + '&share_partner_id=' + share_partner_id + '&share_product_id=' + share_product_id;
      //   }
      //   wx.reLaunch({
      //     url: url
      //   })
      //   return
      // }
      // app.http.get('/api/partner/index/join', { spid: this.properties.partner.uid }).then(data => {
      //   // 到这里说明已经加入团队了
      //   // 直接跳首页
      //   wx.showToast({
      //     title: '加入成功',
      //     icon: 'success',
      //     duration: 2000
      //   })
      //   app.globalData.role = null
      //   wx.reLaunch({
      //     url: '/pages/index/index'
      //   })
      // })
      var partner_invite_id = app.globalData.partnerInfo.uid ? app.globalData.partnerInfo.uid : app.globalData.shareInfo.share_user_id;
      // console.log(app.globalData)
      wx.navigateTo({
        url: '/pages/partner/personal/partner/invite?share_id=' + partner_invite_id,
      })
      this.checkJoinMask()
    }
  }
})