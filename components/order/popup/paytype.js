Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pay_type_show: {
      type: Boolean,
      value: false
    },
    now_money:{
      type: Number,
      value: 0.00
    },
    pay_price:{
      type: Number,
      value: 0.00
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    payType:[
      {id:'yue', name:"积分支付",icon:"/assets/image/jifenpay.png"},
      {id:'weixin', name:"微信支付",icon:"/assets/image/weixinpay.png"},
      ]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //选择支付方式
    radioChange(e)
    {
      let pay_type = e.detail.value;
      this.triggerEvent("myevent", { 'pay_type': pay_type});
    },
  },

})
