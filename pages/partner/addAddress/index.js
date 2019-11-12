import areaList from '../../../assets/js/area.min'
let self;
const app = getApp()
Page({
  data: {
    region: [],
    areaList,
    real_name: '',
    phone: null,
    detail: '',
    longitude: '',
    latitude: ''
  },
  onLoad() {
    self = this;
    let addressItem = app.varStorage.get('addressItem')
    if (addressItem) {
      addressItem.detail = addressItem.detail.replace(`${addressItem.province}${addressItem.city}${addressItem.district}`, '')
      this.setData({
        id: addressItem.id,
        region: [addressItem.province, addressItem.city, addressItem.district],
        real_name: addressItem.real_name,
        phone: addressItem.phone,
        detail: addressItem.detail
      })
    } else {
      this.setData({
        phone: app.globalData.userInfo.phone
      })
    }
  },
  setname(e) {
    this.setData({
      real_name: this.filterEmoji(e.detail.value)
    })
    console.log(this.data.real_name)
  },
  // 过滤表情
  filterEmoji(name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
  },
  setphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setdetail(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  areaSelect(e) {
    if (this.data.latitude) {
      this.setData({
        region: e.detail.value
      })
    } else {
      this.setData({
        region: e.detail.value,
        detail: '',
        latitude: '',
        longitude: ''
      })
    }
  },
  goAddAddress() {
    wx.chooseLocation({
      success(res) {
        let region = res.address !== res.name && res.address.replace(res.name, '').match(/.+?(省|市|自治区|自治州|县|区|盟|旗|乡|镇|岛|仔)/g);
        self.setData({
          region: region.length === 3 ? region : '',
          detail: `${res.name}`,
          latitude: res.latitude,
          longitude: res.longitude
        })
        if (self.data.region === '') {
          wx.showModal({
            title: '提示',
            content: '请手动选择您的所在地'
          })
        }
      },
      fail() {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userLocation'] === false) {
              wx.showModal({
                'title': '您取消了授权',
                'content': '请允许我们访问您的位置信息',
                success(e) {
                  if (e.confirm) {
                    wx.openSetting({
                      complete(e) {
                        if (e.authSetting['scope.userLocation'] === true) {
                          self.goAddAddress()
                        } else {
                          wx.showToast({
                            title: '未获得权限',
                            icon: 'none'
                          })
                        }
                      }
                    });
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  addAddress() {
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    if (this.data.id) {
      app.http.post('/api/address/editaddress', {
        address_id: this.data.id,
        real_name: this.data.real_name,
        phone: this.data.phone,
        province: this.data.region[0],
        city: this.data.region[1],
        district: this.data.region[2],
        detail: this.data.detail,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      }).then(res => {
        wx.hideLoading()
        wx.showModal({
          title: '修改成功',
          content: '新的收货地址已保存',
          showCancel: false,
          success() {
            wx.navigateBack()
          }
        })
      })
    } else {
      app.http.post('/api/Address/addAddress', {
        real_name: this.data.real_name,
        phone: this.data.phone,
        province: this.data.region[0],
        city: this.data.region[1],
        district: this.data.region[2],
        detail: this.data.detail,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      }).then(res => {
        wx.hideLoading()
        wx.showModal({
          title: '保存成功',
          content: '新的收货地址已保存',
          showCancel: false,
          success() {
            wx.navigateBack()
          }
        })
      })
    }
  },
  save() {
    if (this.data.real_name.trim() && this.data.phone.trim() && this.data.detail.trim() && this.data.region[0]) {
      // 检查电话
      if (!/^1[3456789]\d{9}$/.test(this.data.phone)) {
        wx.showToast({
          title: '电话格式不正确',
          icon: 'none'
        })
        return
      }
      // 检查名字
      if(this.data.real_name.trim().length == 0){
        wx.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        })
        return
      }
      if(this.data.region.length == 0){
        wx.showToast({
          title: '请选择地区',
          icon: 'none'
        })
        return
      }
      if(this.data.detail.trim().length == 0){
        wx.showToast({
          title: '请输入详细地址',
          icon: 'none'
        })
        return
      }
      this.addAddress();
    } else {
      wx.showToast({
        title: '请填写您的收货信息',
        icon: 'none'
      })
    }
  }
})