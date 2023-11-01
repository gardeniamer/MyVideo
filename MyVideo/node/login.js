const express = require("express")

const router = express.Router()

const session = require("express-session")
const FileStore = require("session-file-store")(session)

router.use(express.urlencoded())

router.use(session({
  store: new FileStore({
    path: "../../sessions",
    secret: "videoSession",
    ttl: 3600
  }),
  resave: false,
  secret: "videoTrial",
  saveUninitalized:true,
}))

router.get("/login",(req,res)=>{
  const js_code = req.query.code
  const data = {
    appid: "wx49d053ac8fa64ed6",
    secret: "8b5b1be01b4dabc631c271c1b6f1933e",
    js_code: js_code,
    grant_type: "authorization_code"
  };
  (async ()=>{
    try {
      const final = await fetch(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${data.appid}&secret=${data.secret}&js_code=${data.js_code}&grant_type=${data.grant_type}`, 
      {
        method: "GET",
      }
      )
      const key = await final.json();
      req.session.session_key = key.session_key
      req.session.openid = key.openid      
      res.send({msg:"凭证验证成功"})
    }catch(e) {
      console.log(e);
      res.statusCode = 402
      res.send({
        errMsg: "服务器异常"
      })
    }
  })();
})

router.get("/loginInspect",(req,res)=>{
  if(req.session.session_key && req.session.openid) {
    res.send({
      msg: "ok"
    })
  }
  else {
    res.statusCode = 302
    res.send({
      errMsg: "登陆认证已过期"
    })
  }
})

module.exports = router