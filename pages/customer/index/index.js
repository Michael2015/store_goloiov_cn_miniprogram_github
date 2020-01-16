import Contact from '../../../utils/contactUser/contactUser'
const app = getApp()
let self;
// 低版本ios scroll-view 初始化时必须充满一屏才能滚动，给个默认高度就能满一屏
const defaultSwiperHeight = 200
Page({
    data: {
        userInfo: {},
        getinfo: {},
        getnotice: [],
        getProductList: [],
        page: 1,
        limit: 10,
        getPartnerInfo: {},
        loading: false, // 加载中
        loaded: false, // 加载完毕
        showModal: false,//是否显示模态框
        coupon_id: 0,
        coupon_date: '',
        coupon_price: 0,
        pid: 0,
        bannerList: [],
        categoryList1: [], //横向导航栏
        heightCount: 0,   //统计监控交互的高度
        scrollTop: 0,    //监控滑动距离
        ReplacescrollTop: 0,    //监控滑动距离
        selectClassId: -1,         //标识选择id
        tabIndex: 0,       //目前切换到的首页tab下标
        contentSwiperHeight: defaultSwiperHeight,
        isloading: false,    //标识切换页是否处于加载状态
        islogin: false,       //标识是否是登录状态
        isfirst: true,         //是否是第一次进入首页
        newObj: {},            //新人专区对象
        showMoreBlast: false,  //是否需要展示更多爆款专区
        blastProductList: [], //爆款专区商品
        allProductList: [], //全部商品
        keyword: "",
        news_image: "", //新人专区背景图
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
    onReachBottom() {
        this.nextPage()
    },
    tabPageChange(event) {
        this.goList({ currentTarget: { dataset: { id: event.detail.currentItemId, index: event.detail.current } } })
    },
    getnotice() {
        app.http.get('/api/customer/mall/getnotice').then(res => {
            this.setData({
                getnotice: res
            })
            this.getPartnerInfo()
        })
    },
    register() {
        var partner_invite_id = app.globalData.partner_invite_id ? app.globalData.partner_invite_id : app.globalData.shareInfo.share_user_id;
        wx.navigateTo({
            url: '/pages/partner/personal/partner/invite?share_id=' + partner_invite_id,
        })
    },
    getinfo() {
        app.http.get('/api/customer/mall/getinfo').then(res => {
            this.setData({
                getinfo: res
            })
            this.getnotice()
        })
    },
    getProductList() {
        const size = this.data.limit; // 默认一页条数
        if (this.data.loading) return // 已经在加载中了
        console.log('页数：' + this.data.page)
        wx.showLoading({
            title: '加载中',
        })
        this.data.loading = true
        // 针对用户进来选择了分类以及没有选择分类时下拉触发所要请求接口不同的处理
        const apiUrl = '/api/customer/mall/getProductList'
        const httpObj = { page: this.data.page, limit: this.data.limit }
        app.http.get(apiUrl, httpObj).then(res => {
            if (this.data.selectClassId !== -1) {
                // let getProductList = this.data.getProductList.concat(res)
                let getProductList = res
                this.setData({
                    getProductList
                })
            } else if (this.data.selectClassId == -1) {
                if (this.data.loaded) {
                    wx.hideLoading()
                    return
                }
                let allProductList = this.data.allProductList.concat(res)
                this.setData({
                    allProductList
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

    show_modal(e) {
        let pid = e.currentTarget.dataset.pid;
        app.http.post('/api/coupon/getCouponByPid', {
            product_id: pid
        }).then(res => {
            this.setData({
                coupon_id: res.data.id,
                coupon_price: res.data.price,
                coupon_date: res.data.date,
                showModal: true,
            })
        })
    },
    hide_modal() {
        this.setData({
            showModal: false,
        })
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
            let getProductList = this.data.getProductList;
            let index = 0;
            for (let item of getProductList) {
                if (item.id == this.data.pid) {
                    getProductList[index].coupon.status = 0;//已经领取
                }
                index++;
            }
            this.setData({
                showModal: false,
                getProductList: getProductList,
            })
        })
    },
    getPartnerInfo() {
        // console.log(app.globalData)
        app.http.get('/api/customer/mall/getPartnerInfo', { share_id: app.globalData.shareInfo.share_user_id }).then(res => {
            app.globalData.partnerInfo = res;
            this.setData({
                getPartnerInfo: res
            }, () => {
                wx.hideLoading()
            })
        })
    },
    //获取首页banner轮播图
    getBanner() {
        app.http.post('/api/marketing/getbanner', {}).then(res => {
            this.setData({
                bannerList: res,
            })
        });
    },
    goDetails(e) {
        let getProductList = this.data.getProductList.filter(ele => {
            return ele.id == e.currentTarget.id
        })
        app.varStorage.set('storeDetail', getProductList[0])
        // this.setData({
        //     ReplacescrollTop: this.data.scrollTop
        // })
        wx.navigateTo({
            url: '/pages/customer/detail/detail?id=' + e.currentTarget.id
        })
    },
    nextPage() {
        console.log('loaded' + this.data.loaded)
        if (!this.data.loaded) { // 没有到最后一页
            this.getProductList()
        }
    },
    onLoad: function () {
        // console.log(app.globalData)
        this.setData({
            islogin: !(app.globalData.token === ''),
            news_image: app.globalData.HOST + "/public/wechat_assets/news.png"
        })
        self = this;
        this.getinfo()
        wx.showLoading({
            title: '加载中',
        })
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
        this.CalculationHeight()
        this.getBlast()
        this.getProductList()
    },
    contact() {
        Contact.show(this.data.getPartnerInfo)
    },
    onReady() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().toggleToClient()
        }
    },
    onPageScroll: function (res) {
        this.setData({ scrollTop: res.scrollTop })
    },
    onShow: async function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        if (!this.data.loading) {
            // 重置数据
            this.setData({
                // getProductList: [],
                // page: 1,
                loading: false,
                // loaded: false   
            })
            this.getProductList()
        }

        //获取banner轮播广告
        this.getBanner();
        await this.getCategory()
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
    async getCategory() {
        const categoryList = await app.http.post('/api/marketing/getCategory', {})
        
        let transverseCar = categoryList.filter(function (item, index) {
            return index === 0
        })
        this.setData({
            transverseCar_cateId: transverseCar[0].id
        })
        this.setData({
            categoryList: categoryList,
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
    //跳转分类列表页面
    goList(e) {
        let cat_id = +e.currentTarget.dataset.id;
        let tab_id = +e.currentTarget.dataset.index;
        this.setData({
            tabIndex: tab_id,
            selectClassId: cat_id,
            isloading: true
        })
        if (cat_id == -1) {
            this.getProductList()
            return
        }
        app.http.post('/api/customer/mall/getProductList', { cate_id: cat_id }).then(res => {
            this.setData({ getProductList: res, loaded: true, isloading: false })
        })
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
    tologin() {
        let share_user_id = app.globalData.shareInfo.share_user_id;
        let share_partner_id = app.globalData.shareInfo.share_partner_id;
        let share_product_id = app.globalData.shareInfo.share_product_id;
        let url = '';
        if(share_user_id && share_partner_id && share_product_id)
        {
            url = '/pages/login/index?type=share&share_user_id=' + share_user_id + '&share_partner_id=' + share_partner_id + '&share_product_id=' + share_product_id;
        }
        else
        {
            url = '/pages/login/index?share_user_id=' + share_user_id + '&share_partner_id=' + share_partner_id + '&share_product_id=' + share_product_id;
        }
        wx.reLaunch({
            url: url,
        })
    },
    close() {
        console.log('guanbi')
        this.setData({ isfirst: false })
    },
    goBay() {
        wx.navigateTo({ url: `/pages/customer/detail/detail?id=${this.data.newObj.pro_id}` })
        this.close()
    },
    //  禁用触摸穿透
    preventTouchMove() { },
    //获取爆款商品
    getBlast() {
        app.http.get('/api/customer/mall/getProductList?is_blast=1').then(res => {
            this.setData({ blastProductList: res })
        })
    },
    //获取全部商品
    getAll() {
        app.http.post('/api/customer/mall/getProductList', {}).then(res => {
            this.setData({ allProductList: res })
        })
    },
    goSearch(e) {
        let selectTabType = e.currentTarget.dataset.type
        let jumpUrl = "";
        //点击分类tab跳转
        if (selectTabType == "category"){
            let selectTabId = e.currentTarget.dataset.id
            let selectTabname = e.currentTarget.dataset.name
        
            let waitingTab = ["油卡充值", "VIP服务商"]
            if (waitingTab.indexOf(selectTabname) >= 0) {
                jumpUrl = "/pages/common/waiting/index?title="+selectTabname
            } else {
                jumpUrl = "/pages/customer/search/index?type=category&cate_id="+selectTabId+"&title="+selectTabname
            }
        }
        //点击爆款商品图标跳转
        else if (selectTabType == "blast_product") {
            jumpUrl = "/pages/customer/search/index?type=is_blast&title=爆款专区"
        }
        //点击全部商品图标跳转
        else if (selectTabType == "all_product") {
            jumpUrl = "/pages/customer/search/index?type=all&title=全部商品"
        }
        console.log(jumpUrl)
        wx.navigateTo({
            url: jumpUrl
        })
    },
    goInputSearch(e) {
        let detail_val = e.detail.value.trim()
        console.log(detail_val)
        if (detail_val != "") {
            wx.navigateTo({
                url: "/pages/customer/search/index?type=search&keyword="+detail_val+"&title=全部商品"
            })
        }
      },

})