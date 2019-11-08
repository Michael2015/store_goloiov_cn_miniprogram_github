import Contact from '../../../utils/contactUser/contactUser'
const app = getApp()
let WxParse = require('../../../utils/wxParse/wxParse.js')
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 400
Page({
    data: {
        // 商品id
        id: '',
        // 轮播图片
        imgUrls: [],
        title: {
            title: '',
            price: 0,
            sale: 0,
            store_name: ''
        },

        // 商品详情介绍
        description: {},
        // 购买记录分页
        buyRecordPage: 1,
        // 购买记录分页大小
        buyRecordPageSize: 10,
        // 购买记录数据
        buyRecordList: [],
        //评论记录
        commentRecordList: [],
        // 购买记录分页
        commentRecordPage: 1,

        // 购买记录是否有更多数据
        buyRecordMore: true,
        //评论记录是否有更多数据
        commentRecordMore: true,

        tabs: ['详情', '购买记录','评论'],
        // 当前tab下标
        currentTab: 0,
        // 内容swiper高度
        contentSwiperHeight: defaultSwiperHeight,
        partner: {
            nickname: '',
            avatar: ''
        },
        coupon_id:'',
        coupon_title:'',
        coupon_price:'',
        coupon_date:'',
        seckill:'',
        time_backward:[],
        timeList:[],
        is_promoter:0,
        share_type:'',
        detailTitle:{},  //显示文本弹框对象
        first:true,      //记录是否是第一次点击
        total_num: 1,  //购买数量
        click_buy_num:0,//点击购买次数
    },
    onLoad: function (options) {
        this.setData({
            id: options.id || 2, // 获取商品id
            share_type:options.type || '',
            partner: {
                nickname: app.globalData.userInfo.partner_name,
                avatar: app.globalData.userInfo.partner_avatar,
                phone: app.globalData.userInfo.partner_phone,
            },
            detailTitle:this.selectComponent('.title')
        })
        // console.log(app.globalData)
        this.getPartnerInfo()
        // 调用接口获取详情数据
        this.getDetail()
        // 获取上牌详情
        this.getDescription()
        //获取评论
        this.getComment()
    },
    // 点击tab导航
    handleTabChange(event) {
        this.setData({
            currentTab: event.detail.current
        })
    },
    tabPageChange(event) {
        wx.showLoading()
        let index = event.detail.current
        this.setData({
            contentSwiperHeight: defaultSwiperHeight,
            currentTab: index,
            buyRecordList: [],
            buyRecordPage: 1,
            buyRecordMore: true,
            commentRecordList: [],
            commentRecordPage: 1,
            commentRecordMore: true,
        })
        if (index === 0) {
            this.getDescription()
        }
        if (index === 1) {
            // 获取购买记录内容
            this.getRecord()
        }
        if (index === 2) {
            // 获取评论内容
            this.getComment()
        }
    },
    // 页面滚动到底部
    handleScrollToLower() {
        // 购买记录加载更多
        if (this.data.currentTab === 1 && this.data.buyRecordMore) {
            let page = this.data.buyRecordPage + 1
            this.setData({
                buyRecordPage: page
            })
            this.getRecord()
        }

        //获取评论
        if (this.data.currentTab === 2 && this.data.commentRecordMore){
            let page = this.data.commentRecordPage + 1
            this.setData({
                commentRecordPage: page
            })
            this.getComment()
        }
    },
    getDetail() {
        let timeList2 = [];
        wx.showLoading();

        if(this.data.share_type == 'share')
        {
            var params = {
                product_id: this.data.id,
                ...app.globalData.shareInfo
            }
        }
        else
        {
            var params = {
                product_id: this.data.id,
            }
        }
        params.share_product_id = this.data.id
        app.http.get('/api/customer/product/detail', params).then(res => {
            wx.hideLoading();
            app.varStorage.set('storeDetail', res);
            if(res.seckill.status == 1 || res.seckill.status == -1)
            {
                let time = res.seckill.status == 1 ? res.seckill.data.stop_time :res.seckill.data.start_time ;
                timeList2.push(time);
                this.setData({
                    timeList:timeList2,
                });
                this.countDown();
            }
            this.setData({
                allInfo: res,
                imgUrls: res.slider_image,
                seckill:res.seckill,
                title: {
                    title: res.store_name,
                    price: res.price,
                    sale: res.sales,
                    platoon_slow: res.platoon_slow,
                    platoon_fast: res.platoon_fast,
                    store_name: res.store_name,
                    is_platoon: res.is_platoon,
                    coupon_id:res.coupon.data.id||0,
                    coupon_title:res.coupon.data.title||'',
                    coupon_date:res.coupon.data.date||'',
                    coupon_price:res.coupon.data.price||0,
                    seckill:res.seckill,
                    vip_price:res.vip_price,
                    is_promoter:this.data.is_promoter,
                    newbornzone:res.newbornzone
                }
            })
        }).catch((e) => {
            wx.hideLoading()
        })
    },
    //秒杀倒计时
    timeFormat(param){//小于10的格式化函数
        return param < 10 ? '0' + param : param;
    },
    //秒杀倒计时
    countDown()
    {
        // 获取当前时间，同时得到活动结束时间数组
        let newTime = new Date().getTime();
        let endTimeList = this.data.timeList;
        let countDownArr = [];
        // 对结束时间进行处理渲染到页面
        for(let key in endTimeList)
        {
            if(endTimeList[key])
            {
                let endTime = new Date(endTimeList[key]).getTime();
                let obj = null;
                // 如果活动未结束，对时间进行处理
                if (endTime - newTime > 0){
                    let time = (endTime - newTime) / 1000;
                    // 获取天、时、分、秒
                    let day = parseInt(time / (60 * 60 * 24));
                    let hou = parseInt(time % (60 * 60 * 24) / 3600);
                    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
                    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
                    obj = {
                        day: this.timeFormat(day),
                        hou: this.timeFormat(hou),
                        min: this.timeFormat(min),
                        sec: this.timeFormat(sec)
                    }
                }else{//活动已结束，全部设置为'00'
                    obj = {
                        day: '00',
                        hou: '00',
                        min: '00',
                        sec: '00'
                    }
                }
                countDownArr[key] = obj;
            }
        }
        // 渲染，然后每隔一秒执行一次倒计时函数
        this.setData({time_backward: countDownArr});
        setTimeout(this.countDown,1000);
    },
    // 获取详情描述
    getDescription() {
        wx.showLoading()
        app.http.get('/api/customer/product/getProductDesc', {
            product_id: this.data.id
        }).then(res => {
            wx.hideLoading();
            let description = res.description.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
            description = description.replace(/float[\s]*:[\s]*(left|right)[\s]*;*/gi, 'float: auto;')
            this.setData({
                description: WxParse.wxParse('description', 'html', description, this, 5),
            })
            this.initContentSwiperHeight(0)
        }).catch((e) => {
            wx.hideLoading()
        })
    },
    // 获取购买记录
    getRecord() {
        wx.showLoading()
        app.http.get('/api/customer/product/buyRecord', {
            product_id: this.data.id,
            page: this.data.buyRecordPage,
            limit: this.data.buyRecordPageSize
        }).then(res => {
            wx.hideLoading()
            this.data.buyRecordList.push(...res)
            this.setData({
                buyRecordList: this.data.buyRecordList
            })
            this.initContentSwiperHeight(1)
            if (res.length < this.data.buyRecordPageSize) {
                this.setData({
                    buyRecordMore: false
                })
            }
        }).catch((e) => {
            wx.hideLoading()
        })
    },

    // 获取评论记录
    getComment() {
        wx.showLoading()
        app.http.get('/api/order/commentRecord', {
            product_id: this.data.id,
            page: this.data.commentRecordPage,
            limit: this.data.buyRecordPageSize
        }).then(res => {
            wx.hideLoading()
            this.data.commentRecordList.push(...res)
            for(var key in this.data.commentRecordList)
            {
                let arr = [];
                for(let ii = 0;ii < this.data.commentRecordList[key]['star_num'];ii++)
                {
                    arr.push('../../../assets/image/star_y.png');
                    this.data.commentRecordList[key]['imgs'] = arr;
                }

            }
            this.setData({
                commentRecordList: this.data.commentRecordList
            })
            this.initContentSwiperHeight(2)
            if (res.length < this.data.buyRecordPageSize) {
                this.setData({
                    commentRecordMore: false
                })
            }
        }).catch((e) => {
            wx.hideLoading()
        })
    },
    // 初始化内容swiper高度
    initContentSwiperHeight(index) {
        wx.createSelectorQuery().select('#item-wrap' + index).boundingClientRect().exec(rect => {
            let h = rect[0].height
            if (h < defaultSwiperHeight) {
                h = defaultSwiperHeight
            }
            this.setData({
                contentSwiperHeight: h
            })

            wx.hideLoading()
        })
    },
    goSettlement() {
        let product_id = this.data.id;
        const {is_newborn,limit_num,price} = this.data.title.newbornzone
        let that = this;
        let total_num = this.data.total_num;
        //弹出选择购买数量
        if(this.data.click_buy_num == 0)
        {
            this.setData({
                count_mask:true,
                click_buy_num:1
            });
            return ;    
        }
        else
        {
            if(this.data.first){
                this.data.detailTitle.checkJoinMask();
                this.setData({
                    first:false
                })
                return
            }
            wx.getSetting({
                success(res) {
                    let url;
                    if (res.authSetting['scope.userInfo'] && app.globalData.userInfo.is_promoter == 0) {
                        url = `/pages/partner/settlement/index?id=${product_id}&isnew=${!!is_newborn}&limit_num=${!!limit_num?limit_num:0}&price=${!!price?price:0.00}&total_num=${total_num}`;
                    }
                    else
                    {
                        let share_user_id = app.globalData.shareInfo.share_user_id;
                        let share_partner_id = app.globalData.shareInfo.share_partner_id;
                        let share_product_id = app.globalData.shareInfo.share_product_id || product_id;
                        if(that.data.share_type)
                        {
                            url = '/pages/login/index?type=share&share_user_id='+share_user_id+'&share_partner_id='+share_partner_id+'&share_product_id='+share_product_id;
                        }
                        else
                        {
                            url = '/pages/login/index?share_user_id='+share_user_id+'&share_partner_id='+share_partner_id+'&share_product_id='+share_product_id;
                        }
                       }
                    wx.reLaunch({
                        url: url
                    })
                }
            });
        }

    },
    toList() {
        // 判断用户角色, 如果是客户, 跳到客户端列表, 如果是合伙人, 跳到合伙人列表
        app.globalData.shareInfo.share_user_id = app.globalData.shareInfo.share_partner_id
        wx.switchTab({
            url: '/pages/customer/index/index'
        })
    },
    contact() {
        Contact.show(this.data.partner)
    },
    toShare() {
        let allInfo = this.data.allInfo;
        if (!app.varStorage.get('storeDetail')) {
            app.varStorage.set('storeDetail', allInfo)
        }
        // id:1
        // image:"http://datong.crmeb.net/public/uploads/attach/2019/01/15/5c3dba1366885.jpg"
        // sales:32
        // store_name:"无线吸尘器F8 玫瑰金礼盒版"
        wx.navigateTo({
            url: '/pages/customer/share/index'
        })
    },
    // onShareAppMessage: function (res) {
    //   return {
    //     title: '发现一个好商品【' + this.data.title.title + '】推荐给你！',
    //     path: `/pages/index/index?type=share&s=${app.globalData.shareInfo.share_user_id}&p=${app.globalData.shareInfo.share_partner_id}&st=${this.data.id}`,
    //     imageUrl: this.data.allInfo.image
    //   }
    // },
    // 滑动详情页
    descTouch(event) {
        // 动态计算swiper高度
        this.initContentSwiperHeight(0)
    },
    getPartnerInfo() {
        app.http.get('/api/customer/mall/getPartnerInfo',{share_id:app.globalData.shareInfo.share_user_id}).then(res => {
            app.globalData.partnerInfo = res;
            this.setData({
                partner: res
            }, () => {
                wx.hideLoading()
            })
        })
    },
    onUnload() {
        wx.hideLoading()
    },
    //  微信7.0.7版本起，禁用返回首页按钮
    onShow(){
        this.setData({
            count_mask:false,
            click_buy_num:0
        });    
        wx.hideHomeButton();
    },

    checkmask() {
        this.setData({
          count_mask: !this.data.count_mask
        })
      },
    add_pruduct_num() {
        const {is_newborn,limit_num,price} = this.data.title.newbornzone
        if (is_newborn == true) {
          if (this.data.total_num + 1 > limit_num) {
            wx.showToast({title:`最多下单${this.limit_num}个`,icon:'none'})
            return
          }
        }
        this.setData({
          total_num: ++this.data.total_num
        })
        this.Calculation()
    },
    reduce_pruduct_num() {
        if (this.data.total_num <= 1) {
          return
        }
        this.setData({
          total_num: --this.data.total_num
        })
        this.Calculation()
      },
      // 重新计算总价
    Calculation() {
        const { coupon_total2, total_num, price } = this.data;
        //重新计算优惠后的价格
        this.setData({
          pay_price: parseFloat(price.price * total_num - coupon_total2).toFixed(2)
        });
    }
})