const app = getApp()
let self;
let isDisabled = 1, Price = 0, Discount_type = '', Id = '', Yhq_title='';
Page({
  data: {
    scroll_top:0,
    yhq_list:[],
    yhq_popup:false,
    getAddressList: [],
    def_add: {},
    isload: 0,
    price: {},
    mark: '',
    yhq_title:'',
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
    golo_points:0,
    golo_points_money:0.00,
    used_golo_points:0,
    radio_check:false,
    radio_check1:false,
    pay_price_temp:0.00,
  },
  price(product_id) {
    app.http.post('/api/partner/store/price', {
      product_id,
      order_id: this.data.orderId,
      unique:this.data.unique,
      total_num:this.data.total_num,
    }).then(res => {
      console.log(res);
      let pay_price = res.price*this.data.total_num;
      let can_use_jifen = true;
      //判断是否能用积分支付,如果是未支付订单重新支付，不能使用积分
      if(pay_price > res.now_money || this.data.orderId)
      {
        can_use_jifen = false;
      }
    
      let golo_points_money = res.golo_intergal.golo_points_money || 0;
      let golo_points = res.golo_intergal.golo_points || 0;
      //计算优惠后的价格
      Yhq_title = res.discount.length + '张优惠券可用';
      this.setData({
        yhq_list: res.discount,
        yhq_title: res.discount.length+'张优惠券可用',
        price: res,
        pay_price: res.pay_price||parseFloat(pay_price).toFixed(2),
        pay_price_temp: parseFloat(pay_price).toFixed(2),
        coupon_total: res.discount_price||0,
        info: app.varStorage.get('storeDetail'),
        now_money:res.now_money,
        can_use_jifen,
        golo_points_money: parseFloat(golo_points_money).toFixed(2),
        golo_points: golo_points,
      },()=>{
        Price=res.price;
      });
      wx.hideLoading();
    })
  },
  close_yhq(){
    this.setData({
      yhq_popup:false
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
      this.pay(this.data.orderId,formId);
      //待支付状态只有微信支付，所以积分支付是不能选择
      wx.hideLoading()
      isDisabled = 1;
    } else if (!this.data.orderId && self.data.product_id && self.data.def_add && self.data.def_add.id) {
      //创建订单
      //用积分支付的时候，需要短信验证
      if(self.data.pay_type == 'yue' && !app.globalData.isCheckPhone)
      {
        isDisabled = 1;
        this.setData({
          disabled_loading:false,
          disabled_loading:false,
        });
        wx.navigateTo({
          url:'/pages/partner/settlement/check'
        });
        return;
      }
      var radio_check = this.data.radio_check;
      app.http.post('/api/order/createOrder', {
        product_id: self.data.product_id,
        address_id: self.data.def_add.id,
        mark: self.data.mark,
        total_num: self.data.total_num,
        unique:self.data.unique,
        paytype:self.data.pay_type,
        discount_type: radio_check?4:Discount_type,
        discount_id: radio_check ?0:Id
        //used_golo_points:self.data.used_golo_points,
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
    console.log("触发", Discount_type,Id);
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
    console.log(e);
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
    //没有做虚拟验证
    app.globalData.isCheckPhone = 0;
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
    Discount_type=0,Id=0;
    this.getAddressList();
  },
  showWindows()
  {
    wx.showModal({
      title: '帮助提示',
      content: '在golo APP开车1公里获得1积分',
      showCancel:false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //切换单选图标
  radio_check(){
    if(this.data.golo_points > 0)
    {
      let golo_points_money=this.data.golo_points_money;
      let radio_check = !this.data.radio_check;
      let used_golo_points = !this.data.used_golo_points;
      let pay_price = this.data.pay_price_temp;
      if(used_golo_points)
      {
        pay_price = pay_price - this.data.golo_points_money;
        pay_price = parseFloat(pay_price).toFixed(2); 
      }
      Discount_type = radio_check ? 4 : '', Id = radio_check ? 0 : '';
     this.setData({radio_check:radio_check,used_golo_points:used_golo_points,
       pay_price: pay_price <= 0 ? 0.01 : pay_price,
       coupon_total: radio_check ? golo_points_money:0,
       yhq_title: Yhq_title
     });
    }
    
  },
  radio_check1(){
    if (this.data.yhq_list.length){
    this.setData({
      yhq_popup:true,
      scroll_top:0
    });
    }
  },
  useyhq(e){
    var { discount_type, id, discount_price, title} = e.currentTarget.dataset.info;
    Discount_type = discount_type, Id = id;
    var total_num = this.data.total_num;
    this.setData({
      radio_check:false,
      coupon_total: discount_price,
      yhq_popup:false,
      yhq_title: title,
      pay_price: (Number(Price) * total_num - Number(discount_price)) <= 0 ? 0.01 : Number(Price) * total_num - Number(discount_price)
    })
  }

})