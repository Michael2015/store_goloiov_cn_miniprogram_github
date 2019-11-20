Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    payType:[
      {id:'yue', name:"积分支付",label:"(剩余1999.99积分)",icon:"/assets/image/jifenpay.png"},
      {id:'weixin', name:"微信支付",label:"",checked:'true',icon:"/assets/image/weixinpay.png"},
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
