const app = getApp()
const cache = {}

function getCache(url, cb) {
  const cacheRes = cache[url]
  if (cacheRes) {
    wx.getFileInfo({
      filePath: cacheRes.path,
      success(res) {
        if (res.digest === cacheRes._hash) {
          cb(cacheRes)
        } else {
          cb(null)
        }
      },
      fail(res) {
        cb(null)
      }
    })
  } else {
    cb(null)
  }
}

function putCache(url, res) {
  wx.getFileInfo({
    filePath: res.path,
    success(r) {
      if (r && r.digest) {
        res._hash = r.digest
        cache[url] = res
      }
    }
  })
}
let downFile = (url) => new Promise((resolve, reject) => {
  getCache(url, cacheRes => {
    if (cacheRes) {
      console.log('命中cache')
      resolve(cacheRes)
      return
    }
    wx.downloadFile({
      url,
      success(res) {
        wx.getImageInfo({
          src: res.tempFilePath,
          success(res) {
            // 缓存
            putCache(url, res)
            resolve(res)
          },
          fail() {
            reject(res.tempFilePath)
          }
        })
      },
      fail(res) {
        reject(res.tempFilePath)
      }
    })
  })
})
let self;
Component({
  data: {
    show: false
  },
  methods: {
    touchMove() {
      return;
    },
    createCanvas(path) {
      self = this;
      downFile(path).then(res => {
        console.log(res)
        let ctx = wx.createCanvasContext('posterCanvas')
        ctx.drawImage(res.path, 0, 0, res.width, res.height)
        this.triggerEvent('setcanvas',{width:res.width,height:res.height});
        ctx.draw(true, () => {
          wx.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            success(res) {
              console.log(res.tempFilePath)
              wx.hideLoading()
              self.setData({
                tempFilePath: res.tempFilePath,
                show: true
              })
            },
            fail(res) {
              wx.hideLoading()  
              wx.showToast({
                title: '请稍后重试',
                icon: 'none'
              })
            }
          })
        })
        
      }).catch(res => {
        wx.showToast({
          title: '请稍后重试',
          icon: 'none'
        })
        console.log('==== 二维码生成失败 ====')
        console.log(res)
        wx.showModal({
          title: '提示',
          content: res,
          showCancel: false
        })
      })
    },
    hide() {
      this.setData({
        show: false
      })
    },
    save() {
      console.log(self.data.tempFilePath)
      wx.saveImageToPhotosAlbum({
        filePath: self.data.tempFilePath,
        success(res) {
          wx.showToast({
            title: '保存成功'
          })
        },
        fail() {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum'] === false) {
                wx.showModal({
                  'title': '保存失败',
                  'content': '请允许我们保存图片至您的手机',
                  success(e) {
                    if (e.confirm) {
                      wx.openSetting({
                        complete(e) {
                          if (e.authSetting['scope.writePhotosAlbum'] === true) {
                            wx.saveImageToPhotosAlbum({
                              filePath: self.data.saveImgTmpUrl,
                              success() {
                                wx.showToast({
                                  title: '图片保存成功'
                                })
                              }
                            })
                          } else {
                            wx.showToast({
                              title: '未获得权限',
                              icon: 'none'
                            })
                          }
                        }
                      });
                    } else {
                      self.hide();
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    createPoster(props) {
      wx.showLoading({
        mask: true
      })
      this.createCanvas(props[0].data.path)
      // 这里的链接是不经过 app.http 方法的
      // this.createCanvas(`${app.globalData.HOST}/api/partner.partner/getQrCodes?token=${app.globalData.token}&page=pages/index/index&scene=${props[0].data.uid},${props[0].data.pid},${props[0].data.id}`, props[0] ? props[0].data.image : {}, props[0].data.store_name);
    }
  }
})