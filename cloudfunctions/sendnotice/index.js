const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        page: 'index',
        data: {
          thing1: {
            value: event.dynamic
          },
          thing2: {
            value: event.content
          },
          thing3: {
            value: event.user
          },
          time4: {
            value: event.time
          }
        },
        templateId: 'ixr3VgGcouDzXKSctRY5bMQWLr_y1H9g7_soJFU84N0'
      })
    console.log("1111111111111111111111111111111111111111111")
    console.log(result)
    return result
  } catch (err) {
    console.log("22222222222222222222222222111111111111111111111")
    console.log(err)
    return err
  }
}