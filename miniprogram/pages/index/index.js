//index.js
//获取应用实例
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    items: [],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //搜索框内容
    inputVal: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      items: [],
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onPullDownRefresh(e) {
    // 上拉刷新
    this.setData({
      items: []
      });
    this.onShow(); //重新加载onLoad()
  },
  onShow(){
    this.setData({
      items: [],
    })
    wx.cloud.callFunction({
      name: 'query_anygoods',
      complete: res => {
        console.log('onshow this is result: ', res)
        for(var i = 0;i < res.result.data.length;i++){
            this.data.items.push({
              goodsname: res.result.data[i].goodsname,
              intro: res.result.data[i].intro,
              img: res.result.data[i].fileIDs[0],
              status: "上架中",
              price: res.result.data[i].price,
              id: res.result.data[i]._id
            })
        }
        this.setData({
          items: this.data.items
        });
      }
    })
  // },
  // toDetailsTap: function(e) {
  //   wx.navigateTo({
  //     url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
  //   })
  },
  bindinput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  goSearch(){
    console.log(this.data.inputVal,'gosearch')
    wx.navigateTo({
      // url: '/pages/goods/list?name=' + this.data.inputVal,
      url: '../../packageA/pages/searchResult/searchResult?key=' + this.data.inputVal,
    })
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail.value
    })
    console.log(this.data.inputVal,'confirm')
    wx.navigateTo({
      url: '../../packageA/pages/searchResult/searchResult?key=' + this.data.inputVal,
    })
  }
})
