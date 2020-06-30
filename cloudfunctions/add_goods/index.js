// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  if (event.add == true) {
    try {
      return await db.collection('goods').add({
        data: {
          goodsname: event.FormData.goodsname,
          intro:event.FormData.intro,
          detail:event.FormData.detail,
          price:event.FormData.price,
          sendTimeTS:event.sendTimeTS,
          fileIDs: event.fileIDs,
          userid: event.userid,
          userInfo:event.userinfo,
          status:true,
          type:event.FormData.goodType
        }
      })
    } catch (e) {
      console.error(e)//输出错误信息
    }
  }else if(event.modify == true){
    
    try {
      return await db.collection('goods').where({
        userid: event.userid,
        _id: event.goodsid,
      }).update({
        data: {
          goodsname: event.FormData.goodsname,
          intro:event.FormData.intro,
          detail:event.FormData.detail,
          price:event.FormData.price,
          sendTimeTS:event.sendTimeTS,
          fileIDs: event.fileIDs,
          userid: event.userid,
          userInfo:event.userinfo,
          status:true,
        },
      })
    } catch (e) {
      console.error(e)//输出错误信息
    }
  }else if(event.offshelf == true){
    return await db.collection('goods').where({
      userid: event.userid,
      _id: event.goodsid,
    }).update({
      data:{
        status:false,
      }
      }).then(res=>{
      console.log(res)
      })
      
  }else if(event.onshelf == true){
    return await db.collection('goods').where({
      userid: event.userid,
      _id: event.goodsid,
    }).update({
      data:{
        status:true,
      }
      }).then(res=>{
      console.log(res)
      })
      
  }else if(event.del == true){
    return await db.collection('goods').where({
      userid: event.userid,
      _id: event.goodsid,
    }).remove().then(res=>{
      console.log(res)
      })
      
  }
  
}