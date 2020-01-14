
const app = getApp()
var self;
//低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 200
Page({
  data: {
    sortTabList:[],
    sortTabList1:[],
    productList:[],
    allList:[],
    loaded: false,
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
    sortDirection: "asc", //默认的排序方式
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
      this.changeBarTitle()
      this.initSortTabs()
      this.goProductList()
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
    that.setData({
        sortTabList1:[],
    }) 
  },
  //获取商品
  goProductList(){
    const size = this.data.limit; // 默认一页条数
    if (this.data.loading) return // 已经在加载中了
    console.log('页数：' + this.data.page)
    wx.showLoading({
        title: '加载中',
    })
    this.data.loading = true
    // 针对用户进来选择了分类以及没有选择分类时下拉触发所要请求接口不同的处理
    const apiUrl = '/api/customer/mall/getProductList'
    const httpObj = { 
      page: this.data.page, 
      limit: this.data.limit, 
      keyword: this.data.keyword, 
      order_field: this.data.sortField, 
      order_sort: this.data.sortDirection, 
      is_blast: this.data.productType == "all" ? 0:1,
    }
    if (this.data.selectClassId != -1) {
      httpObj.cate_id = this.data.selectClassId
    }
    app.http.get(apiUrl, httpObj).then(res => {
        if (this.data.selectClassId !== -1) {
            // let getProductList = this.data.getProductList.concat(res)
            let ProductList = res
            this.setData({
                ProductList
            })
        } else if (this.data.selectClassId == -1) {
            if (this.data.loaded) {
                wx.hideLoading()
                return
            }
            let allList = this.data.allList.concat(res)
            this.setData({
                allList
            })
            if (res && res.length < size) {
                this.setData({
                    loaded: true
                })
            } else {
                this.data.page++
            }
        }
        wx.hideLoading()
        this.data.loading = false
    })
    wx.hideLoading();
  },
  goDetails(e) {
    let storeList = this.data.selectClassId == -1 ? this.data.allList : this.data.productList
    console.log(storeList)
    let productList = storeList.filter(ele => {
        return ele.id == e.currentTarget.id
    })
    app.varStorage.set('storeDetail', productList[0])
    // this.setData({
    //     ReplacescrollTop: this.data.scrollTop
    // })
    wx.navigateTo({
        url: '/pages/customer/detail/detail?id=' + e.currentTarget.id
    })
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
  onReachBottom() {
    this.nextPage()
  },
  nextPage() {
    console.log('loaded' + this.data.loaded)
    if (!this.data.loaded) { // 没有到最后一页
        this.goProductList()
    }
  },
  onPageScroll: function (res) {
    this.setData({ scrollTop: res.scrollTop })
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
        allList: [],
        productList: [],
        keyword: detail_val, // 不搜索空串
        loaded: false,
      }, () => {
        this.goProductList()
      })

    }
   
    //this.data.isAllowLoad2 = true;
  },
  clearText() {
    this.setData({
      page: 1,
      allList: [],
      productList: [],
      keyword: '', // 不搜索空串
      loaded: false,
    }, () => {
      this.goProductList()
    })
  },
  changeSort(e) {
    let sortTabDirection = e.currentTarget.dataset.direction;
    this.setData({
      sortDirection: sortTabDirection,
      sortTabList1:[],
      loaded: false,
      allList: [],
      productList: []
    })
    this.goProductList()
    //页面加载完处理tab
    let that = this
    setTimeout(function(){
      that.setData({
        hiddenTab: true
      })
    }, 2000)
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