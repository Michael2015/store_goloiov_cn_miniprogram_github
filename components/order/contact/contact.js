const app = getApp()
Component({
  properties: {
    productId: {
      type: String
    },
    partner: {
      type: Object
    },
  },
  data: {
    supplierName: '',
    supplierPhone: '',
    supplierAddr:'',
  },
  attached() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      let productId = this.data.productId
      wx.showLoading()
      app.http.get('/api/supplier/getinfo', {product_id: productId}).then(res => {
        this.setData({
          supplierName: res.supplier_name,
          supplierAddr: res.contact_number,
          supplierPhone: res.phone,
        })
        wx.hideLoading()
      }).catch((e) => {
        wx.hideLoading()
      })
    },
    close(){
      this.triggerEvent('close')
    },
    copy() {
      wx.setClipboardData({
        data: this.data.partner.nickname
      })
    },
    call(event) {
      let phone = event.target.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  }
})