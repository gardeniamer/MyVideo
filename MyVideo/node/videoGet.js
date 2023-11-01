const db = require("../utils/util")
const express = require("express")
const router = express.Router()
router.use(express.urlencoded({ extended: true }))

router.get("/vedioGet",(req,res)=>{
  if(req.session.session_key&&req.session.openid) {
    (async ()=>{
      let arr = [];
      const userData = await db.tb_user.findMany({
        where: {
          phone: req.query.phone
        }
      })

      const userLike = await db.tb_user_video.findMany({
        where: {
          user_id: userData[0].id
        }
      })
      const firstData = await db.tb_video.findFirst()
      const firstID = firstData.id
      let initial = (req.query.page - 1) * 5;
      let count = req.query.page * 5;
      while(BigInt(initial) < BigInt(count)) {
        let moreData = await db.tb_video.findUnique({
          where: {
            id: firstID + BigInt(initial)
          }
        })
        BigInt(initial++)
        if(moreData == null) {
          break;
        }
        arr.push(moreData)
      }
      BigInt.prototype.toJSON = function() { return this.toString() };
      res.send({
        page: arr,
        like: userLike
      })
    })();
  }
  else {
    res.statusCode = 403
    res.send({
      errMsg: "验证过期，请重新登录"
    })
  }

  

})

module.exports = router