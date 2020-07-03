const WXAPI = require('apifm-wxapi')
// const AUTH = require('../../utils/auth')
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
  items: [],

  index: 0
  },
  onLoad: function (options) {
    this.setData({
      items: [],
      index: 0
    })
  },
  onShow: function () {
    this.setData({
      items: []
    })
    wx.cloud.callFunction({
    name: 'getfavorate',
    data: {
      userid:app.globalData.userId
    },
    complete: res => {
      console.log("here!")
      console.log(res)
      for (var i = 0; i < res.result.data.length; i++) {
        this.data.items.push({
          goodsName: res.result.data[i].goodsname,
          goodsId: res.result.data[i].goodsid,
          pic: res.result.data[i].pic
        })
      }
      this.setData({
        items: this.data.items
      })
    },
  })
  },
  onPullDownRefresh: function () {
    this.onShow()
  },
  removeFav(e){
    var idx = e.currentTarget.dataset.index
    console.log(idx)
    console.log(this.data.items[idx].goodsName)
    wx.cloud.callFunction({
      name: 'del_fav',
      data: {
        goodsid: this.data.items[idx].goodsId,
        userid: app.globalData.userId
      },
      conmplete: res => {
        console.log('del fav res is ' + res)
      }
    })
    this.data.items.splice(idx,1)
    this.setData({
      items: this.data.items
    })
  }

})
//   async goodsFavList() {
//     // 搜索商品
//     wx.showLoading({
//       title: '加载中',
//     })
//     const _data = {
//       token: wx.getStorageSync('token'),
//       page: 1,
//       pageSize: 10000,
//     }    
//     const res = await WXAPI.goodsFavList(_data)
//     wx.hideLoading()
//     if (res.code == 0) {
//       this.setData({
//         goods: res.data,
//       })
//     } else {
//       this.setData({
//         goods: null
//       })
//     }
//   },
//   async removeFav(e){
//     const id = e.currentTarget.dataset.id
//     const res = await WXAPI.goodsFavDelete(wx.getStorageSync('token'), '', id)
//     if (res.code == 0) {
//       wx.showToast({
//         title: '取消收藏',
//         icon: 'success'
//       })
//       this.goodsFavList()
//     } else {
//       wx.showToast({
//         title: res.msg,
//         icon: 'none'
//       })
//     }
//   },
// })


// wx.cloud.callFunction({
//   name: 'query_mygoods',
//   data: {
//     userid:app.globalData.userId
//   },
  // complete: res => {
  //  console.log(app.globalData.userId)
  //  console.log('this is result: ', res)
  //   for (var i = 0; i < res.result.data.length; i++) {
  //     var state = "上架中"
  //     if(res.result.data[i].status != true)
  //     {
  //       //state = "已下架"
  //       continue
  //     }
  //     this.data.items.push({

  //     isTouchMove: false, //默认隐藏删除
  //     goodsname: res.result.data[i].goodsname,
  //     intro: res.result.data[i].intro,
  //     img: res.result.data[i].fileIDs[0],
  //     status: state,
  //     id: res.result.data[i]._id
  //     })

