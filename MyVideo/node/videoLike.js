const express = require("express");
const db = require("../utils/util");

const router = express.Router()

router.use(express.urlencoded())

router.post("/vedioLike",(req,res)=>{
  if(req.session.session_key&&req.session.openid) {

    (async ()=>{

      const video = await db.tb_video.findUnique({
        where: {
            id: req.query.videoID
        }
      })

      const repeat = await db.tb_user_video.findMany({
        where: {
          user_id: req.query.userID,
          video_id: req.query.videoID
        }
      })

      if(repeat.length == 0) {
        
        await db.tb_user_video.create({
          data: {
            id: Number(req.query.userID) + Number(req.query.videoID),
            user_id: req.query.userID,
            video_id: req.query.videoID
          }
        })

        await db.tb_video.update({
          where: {
            id: req.query.videoID
          },

          data: {
            love_cnt: video.love_cnt + 1
          }

        })

        console.log("点赞成功");
        res.send({
          msg:"点赞成功",
        })

      }
      else {
        console.log("重复点赞！！");
        res.statusCode = 302
        res.send({
          msg:"请勿重复点赞"
        })
      }

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