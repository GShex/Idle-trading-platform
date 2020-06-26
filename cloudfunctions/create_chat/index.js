// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('userInchat').add({
    data: {
      chatid: event.chatid,
      chatterinfor: event.chatterinfor,
      fileID: event.fileID,
      price: event.price,
      useeId: event.useeId,
      userId: event.userId
    }
  })
}