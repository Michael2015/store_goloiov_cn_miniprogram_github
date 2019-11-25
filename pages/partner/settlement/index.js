const app = getApp()
let self;
let isDisabled = 1;
Page({
  data: {
    getAddressList: [],
    def_add: {},
    isload: 0,
    price: {},
    mark: '',
    orderId: 0,
    is_show_action: 1,
    disabled_loading: false,
    user_address: '',
    real_name: '',
    phone: '',
    coupon_total: 0,//包括优惠券和限时秒杀优惠价
    total_num: 1,  //购买数量
    pay_type:'',//默认支付方式
    pay_type_show:false,
    now_money:0.00,//我的积分余额
  },
  price(product_id) {
    app.http.post('/api/partner/store/price', {
      product_id,
      order_id: this.data.orderId,
      unique:this.data.unique,
    }).then(res => {
      let pay_price = res.price;
      //优惠券合伙秒杀//优惠券
      let coupon_total2 = 0.00;
      //区分是否有优惠券以及是否从现有订单进来支付页
      if (res.discount.status == 1 && this.data.is_show_action == 0) {
        coupon_total2 = res.discount.data.total || res.discount.data.save_money;
        pay_price = res.discount.data.price ? res.discount.data.price : (pay_price * +this.data.total_num - coupon_total2);
      } else if (res.discount.status == 1 && this.data.is_show_action == 1) {
        coupon_total2 = res.discount.data.total || res.discount.data.save_money;
        pay_price = res.discount.data.price ? res.discount.data.price : (pay_price * +this.data.total_num - coupon_total2);
      } else if (res.discount.status == 0 && this.data.is_show_action == 0) {
        pay_price = res.discount.data.price ? res.discount.data.price : (pay_price * +this.data.total_num - coupon_total2);
      } else {
        pay_price = res.discount.data.price ? res.discount.data.price : (pay_price * +this.data.total_num - coupon_total2);
      }

      let can_use_jifen = true;
      //判断是否能用积分支付
      if(pay_price > res.now_money)
      {
        can_use_jifen = false;
      }
      //计算优惠后的价格
      this.setData({
        price: res,
        pay_price: parseFloat(pay_price).toFixed(2),
        coupon_total: parseFloat(coupon_total2).toFixed(2),
        info: app.varStorage.get('storeDetail'),
        coupon_total2,
        now_money:res.now_money,
        can_use_jifen,
      });
      //如果是新人专区商品,重新计算
      if (this.data.isnew == 'true') {
        let price = this.data.price;
        price.price = this.data.new_price,
        this.setData({
            price,
            pay_price: parseFloat(price.price*+this.data.total_num).toFixed(2)
        })
      }
      wx.hideLoading()
    })
  },
  pay(order_id,form_id,pay_type="weixin") {
    let that = this;
    //调用微信
    app.http.get('/api/customer/pay/pay', {order_id,pay_type}).then(res => {
      wx.hideLoading()
      if (res && pay_type == 'weixin') {
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success(res) {
            self.setData({
              disabled_loading: false
            })
            that.paySuccessRedirect(order_id,form_id);
          },
          fail() {
            self.setData({
              disabled_loading: false
            });
            //重定向到订单详情页面
            wx.navigateTo({
              url: '/pages/common/order/detail?orderId=' + order_id + '&userId=0',
            })
          }
        })
      } 
      else if(res && pay_type == 'yue'){
        that.paySuccessRedirect(order_id,form_id);
      }
      else {
        wx.showModal({
          content: '稍后重试 ',
          showCancel: false
        })
      }
    })
  },
  paySuccessRedirect(order_id,form_id)
  {
    app.http.get('/api/customer/pay/queryOrder', {
      order_id,
      form_id,
    }).then(res => {
      // &position=${res.position}&outnums=${res.outnums}
      wx.reLaunch({
        "url": `/pages/customer/paysuccess/index?total_price=${res.total_price}&platoon_number=${res.platoon_number}&position=${res.position}&is_platoon=${res.is_platoon}`
      })
    })
  },
  createOrder(formId) {
    //待支付订单处理逻辑
    if (this.data.orderId) {
      this.pay(this.data.orderId, formId);
      wx.hideLoading()
      isDisabled = 1;
    } else if (!this.data.orderId && self.data.product_id && self.data.def_add && self.data.def_add.id) {
      //创建订单
      app.http.post('/api/order/createOrder', {
        product_id: self.data.product_id,
        address_id: self.data.def_add.id,
        mark: self.data.mark,
        total_num: self.data.total_num,
        unique:self.data.unique,
        paytype:self.data.pay_type,
      }).then(res => {
        this.pay(res.order_id, formId,self.data.pay_type)
        wx.hideLoading()
        isDisabled = 1;
      }, () => {
        isDisabled = 1;
        self.setData({
          disabled_loading: false
        })
      })
    } else {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        success: () => {
          isDisabled = 1
          this.setData({
            disabled_loading: false
          })
        }
      })
    }
  },
  setMark(e) {
    this.setData({
      mark: e.detail.value
    })
  },
  getAddressList() {
    if (this.data.orderId == '') {
      app.http.get('/api/Address/getAddressList').then(res => {
        let def_add;
        if (app.varStorage.get('selectAddress') !== undefined) {
          def_add = app.varStorage.get('selectAddress')
        } else {
          def_add = res.filter(ele => {
            return ele.is_default
          })
          if (def_add.length) {
            def_add = def_add[0]
          } else {
            def_add = res[0]
          }
        }
        this.setData({
          getAddressList: res,
          isload: 1,
          def_add
        })
        wx.hideLoading()
      })
    }
    else {
      let def_add = {};
      let address = this.data.user_address.split(" ");
        def_add.province = address[0],
        def_add.city = address[1],
        def_add.district = address[2],
        def_add.detail = address[3],
        def_add.real_name = this.data.real_name,
        def_add.phone = this.data.phone,
        this.setData({
          def_add
        })
    }
  },
  formSubmit(e) {
    if (isDisabled) {
      this.setData({
        pay_type_show:true,
      });
      if(this.data.pay_type)
      {
        isDisabled = 0;
        this.setData({
            disabled_loading: true,
        });
        this.createOrder(e.detail.formId)
      }
    }
  },
  //选择支付方式
  selectPayType(e)
  {
    let  pay_type = e.detail.pay_type;
    if(pay_type)
    {
      this.setData({
        pay_type:pay_type,
      });
    }
  },

  onLoad(e) {
    self = this;
    app.varStorage.del('isShareBack');
    if (e.id) {
      this.setData({
        product_id: e.id,
        orderId: e.order_id || '',
        mark: e.mark || '',
        user_address: e.user_address || '',
        phone: e.phone || '',
        real_name: e.real_name || '',
        isnew: e.isnew,
        total_num:e.total_num,
        unique:e.unique || 0,
      })
      if (e.order_id) {
        this.setData({ is_show_action: 0, total_num: e.total_num })
      }
      if (e.isnew) {
        this.setData({ limit_num: e.limit_num, new_price: e.price })
      }
      //获取价格
      this.price(e.id);
    } else
    {
      wx.navigateBack()
    }
    //禁止返回首页
    wx.hideHomeButton();
  },
  goAddAddress() {
    wx.navigateTo({
      "url": "/pages/partner/addAddress/index"
    })
  },
  goAddList() {
    wx.navigateTo({
      "url": "/pages/partner/shippingAddress/index?selectAddress"
    })
  },
  onShow() {
    this.getAddressList();
  }
})