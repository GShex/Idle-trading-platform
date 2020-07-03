// miniprogram/packageA/pages/good_detail/good_detail.js
const app = getApp();
const db = wx.cloud.database();
var util = require('../../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    goodsid: 0,
    show: true,
    logined: false,
    faved: false,
    watched:false,
    sellerInfo: {},
    myInfo: {},
    contactName: '联系卖家'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      goodsid: query.goodsid,
      logined: app.globalData.logined,
      item: {}
    })
    // this.onShow(query.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPullDownRefresh(e) {
    // 下拉刷新
    this.setData({
      item: {}
      });
    this.onShow(); //重新加载onLoad()
  },
  onShow(){
    // console.log("onshow hello")
    this.setData({
      item: {},
      logined: app.globalData.logined
    })
    wx.cloud.callFunction({
      name: 'query_onegood',
      data: {
        id: this.data.goodsid
      },
      complete: res => {
        // console.log('onshow this is result: ', re
        this.data.item = {
          goodsname: res.result.data[0].goodsname,
          intro: res.result.data[0].intro,
          price: res.result.data[0].price,
          goodsid: res.result.data[0]._id,
          imgs: res.result.data[0].fileIDs,
          detail: res.result.data[0].detail,
          sellerid: res.result.data[0].userid,
          sellerInfo: res.result.data[0].userInfo,
          _openid: res.result.data[0]._openid
        }
        this.setData({
          item: this.data.item
        });
        if(this.data.logined){
          // console.log(this.data.item)
          // console.log('SID',this.data.item.sellerid)
          // console.log('UID',app.globalData.userId)
          if(this.data.item.sellerid == app.globalData.userId){
            this.setData({
              contactName: '我的商品'
            })
          }
        }

        if(this.data.logined){
          if(app.globalData.userId != res.result.data[0].userid){
            wx.cloud.callFunction({
            name: 'if_watched',

            data: {
              userid: app.globalData.userId,
              goodsid: this.data.goodsid
            },
            complete: res=> {

              console.log("if watched res is ",res)

              if(res.result.total > 0){
                wx.cloud.callFunction({
                  name:'add_history',
                  data:{
                    userid: app.globalData.userId,
                    goodsid: this.data.goodsid,
                    update:true,
                    sendTimeTS:Date.now()
                  },
                  complete: res=>{
                    console.log("update time res is ",res)
                  }
                })
              }else{
                wx.cloud.callFunction({
                  name:'add_history',
                  data:{
                    userid: app.globalData.userId,
                    goodsid: this.data.goodsid,
                    update:false,
                    price:this.data.item.price,
                    goodsname:this.data.item.goodsname,
                    intro:this.data.item.intro,
                    pic:this.data.item.imgs[0],
                    sendTimeTS:Date.now()
                  },
                  complete: res=>{
                    console.log("create history res is ",res)
                  }
                })
              }
            }
          })
          }

          
        }

      }
    })
    
   
    if(this.data.logined){
      wx.cloud.callFunction({
        name: 'if_fav',
        data: {
          userid: app.globalData.userId,
          goodsid: this.data.goodsid
        },
        complete: res=> {
          console.log("if fav res is ",res)
          if(res.result.total > 0){
            this.setData({
              faved: true
            })
          }else{
            this.setData({
              faved: false
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


  },

  goLogin:function(){
    if (!this.data.logined) {
      wx.navigateTo({
        url: "../../../pages/auth/login/login"
      });
    }
  },
  fav(){
    console.log("fav invoked")
    if(!this.data.logined){
      this.goLogin()
    }else{
      console.log(this.data.item.goodsid)
      console.log(app.globalData.userId)
      if(!this.data.faved){
        this.setData({
          faved: true
        })
        console.log("add fav")
        wx.cloud.callFunction({
          name: 'add_fav',
          data: {
            goodsid: this.data.item.goodsid,
            goodsname: this.data.item.goodsname,
            pic: this.data.item.imgs[0],
            userid: app.globalData.userId
          },
          conmplete: res => {
            console.log('add fav res is ' + res)
          }
        })
      }else{
        this.setData({
          faved: false
        })
        console.log("del fav")
        wx.cloud.callFunction({
          name: 'del_fav',
          data: {
            goodsid: this.data.item.goodsid,
            userid: app.globalData.userId
          },
          conmplete: res => {
            console.log('del fav res is ' + res)
          }
        })
      }
    }
  },
  contact(){
    if(!this.data.logined){
      this.goLogin()
    }else if(this.data.item.sellerid == app.globalData.userId){
      console.log("这是我自己的商品")
    }else{
      console.log("contact 1")
      console.log(this.data.item.sellerid)
      // 检查是否已建立聊天，若无则先建立聊天
      wx.cloud.callFunction({
        name: 'if_chat',
        data: {
          chatid: app.globalData.userId + this.data.item.sellerid+this.data.item.goodsid,
          chatterinfor: this.data.item.sellerInfo,
          fileID: this.data.item.imgs[0],
          price: this.data.item.price,
          useeId: this.data.item.sellerid,
          userId: app.globalData.userId
        },
        complete: res=> {
          if(res.result.total > 0){
            console.log("聊天已存在")
          }else{
            console.log("聊天未存在")
            wx.cloud.callFunction({
              name: 'create_chat',
              data: {
                chatid: app.globalData.userId + this.data.item.sellerid+this.data.item.goodsid,
                chatterinfor: this.data.item.sellerInfo,
                fileID: this.data.item.imgs[0],
                price: this.data.item.price,
                useeId: this.data.item.sellerid,
                userId: app.globalData.userId
              },complete: res=> {
                console.log("create 1 is ",res)
              }
            })
            wx.cloud.callFunction({
              name: 'create_chat',
              data: {
                chatid: app.globalData.userId + this.data.item.sellerid+this.data.item.goodsid,
                chatterinfor: app.globalData.userInfo,
                fileID: this.data.item.imgs[0],
                price: this.data.item.price,
                useeId: app.globalData.userId,
                userId: this.data.item.sellerid
              },complete: res=> {
                console.log("create 2 is ",res)
              }
            })

            console.log("333333333333333333333333333333333333333333")
            console.log(this.data.item._openid)
            var time = util.formatTime(new Date(), 'Y/M/D h:m:s');
            wx.cloud.callFunction({
              name: 'sendnotice',
              data: {
                openid: this.data.item._openid,
                dynamic: "有人看上了你的商品哦",
                content: this.data.item.goodsname,
                user: "有人看上了你的商品哦",
                time: time
              },
              complete: res => {}
          })
          }

          wx.navigateTo({
            url: '../../../pages/chat/chat?id=' 
              + app.globalData.userId + this.data.item.sellerid
              + '&name=' + this.data.item.sellerInfo.nickName
              + '&backgroundimage=""'
          })
        }
      })
      // console.log("333333333333333333333333333333333333333333")
      // console.log(this.data.item._openid)
      // var time = util.formatTime(new Date(), 'Y/M/D h:m:s');
    //   wx.cloud.callFunction({
    //     name: 'sendnotice',
    //     data: {
    //       openid: this.data.item._openid,
    //       dynamic: "有人看上了你的商品哦",
    //       content: this.data.item.goodsname,
    //       user: "有人看上了你的商品哦",
    //       time: time
    //     },
    //     complete: res => {}
    // })

    }
  },
  getUserInfo(){

  },
  ifChatExist(){
    

  }
})


// touser: event.openid,
// page: 'index',
// data: {
//   thing1: {
//     value: event.dynamic
//   },
//   thing2: {
//     value: event.content
//   },
//   thing3: {
//     value: event.user
//   },
//   time4: {
//     value: event.time