// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("hello world")

  return await db.collection('goods').where({
    userid: event.userid
  })
  .get({
    success: function(res) {
      // res.data 是包含以上定义的两条记录的数组
      console.log(res.data)
    }
  })


  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}




// const cloud = require('wx-server-sdk')
// cloud.init()
// const db = cloud.database()
// const MAX_LIMIT = 100
// exports.main = async (event, context) => {
//   // 先取出集合记录总数
//   const countResult = await db.collection('todos').count()
//   const total = countResult.total
//   // 计算需分几次取
//   const batchTimes = Math.ceil(total / 100)
//   // 承载所有读操作的 promise 的数组
//   const tasks = []
//   for (let i = 0; i < batchTimes; i++) {
//     const promise = db.collection('todos').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
//     tasks.push(promise)
//   }
//   // 等待所有
//   return (await Promise.all(tasks)).reduce((acc, cur) => {
//     return {
//       data: acc.data.concat(cur.data),
//       errMsg: acc.errMsg,
//     }
//   })
// }