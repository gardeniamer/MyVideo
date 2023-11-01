const db = require("../utils/util")
const express = require("express")
const router = express.Router()
router.use(express.urlencoded({ extended: true }))

router.get("/userMsg",(req,res)=>{
  if(req.session.session_key && req.session.openid) {
    (async ()=>{
      const all = await db.tb_user.findMany({
        where: {
          phone: req.query.phone
        }
      })
      console.log(all);
      if(all.length != 0) {
        res.send({
          username: all[0].username,
          portrait: all[0].portrait
        })
      }
      else {
        res.statusCode = 302
        res.send({
          errMsg: "请先登录/注册后再进行操作"
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