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
    total_num: {
      type: Number,
      value: 1
    },
    limit_num: {
      type: Number,
      value: 1
    },
    is_newborn: {
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
      //限制50单
      if (this.data.total_num > 50) {
        wx.showToast({ title: `单次限购50件`, icon: 'none' });
        return;
      }

      this.setData({
        total_num: ++this.data.total_num
      });
      this.triggerEvent('myevent', { 'total_num': this.data.total_num });
    },
    inputTotalnum(e) {
      if (this.data.is_newborn == true) {
        if (e.detail.value > this.data.limit_num) {
          wx.showToast({ title: `该活动每人限购${this.data.limit_num}件`, icon: 'none' });
          this.setData({
            total_num: this.data.limit_num
          });
          return
        }
      }
      if (e.detail.value > 50) {
        wx.showToast({ title: `单次限购50件`, icon: 'none' });
        this.setData({
          total_num: 50
        });
      }
      else if (e.detail.value <= 1) {
        this.setData({
          total_num: 1
        });
      }
      else {
          this.setData({
            total_num: e.detail.value
          });
      }
      this.triggerEvent('myevent', { 'total_num': this.data.total_num });
    },
    reduce_pruduct_num() {
      if (this.data.total_num <= 1) {
        this.setData({
          total_num: 1
        });
        return
      }
      this.setData({
        total_num: --this.data.total_num
      });
      this.triggerEvent("myevent", { 'total_num': this.data.total_num });
    },
  },
  ready() {
  }
});
