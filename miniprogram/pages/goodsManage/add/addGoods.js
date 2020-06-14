// pages/page_02/page_02.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // submit: function () {
  //   wx.showLoading({
  //     title: '提交中',
  //   })
  //   const promiseArr = []
  //   //只能一张张上传 遍历临时的图片数组
  //   for (let i = 0; i < this.data.tempImg.length;i++) {
  //     let filePath = this.data.tempImg[i]
  //     let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
  //     //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
  //     promiseArr.push(new Promise((reslove,reject)=>{
  //       wx.cloud.uploadFile({
  //         cloudPath: new Date().getTime() + suffix,
  //         filePath: filePath, // 文件路径
  //       }).then(res => {
  //         // get resource ID
  //         console.log(res.fileID)
  //         this.setData({
  //           fileIDs: this.data.fileIDs.concat(res.fileID)
  //         })
  //         reslove()
  //       }).catch(error => {
  //         console.log(error)
  //       })
  //     }))
  //   }
  //   Promise.all(promiseArr).then(res=>{
  //     db.collection('comments').add({
  //       data: {
  //         fileIDs: this.data.fileIDs //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
  //       }
  //     })
  //       .then(res => {
  //         console.log(res)
  //         wx.hideLoading()
  //         wx.showToast({
  //           title: '提交成功',
  //         })
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       })
  //   })
  // },

  getForm:function(e){
    var formdata = e.detail.value;
    var getdata = this;
    console.log(formdata)
    wx.showLoading({
      title: '提交中',
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
      const db = wx.cloud.database();
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
      db.collection("goods").add({
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

  getData:function(e){
    var getdata = this;
    const db = wx.cloud.database();
    db.collection("goods").add({
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
    }).then(res=>{
      console.log("添加至数据库成功",res)
    }).catch(res=>{
      console.log("添加失败",res)
    })
  },
  uploadImgHandle: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempImg: tempFilePaths
        })
      }
    })
  },

  chooseGoodsType: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})





