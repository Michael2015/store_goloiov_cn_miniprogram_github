// pages/partner/personal/admin/index.js
import areaList from '../../../../assets/js/area.min'
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
    adminObj: {
      '0': '请选择申请级别',
      '2': '区/县区域管理员',
      '3': '市区域管理员',
      '4': '省区域管理员'
    },
    addressTitle: '',
    areaList,
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

  selectAdmin() {
    wx.showActionSheet({
      itemList: ['区/县区域管理员', '市区域管理员', '省区域管理员'],
      success(res) {
        self.setData({
          selectId: res.tapIndex + 2
        })
        if(self.data.AdressList.length){
          self.setData({
            AdressList:[],
            addressTitle:''
          })
        }
      },
      fail(res) {
        self.setData({
          selectId: 0
        })
      }
    })
  },
  inputName(e) {
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
    this.setData({
      reason: e.detail.value
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
    const {name,phone,selectId,addressTitle,reason} = this.data
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
    if (selectId == 0) {
      wx.showToast({
        title: '请选择申请类型',
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
    app.http.get('/api/partner/home/region_partner_apply',{
      phone,
      user_name:name,
      agent_name:addressTitle,
      agent_level:selectId,
      mark:reason
    }).then(() => {
      wx.showToast({
        title:'申请成功',
        duration: 2000,
        success:function(){
          wx.navigateTo({
            url: "/pages/partner/personal/admin/applyflag"
          })
        }
      })
    })
  },
  goapplyList(){
    wx.navigateTo({
      url: "/pages/partner/personal/admin/applylist"
    })
  }
})