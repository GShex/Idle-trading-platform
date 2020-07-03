// pages/notice/notice.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chaters: [],
    logined : false,
    backgroundimage:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
          
    //   chaters: [],
    //   logined : app.globalData.logined
      
    //   });
    //   wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
    //   wx.cloud.callFunction({
    //     name: 'query_chats',
    //     data: {
    //       userid:app.globalData.userId
    //     },
    //     complete: res => {
    //       console.log(app.globalData.userId)
    //       console.log('this is result: ', res)
    //       for (var i = 0; i < res.result.data.length; i++) {
    //         this.data.items.push({
  
    //           //isTouchMove: false, //默认隐藏删除
    //           chattername: res.result.data[i].chatterinfor.nickname,
    //           price: res.result.data[i].price,
    //           img: res.result.data[i].fileID,
    //           avatar:res.result.data[i].chatterinfor.avatarUrl,
    //           //tatus: state,
    //           id: res.result.data[i].chatid
    //           })
    //       }
    //       this.setData({
            
    //         chaters: this.data.chaters
            
            
    //         });

    //     },
    //   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
          
      chaters: [],
      logined : app.globalData.logined
      
      });
      wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
      wx.cloud.callFunction({
        name: 'query_chats',
        data: {
          userid:app.globalData.userId
        },
        complete: res => {
          console.log(app.globalData.userId)
          console.log('this is result: ', res)
          for (var i = 0; i < res.result.data.length; i++) {
            this.data.chaters.push({
  
              //isTouchMove: false, //默认隐藏删除
              chattername: res.result.data[i].chatterinfor.nickName,
              price: res.result.data[i].price,
              img: res.result.data[i].fileID,
              avatar:res.result.data[i].chatterinfor.avatarUrl,
              //tatus: state,
              id: res.result.data[i].chatid
              })
          }
          this.setData({
            
            chaters: this.data.chaters
            
            
            });

        },
      })
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
  chat:function(e){
    var i = e.currentTarget.dataset.index
    console.log(i)
    wx.navigateTo({
      url: '/pages/chat/chat?id=' + this.data.chaters[i].id + '&name=' + this.data.chaters[i].chattername+'&backgroundimage='+this.data.backgroundimage,
    });
  },
  goLogin:function(){
    if (!this.data.logined) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  }
})