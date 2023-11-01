const db = require('../utils/util')
const express = require("express")
const userLogin = require("./login")
const userModify = require("./midifyMsg")
const userGet = require("./userGet")
const vidioGet = require("./videoGet")
const vidioLike = require("./videoLike")
const videoCancle = require("./videoCancle")


const main = express()

main.use(userLogin)
main.use(userModify)
main.use(userGet)
main.use(vidioGet)
main.use(vidioLike)
main.use(videoCancle)


main.listen(4040,()=>{
  console.log("服务器已开启");
})

