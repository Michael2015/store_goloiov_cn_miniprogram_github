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
    },
    attr:{
      type: Object,
      value: {}
    },
    attr_value:{
      type: Object,
      value: {}
    },
    attr_attr:{
      type: Array,
      value: []
    },
    attr_product_image_url:{
      type: String,
      value: ''
    },
    attr_price:{
      type: Number,
      value: 0
    },
    attr_attr_name:{
      type: Array,
      value: []
    },
    unique:{
      type: String,
      value: ''
    }
  },

  data:{

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
      this.triggerEvent("myevent", { 'unique': this.data.unique,'total_num': this.data.total_num});
    },
    inputTotalnum(e) {
      /*number检测*/
      let re = /^[0-9]+$/;
      if (!re.test(e.detail.value)) {
        e.detail.value = 1
      }

      let limit_total_num = 50;
      let title = `单次限购50件`;
      
      if (this.data.is_newborn == true) {
        title = `该活动每人限购${this.data.limit_num}件`
        limit_total_num = this.data.limit_num;
      }
      if (e.detail.value > limit_total_num) {
        wx.showToast({ title: title, icon: 'none' });
        this.setData({
          total_num: limit_total_num
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
      this.triggerEvent("myevent", { 'unique': this.data.unique,'total_num': this.data.total_num});
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
      this.triggerEvent("myevent", { 'unique': this.data.unique,'total_num': this.data.total_num});
    },
    selectSku(e){
      let index = e.currentTarget.dataset.index;
      let select_attr_name = e.currentTarget.dataset.name;
      let skues  = index.split("_");
      this.data.attr_attr_name[skues[0]] = select_attr_name;
      let temp = this.data.attr_attr;
      for(let k in  this.data.attr_attr)
      {
        if(k == skues[0])
        {
          for(let kk in  this.data.attr)
          {
           if(kk == skues[1])
           {
            temp[k][kk] = 1;
           }
           else
           {
            temp[k][kk] = 0;
           }
          }
        }
      }
      this.setData({
        attr_attr:temp,
        attr_price:this.data.attr_value[this.data.attr_attr_name].price,
        attr_product_image_url:this.data.attr_value[this.data.attr_attr_name].image,
        unique:this.data.attr_value[this.data.attr_attr_name].unique,
      });
      this.triggerEvent("myevent", { 'unique': this.data.unique,'total_num': this.data.total_num});
    },
  },

});
