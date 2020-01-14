
const app = getApp()
var self;
//低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 200
Page({
  data: {
    sortTabList:[],
    sortTabList1:[],
    isLoad: 0,
    isAllowLoad: true,
    page: 1,
    limit: 10,
    heightCount: 0,   //统计监控交互的高度
    scrollTop: 0,    //监控滑动距离
    ReplacescrollTop: 0,    //监控滑动距离
    selectClassId: -1,        //标识选择id
    tabIndex: 0,       //目前切换到的首页tab下标
    contentSwiperHeight: defaultSwiperHeight,
    isloading: false,    //标识切换页是否处于加载状态
    newObj: {},            //新人专区对象
    keyword: "",
    storeList: [],
    productType: "all", //商品活动类型
    navBarTitle: "", //页面标题
    heightCount: 200,
    sortField: "sales", //默认的排序字段
    sortDirection: "desc", //默认的排序方式
    noviceShow: null,
    islogin: false,       //标识是否是登录状态
    selectTabName: "销量",
    hiddenTab: true
  },
  onLoad(options) {
      this.setData({
          selectClassId: options.type == "category" ? options.cate_id : -1,
          productType: options.type == "is_blast" ? "is_blast" : "all",
          keyword: options.type == "search" ? options.keyword : "",
          navBarTitle: options.title,
      })
      this.setData({
        islogin: !(app.globalData.token === '')
      })
      
      this.changeBarTitle()
      this.initSortTabs()
      this.storeList()
      this.CalculationHeight()
  },
  changeBarTitle(){
    wx.setNavigationBarTitle({
        title: this.data.navBarTitle
     })
  },
  switchSortTab(e) {
    let that = this
    let selectTabId = e.currentTarget.dataset.id
    let sortStatus = e.currentTarget.dataset.status
    that.data.sortTabList.forEach(function(item, index){
        let sortTabList1 = "";
        if (index == selectTabId) {
            sortTabList1 = that.data.sortTabList1.concat({
                "isShow": true,
                "title": item.title,
                "attr": item.attr
            })
            that.setData({
              selectTabName: item.title,
              sortField: item.attr,
              hiddenTab: false
            })
            //sortTabList1.concat()
        } else {
            sortTabList1 = that.data.sortTabList1.concat({
                "isShow": false,
                "title": item.title,
                "attr": item.attr
            })
        }
        //console.log(sortTabList1)
        that.setData({
            sortTabList:sortTabList1,
            sortTabList1:sortTabList1
        }) 
    })
    this.setData({
      sortTabList1:[]
    })
  },
  //获取商品
  storeList() {
    this.data.isAllowLoad = false;
    let timeList2 = [];
    // 针对用户进来选择了分类以及没有选择分类时下拉触发所要请求接口不同的处理
    const apiUrl = this.data.selectClassId === -1 ? '/api/partner/home/storelist' : '/api/marketing/getCategoryProducts'
    const httpObj = this.data.selectClassId === -1 ? { page: this.data.page, limit: this.data.limit, keyword: this.data.keyword,sort:{ field: this.data.sortField, value: this.data.sortDirection} } : { cate_id: this.data.selectClassId,keyword: this.data.keyword, sort:{ field: this.data.sortField, value: this.data.sortDirection} }
    console.log(httpObj)
    app.http.post(apiUrl, httpObj).then(res => {
      if (this.data.selectClassId !== -1) {
        //let storelist = this.data.storelist.concat(res);
        let storeList = res;
        //处理倒计时
        for (let key in storeList) {
          if (storeList[key].seckill.status == 1) {
            timeList2[key] = storeList[key].seckill.data.stop_time;
          }
        }
        this.setData({
          storeList,
          timeList: timeList2,
        });
      } else if (this.data.selectClassId == -1) {
        this.setData({
          storeList:this.data.storeList.concat(res)
        });
        if(this.data.isLoad ==1 ){
          wx.hideLoading();
          return
        }
        /* 旧版逻辑目前统一用storelist
        let alllist = this.data.alllist.concat(res)
        let alllist = res
        this.setData({
          alllist
        })
        */
        if (res && res.length < this.data.limit) {
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
  goDetails(e) {
    let storeListItem = this.data.storeList.filter(ele => {
      return ele.id == e.currentTarget.id
    })
    app.varStorage.set('storeDetail', storeListItem[0])
    wx.navigateTo({
      //由之前的跳转到分享页面，现在直接跳转到商品详情页面
      "url": "/pages/partner/detail/detail?id=" + e.currentTarget.id
      // "url": "/pages/partner/share/index"
    });
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
    // console.log(res)
    this.setData({ heightCount: height })
  },
  // 监控当前页面触底事件
  onReachBottom() {
    this.loadmore()
  },
  loadmore() {
    if (this.data.isLoad || !this.data.isAllowLoad) return
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.storeList()
  },
  onPageScroll: function (res) {
    this.setData({ scrollTop: res.scrollTop })
  },
  goDetails(e) {
    let storelistItem = this.data.storeList.filter(ele => {
      return ele.id == e.currentTarget.id
    })
    app.varStorage.set('storeDetail', storelistItem[0])
    wx.navigateTo({
      //由之前的跳转到分享页面，现在直接跳转到商品详情页面
      "url": "/pages/partner/detail/detail?id=" + e.currentTarget.id
      // "url": "/pages/partner/share/index"
    });
  },
  setSearchText(e) {
    //console.log(1111)
    let detail_val = e.detail.value.trim()
    console.log(detail_val)
    //if (!this.data.isAllowLoad || !this.data.isAllowLoad2) return;
    //this.data.isAllowLoad2 = false;
    if (detail_val != this.data.keyword) {
      //text = detail_val
      this.setData({
        page: 1,
        storeList: [],
        keyword: detail_val, // 不搜索空串
      }, () => {
        this.storeList()
      })

    }
   
    //this.data.isAllowLoad2 = true;
  },
  clearText() {
    this.setData({
      page: 1,
      storeList: [],
      keyword: '', // 不搜索空串
    }, () => {
      this.storeList()
    })
  },
  //返回显示
  onShow() {},
  onUnload() {
    wx.hideLoading()
  },
  changeSort(e) {
    let sortTabDirection = e.currentTarget.dataset.direction;
    this.setData({
      sortDirection: sortTabDirection,
      sortTabList1:[],
      isloading: false,
      storeList:[]
    })
    this.storeList()
    //页面加载完处理tab
    let that = this
    setTimeout(function(){
      that.setData({
        hiddenTab: true
      })
    },2000)
    
  },
  //初始化排序tab
  initSortTabs() {
    this.setData({
        sortTabList: [{
                        "isShow": false,
                        "title": "销量",
                        "attr": "sales"
                    },{
                        "isShow": false,
                        "title": "人气",
                        "attr": "browse" 
                    },{
                        "isShow": false,
                        "title": "价格",
                        "attr": "price"
                    }]
    })
  }
})