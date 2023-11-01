// index.js
// 获取应用实例
Page({
  data: {
    vedio: [],
    playingVedio: "",
    like: [],
    tapCount: 0,
    timer: "",
    timerSiki:"",
    timerKilai:"",
    timerChange: null,
    timerTime: null,
    page: 1,
    play: {
      id: "",
      ing: false,
    },
    speeded: false,
    currentVideo: 1,
    visible: true,
    width: 0,
    initial: false,
    initialData: 0,
    finalData: 0,
    changed: true,
    currentTime: 0,
    duration: 0,
    loadVideo: false
  },

  onPageScroll: function(scroll) {
    if(scroll.scrollTop > ((640*(this.data.currentVideo-1) + 320))) {
      wx.pageScrollTo({
        scrollTop: (640*this.data.currentVideo),
        duration: 100
      })
      this.setData({
        currentVideo: this.data.currentVideo + 1,
        visible: false
      })
      setTimeout(() => {
        this.setData({
          visible: true
        })
      }, 500);
      this.setData({
        "play.id": this.data.vedio[this.data.currentVideo-1].id,
        "play.ing": true
      })
        this.videoContexts = wx.createVideoContext(this.data.play.id)
        this.videoContexts.play()
        this.videoContextPres = wx.createVideoContext(this.data.vedio[this.data.currentVideo - 2].id)
        this.videoContextPres.pause()
    }
    if(this.data.currentVideo >= 2 && scroll.scrollTop < 640*(this.data.currentVideo-2) + 320){
      wx.pageScrollTo({
        scrollTop: (640*(this.data.currentVideo - 2)),
        duration: 100
      })
      this.setData({
        currentVideo: this.data.currentVideo - 1,
        visible: false
      })
      setTimeout(() => {
        this.setData({
          visible: true
        })
      }, 500);
      this.setData({
        "play.id": this.data.vedio[this.data.currentVideo-1].id,
        "play.ing": true
      })
      this.videoContexts = wx.createVideoContext(this.data.play.id)
      this.videoContexts.play()
      this.videoContextPres = wx.createVideoContext(this.data.vedio[this.data.currentVideo].id)
      this.videoContextPres.pause()
    }
  },

  onReachBottom: function() {
    this.data.page++;
    this.onLoad()
  },

  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
    if(wx.getStorageSync('login')) {

        wx.request({
          url: `http://localhost:4040/vedioGet?page=${this.data.page}&phone=${wx.getStorageSync('phoneNumber')}`,
          header: {
            "cookie": wx.getStorageSync('cookies')
          },
          success: (res)=>{
            console.log(res);
            if(res.statusCode >= 200 && res.statusCode < 400) {
            
              res.data.page.forEach((a1,b)=>{
                a1["vid_name"] = a1["vid_name"].split("_")[1].split(".")[0]
                res.data.like.forEach((a2)=>{
                  if(a1.id == a2.video_id) {
                    a1["user_id"] = a2.user_id
                  }
                })
                this.data.vedio.push(a1)
              })
              wx.hideLoading() 
              this.setData({
                vedio: this.data.vedio,
              })

              if(this.data.loadVideo == false) {
                this.videoContext = wx.createVideoContext(this.data.vedio[0].id)
                this.videoContext.play()
                this.setData({
                  "play.id": this.data.vedio[0].id,
                  "play.ing": true
                })
                this.data.loadVideo = true
              }

            }
            else {
              wx.hideLoading()
              wx.showToast({
                icon: "none",
                title: '登录失效，请重新登录',
              })
              setTimeout(() => {
                wx.setStorageSync('refresh', false)
                wx.reLaunch({
                  url: '/pages/user/user',
                })
              }, 1000);
            }
          },
          fail: ()=>{
            wx.hideLoading()
            wx.showToast({
              icon:"error",
              title: '网络故障',
            })
          }
        })

    }
    else {
      wx.hideLoading()
      wx.showToast({
        icon: "none",
        title: '登录失效，请重新登录',
      })
      setTimeout(() => {
        wx.setStorageSync('refresh', false)
        wx.reLaunch({
          url: '/pages/user/user',
        })
      }, 1000);
    }
  }, 1000);
},

siki(e) {
  if(this.data.timerSiki) {
    clearTimeout(this.data.timerSiki)
  }

  if(e.target.dataset.id == "inner") {
    this.data.timerSiki = setTimeout(()=>{
      if(!e.target.dataset.special) {
        const single = this.data.vedio.find((a)=>{
          if(a.id == e.target.dataset.videoid) {
            return a
          }
        })
        single["love_cnt"]++;
        single["user_id"] = wx.getStorageSync('id')
        this.setData({
          vedio: this.data.vedio
        })
      }
      this.tapSiki(e)
    },400)
  }

  else if(e.target.dataset.id == "video") {
    if(this.data.timer) {
      clearTimeout(this.data.timer)
    }
    if(this.data.tapCount < 2) {
      this.data.tapCount++;
    }
    this.data.timer = setTimeout(() => {
      if(this.data.tapCount >= 2) {
        this.data.timerSiki = setTimeout(()=>{
          if(!e.target.dataset.special) {
            const single = this.data.vedio.find((a)=>{
              if(a.id == e.target.dataset.videoid) {
                return a
              }
            })
            single["love_cnt"]++;
            single["user_id"] = wx.getStorageSync('id')
            this.setData({
              vedio: this.data.vedio
            })
          }
          this.tapSiki(e)
        },400)
      }
      if(this.data.tapCount < 2) {
        this.play(e)
      }
      this.data.tapCount = 0
    }, 400);

  }
},

