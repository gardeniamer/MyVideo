// pages/components/userInput/userInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: -1,
    phoneNumber: "",
    password: "",
    timer: "",
    timer2: ""
  },

  lifetimes: {
    
    detached() {
      clearInterval(this.data.timer2)
    },

    attached() {
      this.data.timer2 = setInterval(() => {
      if(wx.getStorageSync('login') == true) {
          wx.request({
            method:"GET",
            url: 'http://localhost:4040/loginInspect',
            header: {
              "cookie": wx.getStorageSync('cookies')
            },
            success: (res)=>{
              if(res.statusCode != 200) {
                wx.showToast({
                  icon:"none",
                  title: '登录认证已过期，请重新认证',
                })
                wx.setStorageSync('login', false)
                wx.setStorageSync('refresh', true)
                wx.reLaunch({
                  url: '/pages/user/user',
                })
                clearInterval(this.data.timer2)
              }
              else if(res.statusCode == 200) {
                wx.setStorageSync('login', true)
              }
            },
            fail: ()=>{
              wx.showToast({
                icon: "none",
                title: '请检查网络配置',
              })
            }
          })
      }
      else {
        clearInterval(this.data.timer2)
      }
    }, 1000);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    active(e) {
      this.setData({
        active: e.target.dataset.act
      })
    },

    phone(e) {
      this.setData({
        phoneNumber: e.detail.value
      })
    },

    pwd(e) {
      this.setData({
        password: e.detail.value
      })
    },

    submiting() {
      if(this.data.password == "" || this.data.phoneNumber == "") {
        wx.showToast({
          icon:"error",
          title: '请完善信息',
        })
      }
      else if(this.data.phoneNumber.length != 11 ||!this.data.phoneNumber.startsWith(1)) {
        wx.showToast({
          icon: "none",
          title: '请输入合法手机号',
        })
        setTimeout(() => {
          this.setData({
            phoneNumber: ""
          })
        }, 500);
      }
      else {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(() => {
          wx.request({
            method: "post",
            url: `http://localhost:4040/modify?phoneNumber=${this.data.phoneNumber}&password=${this.data.password}`,
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "cookie": wx.getStorageSync('cookies')
            },
            success: (res)=>{
              wx.hideLoading()
              if(res.data.errMsg) {
                wx.showToast({
                  icon:"none",
                  title: '请确认密码正确性',
                })
              }
              else if(res.statusCode == 200) {
                this.triggerEvent("closing")
                wx.showToast({
                  title: '登录成功',
                })
                getApp().onLaunch()
                wx.setStorageSync('begin', new Date().getTime())
                wx.setStorageSync('phoneNumber', this.data.phoneNumber)
                wx.setStorageSync('id', res.data.user_id)
              }

            },
            fail: ()=>{
              wx.showToast({
                icon: "error",
                title: '请检查网络配置',
              })
            }
          })
        }, 600);

      }
    },

    login() {
      wx.showLoading({
        title: '加载中',
      })
      
      if(this.data.timer) {
        clearTimeout(this.data.timer)
      }

      this.data.timer = setTimeout(() => {
        wx.login({
          success: (res) => {
            if(res.code) {
              wx.request({
                url: 'http://localhost:4040/login',
                data: {
                  code: res.code
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: (res)=>{
                  if(res.data.msg) {
                    wx.hideLoading()
                    wx.setStorageSync('cookies', res.cookies[0])
                    this.submiting()
                  }
                },
                fail: ()=>{
                  wx.showToast({
                    icon: "error",
                    title: '请检查网络配置',
                  })
                }
              })
            }
          },
        })
      }, 500);
  
    }

  }
})
