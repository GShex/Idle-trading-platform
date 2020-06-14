// miniprogram/pages/goodsManage/modify/modify.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    goodsname:"",
    price:0,
    intro:"",
    detail:"",
    array:['书籍','电子产品','食品','服装'],
    index :0,
    onshelf: false,
    tempImg: [],
    fileIDs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id,
      
    })
    that.getForm()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getForm:function(){
   
    db.collection('goods').doc(this.data.id)
    .get().then(res => {
      console.log(res.data)
      this.setData({
        goodsname:res.data.goodsname,
        price:res.data.price,
        intro:res.data.intro,
        detail:res.data.detail,
        index: res.data.type,
        fileIDs:res.data.fileIDs
      })
    })
    
    
  },
  setForm:function(e){
    var formdata = e.detail.value;
    var getdata = this;
    if(formdata.goodsname=="")
    {
      formdata.goodsname = this.data.goodsname
    }
    if(formdata.price=="")
    {
      formdata.price = this.data.price
    }
    if(formdata.detail=="")
    {
      formdata.detail = this.data.detail
    }
    if(formdata.intro=="")
    {
      formdata.intro = this.data.intro
    }
    console.log(formdata)
    wx.showLoading({
      title: '修改中',
    })
    const promiseArr = []
    
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.tempImg.length;i++) {
      let filePath = this.data.tempImg[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove,reject)=>{
        wx.cloud.uploadFile({
          cloudPath: "img/"+new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res=>{
      
      this.setData(
        {
          goodsname:formdata.goodsname,
          price:formdata.price,
          intro:formdata.intro,
          detail:formdata.detail,
          onshelf:true,
          fileIDs: this.data.fileIDs
        }
      )
      db.collection("goods").doc(this.data.id).update({
        data:{
          userid:app.globalData.userId,
          goodsname:getdata.data.goodsname,
          price:getdata.data.price,
          intro:getdata.data.intro,
          detail:getdata.data.detail,
          type:getdata.data.index,
          status:getdata.data.onshelf,
          fileIDs:getdata.data.fileIDs
        }
    }).then(res => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
      }).catch(res=>{
        console.log("添加失败",res)
      })

        
    })
    
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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