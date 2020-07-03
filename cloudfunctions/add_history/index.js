// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  if (event.update == true) {
    try {
      return await db.collection('watchedgoods').where({
        userid: event.userid,
        goodsid: event.goodsid
      }).update({
        data: {
          sendTimeTS: event.sendTimeTS
        },
      })
    } catch (e) {
      console.error(e)//输出错误信息
    }
  }else {
    try {
      return await db.collection('watchedgoods').add({
        data: {
          goodsid: event.goodsid,
          goodsname: event.goodsname,
          intro:event.intro,
          price:event.price,
          sendTimeTS:event.sendTimeTS,
          fileID: event.pic,
          userid: event.userid
        }
      })
    } catch (e) {
      console.error(e)//输出错误信息
    }

  }
  
}