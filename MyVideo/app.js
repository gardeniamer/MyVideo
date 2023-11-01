// app.js
App({
  onLaunch() {
    if(wx.getStorageSync('login') == true) {
      let timer = setInterval(() => {
        if(new Date().getTime() - wx.getStorageSync('begin') >= 3600000) {
          wx.removeStorageSync('cookies')
          wx.removeStorageSync('begin')
          wx.removeStorageSync('phoneNumber')
          wx.setStorageSync('refresh', true)
          wx.setStorageSync('login', false)
          clearInterval(timer)
        }
        else if(wx.getStorageSync('login') == false) {
          clearInterval(timer)
        }
      }, 1000);

    }
  },

})
