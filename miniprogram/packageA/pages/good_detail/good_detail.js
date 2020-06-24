// miniprogram/packageA/pages/good_detail/good_detail.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    console.log("id is" + query.id)
    this.setData({
      id: query.id,
      item: {}
    })
    this.onShow(query.id)
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
  onShow(id){
    this.setData({
      item: {},
    })
    wx.cloud.callFunction({
      name: 'query_onegood',
      data: {
        id:id
      },
      complete: res => {
        console.log('onshow this is result: ', res)
        this.data.item = {
          goodsname: res.result.data[0].goodsname,
          intro: res.result.data[0].intro,
          img: res.result.data[0].fileIDs[0],
          status: "上架中",
          price: res.result.data[0].price,
          id: res.result.data[0]._id,
          imgs: res.result.data[0].fileIDs
        }
        this.setData({
          item: this.data.item
        });
        console.log(this.data.item)
      }
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

  }
})