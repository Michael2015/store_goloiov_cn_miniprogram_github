import sharePoster from '../../../utils/sharePoster/sharePoster.js'
const app = getApp()
let text = '', adPage=0;
let self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 200
Page({
  data: {
    chePu:[],
    circleUrl:'',
    adArr: [],
    storelist: [],
    //alllist: [],
    isLoad: 0,
    page: 1,
    limit: 6,
    getinfo: {},
    keyword: '',
    noviceShow: null,
    isAllowLoad: true,
    //isAllowLoad2: true,
    coupon_id: 0,
    coupon_date: '',
    coupon_price: 0,
    coupon_title: '',
    showModal: false,
    pid: 0,
    timeList: [],
    countDownList: [],
    bannerList: [],
    isShowCategory: 0,//是否显示分类
    categoryList: [],
    categoryList1: [],
    fenXiangShow: false,  //分享是否显示
    heightCount: 0,   //统计监控交互的高度
    scrollTop: 0,    //监控滑动距离
    tabTime: '',
    selectClassId: -1,         //标识选择id
    tabIndex: 0,       //目前切换到的首页tab下标
    contentSwiperHeight: defaultSwiperHeight,
    islogin: false,       //标识是否是登录状态
    isfirst: true,        //是否是第一次进入首页
    newObj: {},            //新人专区对象
    blastProductList: [], //爆款专区商品
    news_image: "" //新人商品背景图
  },
  getShareImg() {
    sharePoster.createPoster({
      data: Object.assign({
        uid: app.globalData.userInfo.uid,
        pid: app.globalData.userInfo.uid
      })
    })
    this.checkoutFenXiang()
  },
  // 初始化内容swiper高度
  initContentSwiperHeight() {
    console.log('重新计算高度')
    let height = 0;
    let query = wx.createSelectorQuery()
    const lun = query.select('#item-wrap' + this.data.tabIndex)
    lun.boundingClientRect().exec(res => {
      height = res[0].height
      if (height < defaultSwiperHeight) {
        height = defaultSwiperHeight
      }
      this.setData({ contentSwiperHeight: height })
    })

  },
  getinfo() {
    app.http.get('/api/partner/home/getinfo').then(res => {
      wx.setNavigationBarTitle({
        title: res.site_name
      })
      this.setData({
        getinfo: res
      })
    })
  },
  nextPage() {
    if (!this.data.isAllowLoad) { // 没有到最后一页
        this.storelist()
    }
  },
  //获取爆款商品
  getBlast() {
    app.http.get('/api/partner/home/storelist?is_blast=1').then(res => {
        this.setData({ blastProductList: res })
    })
  },
  storelist() {
    this.data.isAllowLoad = false;
    let timeList2 = [];
    // 针对用户进来选择了分类以及没有选择分类时下拉触发所要请求接口不同的处理
    const apiUrl = '/api/partner/home/storelist'
    const httpObj = {page: this.data.page, limit: this.data.limit, keyword: this.data.keyword }
    app.http.post(apiUrl, httpObj).then(res => {
      if (this.data.selectClassId !== -1) {
        //let storelist = this.data.storelist.concat(res);
        let storelist = res;
        //处理倒计时
        for (let key in storelist) {
          if (storelist[key].seckill.status == 1) {
            timeList2[key] = storelist[key].seckill.data.stop_time;
          }
        }
        this.setData({
          storelist,
          timeList: timeList2,
        });
      } else if (this.data.selectClassId == -1) {
        this.setData({
          storelist:this.data.storelist.concat(res)
        });
        if(this.data.isLoad ==1 ){
          wx.hideLoading();
          return
        }
        //无限加载页数
        if ((res && res.length < this.data.limit)) {
          this.setData({
            isLoad: 1
          })
        } else {
          this.data.page++
        }
      }
      this.data.isAllowLoad = true;
      wx.hideLoading();
    })
  },
  // 监控当前页面触底事件
  onReachBottom() {
    console.log('触底',this.data)
    this.getAdList();
   // this.loadmore()
 /*  this.setData({
     adArr: [...this.data.adArr,{size:6,showMore:true}]
   })*/
  },
  loadmore() {
    if (this.data.isLoad || !this.data.isAllowLoad) return
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.storelist();
  },
  //获取首页banner轮播图
  getBanner() {
    app.http.post('/api/marketing/getbanner', {}).then(res => {
      this.setData({
        bannerList: res,
      })
    });
  },
  //获取首页分类
  async getCategory() {
 //   const categoryList8 = await app.http.post('/api/marketing/getCategory', {})
   // console.log(categoryList8)
    const categoryList = await app.http.post('/api/Marketing/getAdv', { type: 1 })
    this.setData({
        categoryList: categoryList,
    })
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.timeList;
    let countDownArr = [];
    // 对结束时间进行处理渲染到页面
    for (let key in endTimeList) {
      if (endTimeList[key]) {
        let endTime = new Date(endTimeList[key]).getTime();
        let obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
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
        } else {//活动已结束，全部设置为'00'
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
    this.setData({ countDownList: countDownArr });
    setTimeout(this.countDown, 1000);
  },
  toMore(e){
    console.log(e.target.dataset)
    let kind = e.target.dataset.kind, url = e.target.dataset.tourl, appId = e.target.dataset.appid;
    switch (kind) {
      case 1:
      case 2:
      case 3:
        wx.navigateTo({
          url
        })
        break;
      case 4:
        wx.navigateToMiniProgram({
          appId,
          path: url,
          success(res) {
            // 打开成功
          //  console.log(res)
          }
        })
        break;
        case 5:
        wx.navigateTo({
          url: "/pages/common/goout/index?url=" + url,
        })
        break;
      default: break;
    }
    
  },
  async getAdList(){
    wx.showLoading({
      title: '加载中',
    })
    const ad = await app.http.post('/api/Marketing/getAdv', { type: 3,page:++adPage });
    console.log('请求数据',ad)
    wx.hideLoading();
    if(ad.length){
      
    this.setData({
      adArr: [...this.data.adArr, ...ad.map(item => {
        return {
          adListInfo: item,
          showMore: item.product.length >= 6 ? true : false,
          size: 6
        }
      })],
    },()=>{
      console.log('获取数据', this.data.adArr);
    })}
  },
 async onLoad() {

//广告部分
   const chePu = await app.http.post('/api/Marketing/getAdv', { type: 2});
   
//列表部分
   const ad = await app.http.post('/api/Marketing/getAdv', { type: 3, page: ++adPage });

    this.setData({
      chePu,
      adArr: ad.map(item => {
        return {
          adListInfo: item,
          showMore: item.product.length >= 6 ? true : false,
          size: 6
        }
      }),
      islogin: !(app.globalData.token === ''),
      news_image: app.globalData.HOST + "/public/wechat_assets/news.png"
    })
    this.getinfo()
    this.getBlast()
    this.CalculationHeight()
    self = this;
    wx.getStorage({
      key: 'noviceShow',
      success(e) {
        self.setData({
          noviceShow: 0
        })
      },
      fail(e) {
        self.setData({
          noviceShow: 1
        })
      }
    })
  },
  goDetails(e) {
    let storelistItem = this.data.storelist.filter(ele => {
      return ele.id == e.currentTarget.id
    })
    app.varStorage.set('storeDetail', storelistItem[0])
    wx.navigateTo({
      //由之前的跳转到分享页面，现在直接跳转到商品详情页面
      "url": "/pages/partner/detail/detail?id=" + e.currentTarget.id
      // "url": "/pages/partner/share/index"
    });
  },
  //领取优惠券
  show_modal(e) {
    let pid = e.currentTarget.dataset.pid;
    app.http.post('/api/coupon/getCouponByPid', {
      product_id: pid
    }).then(res => {
      if (res.status == 0) {
        wx.showToast({
          title: '您已经领过优惠券啦',
          icon: 'none',
        })
      } else {
        this.setData({
          coupon_id: res.data.id,
          coupon_price: res.data.price,
          coupon_date: res.data.date,
          showModal: true,
          pid: pid
        })
      }
    })
  },
  hide_modal() {
    this.setData({
      showModal: false,
    })
  },
  // 切换分享显示
  checkoutFenXiang() {
    this.setData({ fenXiangShow: !this.data.fenXiangShow })
  },
  //领取优惠券
  get_coupon() {
    app.http.post('/api/coupon/setcoupon', {
      coupon_id: this.data.coupon_id,
    }).then(res => {
      wx.showToast({
        title: '领取成功',
        icon: 'none',
      })

      //隐藏成功领取的优惠券 
      let storelist = this.data.storelist;
      let index = 0;
      for (let item of storelist) {
        if (item.id == this.data.pid) {
          storelist[index].coupon.status = 0;//已经领取
        }
        index++;
      }
      this.setData({
        showModal: false,
        storelist: storelist,
      })
    })
  },
  toGo(e){
    if (e.target.dataset.adinfo){
      let { kind, url, appid } = e.target.dataset.adinfo;
      console.log(kind, url, appid)
      
      switch (kind) {
        case 1:
        case 2:
        case 3:
          wx.navigateTo({
            url
          })
          break;
        case 4:

          wx.navigateToMiniProgram({
            appId: appid,
            path: url,
            success(res) {
              // 打开成功
              console.log(res)
            }
          })
          break;
        case 5:
          wx.navigateTo({
            url: "/pages/common/goout/index?url=" + url,
          })
          break;
        default: break;
      }
    }
    
  },
  async CalculationHeight() {
    let height = 0;
    let query = wx.createSelectorQuery()
    const lun = query.select('.countTop')
    const res = await new Promise((resolve, reject) => {
      lun.fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY']
      }, function (res) {
        resolve(res)
      }).exec()
    })
    height = res.height
    this.setData({ heightCount: height })
  },
  MonitorNav(event) {
    this.setData({ scrollTop: event.detail.scrollTop })
  },
  onShow: async function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    console.log(app.varStorage.get('isShareBack'))
    if (app.varStorage.get('isShareBack') === undefined) {
      if (this.data.isLoad || !this.data.isAllowLoad) return
     
      wx.showLoading({
        title: '加载中',
      })
      
      this.setData({
        adArr: [],
        storelist:[],
        page:1,
        loading:false
      },()=>{
        adPage=0;
        this.getAdList();
        this.storelist();
      })
     
     /* this.setData({
        adArr: [...this.data.adArr, { size: 6, showMore: true }],
      })*/
     
     
    } else {
      app.varStorage.del('isShareBack')
    }
    //获取banner轮播广告
    this.getBanner();
    //获取分类
    await this.getCategory();
    //获取新人专区信息
    this.getNews()
  },
  getNews() {
    if (this.data.islogin && this.data.isfirst) {
      app.http.get('/api/marketing/getNewbornZoneStore').then(res => {
        this.setData({
          newObj: res[0]
        })
      })
    }
  },
  onPageScroll: function (res) {
    this.setData({ scrollTop: res.scrollTop })
  },
  onShareAppMessage: function () {
    console.log(app.globalData.userInfo.uid)
    return {
      title: `${app.globalData.userInfo.nickName}邀请您免费注册万车品商城会员`,
      path: '/pages/index/index?share_id=' + app.globalData.userInfo.uid + '&type=invite',
      imageUrl: '/assets/image/partner_share_poster3.jpeg'
    }
  },
  touchMove() {
    return
  },
  goHelper() {
    this.closeNovice();
    wx.navigateTo({
      "url": "/pages/partner/personal/helper/index"
    })
  },
  goHelperAll() {
    wx.navigateTo({
      "url": "/pages/partner/useDesc/index"
    })
  },
  closeNovice() {
    wx.setStorage({
      key: 'noviceShow',
      data: 1,
      success() {
        self.setData({
          noviceShow: 0
        })
      }
    })
  },
  close() {
    console.log('guanbi')
    this.setData({ isfirst: false })
  },
  goBay() {
    wx.navigateTo({ url: `/pages/partner/detail/detail?id=${this.data.newObj.pro_id}` })
    this.close()
  },
  //  禁用触摸穿透
  preventTouchMove() { },
  //跳转到外部小程序
  goOutMiniProgram(e)
  {
    let url = e.currentTarget.dataset.url;
    wx.navigateToMiniProgram({
      appId: 'wx1e90ffc23ecb6807',
      path: url,
      envVersion: 'release',// 打开正式版
   })
  },
  goSearch(e) {
    let selectTabType = e.currentTarget.dataset.type
    let kind = e.currentTarget.dataset.kind, appId = e.currentTarget.dataset.appid;
    let jumpUrl = "";
    //点击分类tab跳转
    if (selectTabType == "category"){
         let url = e.currentTarget.dataset.url;
            if(url)
            {
              if (kind === 1 || kind === 2 || kind === 3){
                jumpUrl = url
              }
              else if(kind===4){
                wx.navigateToMiniProgram({
                  appId,
                  path: url,
                  success(res) {
                    // 打开成功
                  //  console.log(res)
                  }
                })
              }
              else{
                jumpUrl = "/pages/common/goout/index?url=" + url
              }
                
            }else{
        let selectTabId = e.currentTarget.dataset.id
        let selectTabname = e.currentTarget.dataset.name
        let waitingTab = ["油卡充值", "VIP服务商"]
        if (waitingTab.indexOf(selectTabname) >= 0) {
            jumpUrl = "/pages/common/waiting/index?title="+selectTabname
        } else {
            jumpUrl = "/pages/partner/search/index?type=category&cate_id="+selectTabId+"&title="+selectTabname
        }
      }
    }
    //点击爆款商品图标跳转
    else if (selectTabType == "blast_product") {
        jumpUrl = "/pages/partner/search/index?type=is_blast&title=爆款专区"
    }
    //点击全部商品图标跳转
    else if (selectTabType == "all_product") {
        jumpUrl = "/pages/partner/search/index?type=all&title=全部商品"
    }
    if (kind !==4){
    wx.navigateTo({
        url: jumpUrl
    })
    }
  },
  goInputSearch(e) {
      //console.log(1111)
      let detail_val = e.detail.value.trim()
      console.log(detail_val)
      //if (!this.data.isAllowLoad || !this.data.isAllowLoad2) return;
      //this.data.isAllowLoad2 = false;
      if (detail_val != "") {
          wx.navigateTo({
              url: "/pages/partner/search/index?type=search&keyword="+detail_val+"&title=全部商品"
          })
      }
    },
})