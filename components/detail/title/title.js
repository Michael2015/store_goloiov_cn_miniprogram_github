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
      var partner_invite_id = app.globalData.partnerInfo.uid ? app.globalData.partnerInfo.uid : app.globalData.shareInfo.share_user_id;
      //未登录
      if(partner_invite_id == 0)
      {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
      wx.navigateTo({
        url: '/pages/partner/personal/partner/invite?share_id=' + partner_invite_id,
      })
      this.checkJoinMask()
    }
  }
})