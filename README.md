# MyVideo
- 涉及技术：
  - 前端：微信开发者工具
  - 后端：Prisma + NodeJS + Express + MySQL



- 对video标签进行了封装，实现了**点赞，双击点赞，长按加速，进度条显示以及拖动进度条，分页返回数据，对滚动条进行了监听，使其能够实现视频的自动对正，防止因滚动条滚动导致用户观感变差。**



- 实现了用户登录，使用了微信官方的session_key以及openid，并将其存储在了session中，并且做了**登录失效处理**，在一定时间内用户登陆将失效，**用户端的一切操作依附于后端返回的cookie（session）。**

