const express = require("express")
const db = require("../utils/util")

const router = express.Router()
router.use(express.urlencoded({ extended: true }))

BigInt.prototype.toJSON = function() { return this.toString() };
router.post("/modify",(req,res)=>{
  res.setHeader("Access-Allow-Control-Origin","*");
  if(req.session.session_key && req.session.openid) {
    (async ()=>{
      let all = await db.tb_user.findMany({
        where: {
          phone: req.query.phoneNumber
        }
      })
      if(all.length == 0) {
        await db.tb_user.create({
          data: {
            id: new Date().getDate()+new Date().getHours()+(+req.query.phoneNumber),
            username: "在此修改名字与头像",
            phone: req.query.phoneNumber,
            password: req.query.password,
            open_id: req.session.openid,
            portrait: "https://edu.faisys.com/dist/editor/image/headDefault.4fe57e8d.png"
          }
        })

        const userMsg = db.tb_user.findMany({
          where: {
            phone: req.query.phoneNumber
          }
        })

        console.log("添加用户成功");
        res.send({
          phone: req.query.phoneNumber,
          user_id: all[0].id
        })
    }
    else if(all.length == 1) {
      if(all[0].password == req.query.password) {
        await db.tb_user.update({
          where: {
            id: all[0].id,
          },
          data: {
            open_id: req.session.openid
          }
        })
        console.log("用户登录成功");
        res.send({
          msg:"登录成功",
          user_id: all[0].id,
          portrait: all[0].portrait,
          username: all[0].username
        })
      }
      else {
        res.statusCode = 401
        res.send({
          errMsg: "该账号已经被注册，请输入正确的密码"
        })
      }
    }
  
  })();
  }
  else {
    res.statusCode = 302
    res.send({
      errMsg: "登录认证过期，请重新登录"
    })
  }


})

router.post("/modifyContent",(req,res)=>{
  res.setHeader("Access-Allow-Control-Origin","*");
  if(req.session.session_key && req.session.openid) {
      (async ()=>{
        let all = await db.tb_user.findMany({
          where: {
            phone: req.query.phoneNumber
          }
        })
        if(req.query.imageTrans) {
          await db.tb_user.update({
            where: {
              id: all[0].id,
            },
            data: {
              portrait: req.query.imageTrans,
            }
          })
          // (async ()=>{
          //   try {
          //     const initial = await fetch("http://127.0.0.1:36677/upload",{
          //       method:"POST",
          //       body: JSON.stringify({list: [req.query.imageTrans]})
          //     })
          //     if(initial.ok) {
          //       const final = await initial
          //       console.log(final);
          //     }
          //     else {
          //       throw new Error("图片转换失败")
          //     }
          //   }catch(e){
          //     console.log(e);
          //   } 
          // })()

        }
        else if(req.query.headWord) {
          await db.tb_user.update({
            where: {
              id: all[0].id,
            },
            data: {
              username: req.query.headWord,
            }
          })
        }
        console.log("修改成功");
      })()
    

    res.send({
      msg: "修改成功"
    })
  }
  else {
    res.statusCode = 302
    res.send({
      errMsg: "登录认证过期，请重新登录"
    })
  }
})

module.exports = router