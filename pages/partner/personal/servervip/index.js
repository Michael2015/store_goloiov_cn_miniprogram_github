// pages/partner/personal/admin/index.js
import areaList from '../../../../assets/js/area.min'
var filter = require('../../../../assets/js/filter.js')
let self;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    selectId: 0,
    reason: '',
    imgShopList:[],
    imgLicenseList:[],
    addressTitle: '',
    address: '',
    areaList,
    shopName:'',
    AdressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
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
  selectShopPhoto() {
    var _this = this
    if (this.data.imgShopList.length <= 5) {
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          var total = _this.data.imgShopList.length + tempFilePaths.length
          if ( total <= 5) {
            for (var key in tempFilePaths) {
              wx.uploadFile({
                url: `${app.globalData.HOST}/api/customer/index/upload`,
                filePath: tempFilePaths[key],
                name: 'b068931cc450442b63f5b3d276ea4297',
                formData: {
                  token: app.globalData.token
                  //token: '32f592bf56c0fb6df6c07bf5babb315f'
                },
                success(res) {
                  res = JSON.parse(res.data);
                  let imgShopList = _this.data.imgShopList.concat(`${app.globalData.HOST}` + '/' + res.data.url);
                  _this.setData({
                    imgShopList
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
          else {
            wx.showToast({
              title: '最多上传5张图片',
              icon: 'none'
            })
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '最多上传5张图片',
        icon: 'none'
      })
    }
  },
  deleteShopImage: function (e) {
    var that = this;
    var images = that.data.imgShopList;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    console.log(index);
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          images.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;    
        }
        that.setData({
          imgShopList:images
        });
      }
    })
  },
  selectLicensePhoto() {
    var _this = this
    if (this.data.imgLicenseList.length <= 3) {
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          var total = _this.data.imgLicenseList.length + tempFilePaths.length
          if ( total <= 3) {
            for (var key in tempFilePaths) {
              wx.uploadFile({
                url: `${app.globalData.HOST}/api/customer/index/upload`,
                filePath: tempFilePaths[key],
                name: 'b068931cc450442b63f5b3d276ea4297',
                formData: {
                  token: app.globalData.token
                  //token: '32f592bf56c0fb6df6c07bf5babb315f'
                },
                success(res) {
                  res = JSON.parse(res.data);
                  let imgLicenseList = _this.data.imgLicenseList.concat(`${app.globalData.HOST}` + '/' + res.data.url);
                  _this.setData({
                    imgLicenseList
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
          else {
            wx.showToast({
              title: '最多上传3张图片',
              icon: 'none'
            })
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '最多上传3张图片',
        icon: 'none'
      })
    }
  },
  deleteLicenseImage: function (e) {
    var that = this;
    var images = that.data.imgLicenseList;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    console.log(index);
    wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success: function (res) {
            if (res.confirm) {
                console.log('点击确定了');
                images.splice(index, 1);
            } else if (res.cancel) {
                console.log('点击取消了');
                return false;    
            }
            that.setData({
              imgLicenseList:images
            });
        }
    })
},
  inputName(e) {
    e.detail.value = filter.filterEmoji(e.detail.value.trim())
    this.setData({
      name: e.detail.value
    })
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputReason(e) {
    e.detail.value = filter.filterEmoji(e.detail.value.trim())
    if (e.detail.value.trim().length > 300) {
      wx.showToast({
        title: '申请原因字数不能超过300',
        icon: 'none'
      })
      return
    }
    this.setData({
      reason: e.detail.value
    })
  },
  inputAddress(e) {
    e.detail.value = filter.filterEmoji(e.detail.value.trim())
    if (e.detail.value.trim().length > 300) {
      wx.showToast({
        title: '详细地址不能超过300',
        icon: 'none'
      })
      return
    }
    this.setData({
      address: e.detail.value
    })
  },
  inputShopName(e){
    e.detail.value = filter.filterEmoji(e.detail.value.trim())
    this.setData({
      shopName: e.detail.value
    })
  },
  goAddAddress(e) {
    // if (this.data.selectId == 0) {
    //   wx.showToast({
    //     title: '请选择申请类型',
    //     icon: 'none'
    //   })
    //   return
    // }
    if(this.data.selectId == 0 || this.data.selectId == 2){
      this.setData({
        AdressList:e.detail.value,
      })
    }else if(this.data.selectId == 3){
      this.setData({
        AdressList:[e.detail.value[0],e.detail.value[1]],
      })
    }else if(this.data.selectId == 4){
      this.setData({
        AdressList:[e.detail.value[0]],
      })
    }
    this.setData({
      addressTitle:this.data.AdressList.join(' ')
    })
  },
  goApply() {
    const {name,phone,selectId,addressTitle,address,reason,imgShopList,imgLicenseList,shopName} = this.data
  
    if (name.trim().length == 0) {
      wx.showToast({
        title: '请输入名字',
        icon: 'none'
      })
      return
    }
    if (phone.trim().length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (!/^[1]([3-9])[0-9]{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return
    }
    if (shopName.trim().length == 0) {
      wx.showToast({
        title: '请输入门店名称',
        icon: 'none'
      })
      return
    }
    if (address.trim().length == 0) {
      wx.showToast({
        title: '请输详细地址',
        icon: 'none'
      })
      return
    }
    if (address.trim().length > 300) {
      wx.showToast({
        title: '详细地址不能超过300',
        icon: 'none'
      })
      return
    }
    if (imgShopList.length == 0) {
      wx.showToast({
        title: '请上传门店照片',
        icon: 'none'
      })
      return
    }
    if (imgLicenseList.length == 0) {
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none'
      })
      return
    }
    if (addressTitle.length == 0) {
      wx.showToast({
        title: '请选择申请城市',
        icon: 'none'
      })
      return
    }
    if (reason.trim().length == 0) {
      wx.showToast({
        title: '请输入申请原因',
        icon: 'none'
      })
      return
    }
    if (reason.trim().length > 300) {
      wx.showToast({
        title: '申请原因字数不能超过300',
        icon: 'none'
      })
      return
    }
    app.http.post('/api/partner/home/server_vip_apply',{
      phone,
      name: name,
      shop_name: shopName,
      region:addressTitle,
      address: address,
      shop_imgs: imgShopList,
      license_imgs: imgLicenseList,
      reason:reason
    }).then(() => {
      wx.showToast({
        title:'申请成功',
        duration: 2000,
        success:function(){
          wx.navigateTo({
            url: "/pages/partner/personal/servervip/applyflag"
          })
        }
      })
    })
  },
  goapplyList(){
    wx.navigateTo({
      url: "/pages/partner/personal/servervip/applylist"
    })
  },
  viewbigimg: function(e) {
    var imgArr = [];
    imgArr[0] = e.currentTarget.dataset.license
    wx.previewImage({
      current: e.currentTarget.dataset.license, //当前图片地址
      urls: imgArr
    })
  }
})