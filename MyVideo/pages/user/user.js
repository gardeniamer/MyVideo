// pages/user/user.js
const {pathToBase64, base64ToPath} = require("../../js_sdk/mmmm-image-tools/index")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: "https://edu.faisys.com/dist/editor/image/headDefault.4fe57e8d.png",
    headWord: "登录中。。。",
    login: false,
    word:"",
  },

  onClose() {
    this.setData({
      login: true,
      headWord: "在此修改名字与头像"
    })
    wx.setStorageSync('login', true)
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/user/user',
      })
    }, 600);
  },

  onChooseAvatar(e) {
    try {

      (async ()=>{
        wx.downloadFile({
          url: e.detail.avatarUrl,
          success:(res)=>{
            wx.getFileSystemManager().saveFile({
              tempFilePath: res.tempFilePath,
              success:(res)=>{
                  const image = res.savedFilePath
                  wx.request({
                  method: "POST",
                  url: `http://localhost:4040/modifyContent?imageTrans=${image}`,
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "cookie": wx.getStorageSync('cookies')
                  },
                  success: (res)=>{
                    if(res.statusCode == 200) {
                      wx.showToast({
                        title: '修改成功',
                      })
                      this.setData({
                        head: image
                      })
                    }
                    else {
                      wx.showToast({
                        icon:"error",
                        title: '修改失败',
                      })
                    }
                  },
                  fail: ()=>{
                    wx.showToast({
                      icon:"error",
                      title: '网络故障',
                    })
                  }
                })
              }
            })
          }
        })
      })()

    }catch(e){
      wx.showToast({
        icon:'none',
        title: e,
      })
    }
  },

  nickName(e) {

    wx.request({
      method: "POST",
      url: `http://localhost:4040/modifyContent?headWord=${e.detail.value}`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "cookie": wx.getStorageSync('cookies')
      },
      success: (res)=>{
        if(res.statusCode == 200) {
          wx.showToast({
            title: '修改成功',
          })
          this.setData({
            headWord: e.detail.value
          })
        }
        else {
          wx.showToast({
            icon:"error",
            title: '修改失败',
          })
        }
      },
      fail: ()=>{
        wx.showToast({
          icon:"error",
          title: '网络故障',
        })
      }
    })
  },

  exit() {
    wx.setStorageSync('login', false)
    wx.removeStorageSync('cookies')
    wx.removeStorageSync('begin')
    wx.removeStorageSync('phoneNumber')
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(wx.getStorageSync('login') == '') {
      wx.setStorageSync('login', false)
    }

    if(wx.getStorageSync('login') == true) {
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(() => {
        wx.request({
          url: `http://localhost:4040/userMsg?phone=${wx.getStorageSync('phoneNumber')}`,
          header: {
            "cookie": wx.getStorageSync('cookies')
          },
          success: (res)=>{
            wx.hideLoading()
            if(res.statusCode == 200) {
                wx.showToast({
                  title: '加载成功',
                })
                this.setData({
                  headWord: res.data.username,
                  head: res.data.portrait
                })
            }
          }
        })
      }, 400);
    }
    else {
      wx.showToast({
        icon:"none",
        title: '登录失效，请重新登录！',
      })
      wx.setStorageSync('login', false)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  onTabItemTap: function(item) {
    if(item.pagePath == "pages/user/user"){
      if(wx.getStorageSync('login') == false&&wx.getStorageSync('refresh') == true) {
        wx.setStorageSync('refresh', false)
        wx.reLaunch({
          url: '/pages/user/user',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(wx.getStorageSync('login') != ''){
      this.setData({
        login: wx.getStorageSync('login')
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})