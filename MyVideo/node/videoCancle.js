const express = require("express")
const db = require("../utils/util");
const router = express.Router()

router.use(express.urlencoded())

router.post("/videoCancle",(req,res)=>{
  if(req.session.session_key&&req.session.openid) {
    (async ()=>{

      const video = await db.tb_video.findUnique({
        where:{
          id: req.query.videoID
        }
      })

      await db.tb_user_video.deleteMany({
        where: {
          user_id: req.query.userID,
          video_id: req.query.videoID
        }
      })

      await db.tb_video.update({
        where: {
          id: req.query.videoID
        },
        data: {
          love_cnt: video.love_cnt - 1
        }
      })

      console.log("取消点赞成功");
      res.send({
        msg:"取消点赞成功",
      })


    })()
  }
  else {
    res.statusCode = 403
    res.send({
      errMsg: "验证过期，请重新登录"
    })
  }
})

module.exports = router

