// components/detail/sku/sku.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    total_num:{
      type: Number,
      value: 1
    },
    limit_num:{
      type: Number,
      value: 1
    },
    is_newborn:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
  checkmask() {
      this.setData({
        isShow: !this.data.isShow
      })
  },
  add_pruduct_num() {
      if (this.data.is_newborn == true) {
          if (this.data.total_num + 1 > this.data.limit_num) {
              wx.showToast({ title: `该活动每人限购${this.data.limit_num}件`, icon: 'none' })
              return
          }
      }
      this.setData({
          total_num: ++this.data.total_num
      });
      this.triggerEvent('myevent',{'total_num':this.data.total_num});
  },
  inputTotalnum(e) {
    this.setData({
        total_num: e.detail.value
    })
  },
  reduce_pruduct_num() {
      if (this.data.total_num <= 1) {
          return
      }
      this.setData({
          total_num: --this.data.total_num
      });
      this.triggerEvent("myevent",{'total_num':this.data.total_num});
  },
  },
  ready(){
  }
});
