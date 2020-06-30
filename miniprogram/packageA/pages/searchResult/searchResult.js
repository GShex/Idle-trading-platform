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
    goodsname: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../../../pages/logs/logs'
    })
  },
  onLoad: function (query) {
    this.setData({
      goodsname: query.key,
      items: {}
    })
    console.log(this.data.goodsname)
    // this.onShow(query.id)
  },
  getUserInfo: function(e) {
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
      name: 'search_goods',
      data:{
        goodsname: this.data.goodsname
      },
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
  }
})
