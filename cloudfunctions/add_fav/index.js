// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  return await db.collection('favorate').add({
    data: {
      goodsid: event.goodsid,
      goodsname: event.goodsname,
      pic: event.pic,
      userid: event.userid
    }
  })
}