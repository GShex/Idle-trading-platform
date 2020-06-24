// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router'); //云函数路由
const rq = require('request');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });
  const wxContext = cloud.getWXContext()
  app.router('openid', async (ctx) => {
    const wxContext = cloud.getWXContext()
    ctx.body = wxContext.OPENID;
  });
  app.router('HuoquFriends', async (ctx) => {

    try {
      ctx.body = await db.collection('userInchat').where({
        userId: event.userId
      }).get()
    } catch (e) {
      console.error(e)
    }
  });
  return app.serve();
}