tapSiki(e) {
  wx.request({
    method:"POST",
    url: `http://localhost:4040/vedioLike?userID=${wx.getStorageSync('id')}&videoID=${e.target.dataset.videoid}`,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "cookie": wx.getStorageSync('cookies')
    },
    success:(res)=>{
      if(res.statusCode == 200) {
        console.log("点赞成功");
      }
      else if(res.statusCode == 302) {
        console.log("重复点赞！！！");
      }
      else {
        wx.showToast({
          icon:"none",
          title: '登录失效,请重新登录',
        })
        setTimeout(() => {
          wx.setStorageSync('refresh', false)
          wx.reLaunch({
            url: '/pages/user/user',
          })
        }, 1000);
      }
    },

    fail:()=>{
      wx.showToast({
        icon:"none",
        title: '点赞失败,请检查网络配置',
      })
    }

  })
},

cancleLike(e) {
  if(e.target.dataset.id == 'cancleLike') {
    const single = this.data.vedio.find((a)=>{
      if(a.id == e.target.dataset.videoid) {
        return a
      }
    })
    single["love_cnt"]--;
    single["user_id"] = null;
    this.setData({
      vedio: this.data.vedio
    })
    wx.request({
      method:"POST",
      url: `http://localhost:4040/videoCancle?userID=${wx.getStorageSync('id')}&videoID=${e.target.dataset.videoid}`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "cookie": wx.getStorageSync('cookies')
      },
      success:(res)=>{
        if(res.statusCode == 200) {
          console.log("取消点赞成功");
        }
        else {
          wx.showToast({
            icon:"none",
            title: '登录失效,请重新登录',
          })
          setTimeout(() => {
            wx.setStorageSync('refresh', false)
            wx.reLaunch({
              url: '/pages/user/user',
            })
          }, 1000);
        }
      },
      fail:()=>{
        wx.showToast({
          icon:"none",
          title: '点赞失败,请检查网络配置',
        })
      }
    })
  }
},

play(e) {
  this.videoContext = wx.createVideoContext(e.target.dataset.videoid)
  if(this.data.play.id != e.target.dataset.videoid) {
    this.videoContextPre = wx.createVideoContext(this.data.play.id)
    this.videoContextPre.pause()
    this.setData({
      "play.id": e.target.dataset.videoid,
      "play.ing": false
    })
  }
  if(this.data.play.ing == false) {
    this.videoContext.play()
  }
  else if(this.data.play.ing == true) {
    this.videoContext.pause()
  }

  this.setData({
    "play.ing": !this.data.play.ing
  })

},

increase() {
  if(this.data.play.ing&& this.data.play.id) {
    this.videoContext.playbackRate(2.0)
    this.setData({
      speeded: true
    })
  }
},

decrease() {
  if(this.data.play.ing && this.data.play.id) {
    this.videoContext.playbackRate(1.0)
    this.setData({
      speeded: false
    })
  }
},

changeTime(e) {

  if(this.data.timerChange == null) {
    this.data.timerChange = setTimeout(()=>{
      const currentTime = Number(e.detail.currentTime).toFixed(2)
      const duration = Number(e.detail.duration).toFixed(2)
      this.setData({
        width: (currentTime/ duration)*100 + "%",
        currentTime: currentTime,
        duration: duration
      })
      this.data.timerChange = null;
    },100)
  }
},

handTime(e) {
    this.data.timerChange? clearTimeout(this.data.timerChange): null
    if(this.data.initial == false) {
      this.data.initialData = Number(e.touches[0].pageX).toFixed(2)
      this.data.finalData = Number(e.touches[0].pageX).toFixed(2)
      this.data.initial = true
      this.videoContext = wx.createVideoContext(this.data.play.id)
      this.videoContext.pause()
      this.setData({
        "play.ing": false,
        changed: false,
      })
    }
    if(this.data.timerTime) {
      clearTimeout(this.data.timerTime)
    }
    this.data.timerTime = setTimeout(()=>{
      this.data.finalData = Number(e.touches[0].pageX).toFixed(2)
    },10)
    this.setData({
        width: String(Number(this.data.width.split("%")[0]) + Number((this.data.finalData - this.data.initialData)/5)) + "%",
      })
    if(Number(Number(this.data.width.split("%")[0]).toFixed(2)/100 * this.data.duration).toFixed(2) >= Number(this.data.duration)) {
      this.setData({
        currentTime: this.data.duration
      })
    }
    else if(Number(Number(this.data.width.split("%")[0]).toFixed(2)/100 * this.data.duration).toFixed(2) <= 0) {
      this.setData({
        currentTime: 0
      })
    }
    else {
      this.setData({
        currentTime: Number(Number(this.data.width.split("%")[0]).toFixed(2)/100 * this.data.duration).toFixed(2)
      })
    }
    this.data.initialData = this.data.finalData

},

timeChange() {
    this.videoContext = wx.createVideoContext(this.data.play.id)
    this.videoContext.play()
    this.data.initial = false
    this.data.timerChange = null
    this.setData({
      "play.ing": true,
      changed: true,
      finalData: 0,
      initialData: 0
    })
    this.videoContext.seek(Number(this.data.currentTime))
}

})
