// pages/partner/personal/poster/detail.js

import compositePoster from '../../../../utils/compositePoster/compositePoster'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
      poster_detail:[],
      qrCodeUrl: "",
      posterImgUrl: ""
    },
    onLoad: function (options) {
      self = this;
      this.getPosterDetail(options.id);
      //this.getQrCode();
    },
  
    getPosterDetail(postId)
    {
      app.http.get('/api/partner.partner/getposterdetail?id='+postId).then(res => {
       this.setData({
          poster_detail:res,
       })
       this.getQrCode();
      });
    },

    getQrCode()
    {
      app.http.post('/api/partner.partner/getQrCode',{
        page: 'pages/index/index',
        scene: app.globalData.userInfo.uid +","+app.globalData.userInfo.uid+",0"+',poster'
      }).then(res => {
        this.setData({
          qrCodeUrl:res
        })
        this.Detail();
       });
    },
    //生成海报
  Detail()
  {
    //调用详情页统计
    app.http.post('/api/partner.partner/createPosterImage', {
      poster_img_url: this.data.poster_detail.img_url,
      qrcode_img_url: this.data.qrCodeUrl,
      poster_name:this.data.poster_detail.name
    }).then(res=> {
        this.setData({
          posterImgUrl: res.img_url
        })
    })
    /*
    compositePoster.createPoster({
      data: Object.assign({
          id : 0,// 商品id
          uid: app.globalData.userInfo.uid,//合伙人ID
          pid: app.globalData.userInfo.uid,//店铺ID
          type:'poster',
          image:this.data.poster_detail.img_url,
          store_name:this.data.poster_detail.name
      })
    });
    */
  },
  //保存图片到本地
  save()
  {
    var imgSrc = this.data.posterImgUrl;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res){
            console.log(res);
          }
        })
      }
    })
  }




})

