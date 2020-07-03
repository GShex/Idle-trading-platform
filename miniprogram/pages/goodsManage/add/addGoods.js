// pages/entrust/entrust.js
// const {
//   formatTime
// } = require("../../../utils/utils.js")

const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 导航栏标题
      NavigationBarTitle: '发布商品',
      // 渲染输入框
      InputList: [{
          'id': 'goodsname',
          'title': '商品名称:',
          'placeholder': '请填写商品名称,最长25个字',
          'type': 'text',
          'maxlength': 50
      },
    
      {
          'id': 'price',
          'title': '商品价格(单位:元):',
          'placeholder': '请填写商品价格',
          'type': 'digit',
          'maxlength': 20
      },
      {
        'id': 'intro',
        'title': '商品简介:',
        'placeholder': '请填写商品简介',
        'type': 'text',
        'maxlength': 50
    },
      {
          'id': 'detail',
          'title': '商品详情:',
          'placeholder': '请填写商品详情',
          'type': 'text',
          'maxlength': 200
      }
      ],

      // 渲染选择器
      PickerList: [{
          'id': 'goodType',
          'title': '商品类型',
          'pickerlist': ['书籍', '电子产品', '食品','服装']
      }],

      // 房型选择列表
      // HouseStyleList: [
      //     ['0室', '1室', '2室', '3室', '4室', '5室'],
      //     ['0厅', '1厅', '2厅', '3厅'],
      //     ['0卫', '1卫', '2卫', '3卫']
      // ],
      // // 房型选择结果
      // HouseStyleSelected: [0, 0, 0],
      // // 委托类型
      // EntrustType: '',
      // 表单数据
      FormData: {
          // 商品名称
          'goodsname': '',
          // 商品价格
          'price': '',
           // 商品简介
          'intro': '',
          // 商品详情
          'detail': '',
          
          // 商品类型
          'goodType': '',
         
      },
      // 照片列表
      imgList: [],
      modalName: null,
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
      console.log('eeeee', e, e.title)
      // 修改导航栏标题
      wx.setNavigationBarTitle({
          title: e.title
      })
      // 修改导航栏样式
      wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: e.backgroundcolor,
          animation: {
              duration: 400,
              timingFunc: 'easeIn'
          }
      })
      this.setData({
          NavigationBarTitle: e.title,
          EntrustType: e.id
      })
  },

  // 获取输入框数据
  InputData: function (e) {
      console.log(e, e.currentTarget.id, e.detail.value)
      let FormData = this.data.FormData
      let id = e.currentTarget.id
      let value = e.detail.value
      FormData[id] = value
      this.setData({
          FormData
      })
  },

  // 获取单列选择器数据
  PickerData(e) {
      console.log(e, e.currentTarget.id, e.detail.value)
      let FormData = this.data.FormData
      let id = e.currentTarget.id
      let value = e.detail.value
      let list = e.currentTarget.dataset.pickerlist
      FormData[id] = list[value]
      this.setData({
          FormData
      })
  },

  // // 房型选择
  // HouseStyleChange(e) {
  //     let HouseStyleList = this.data.HouseStyleList
  //     let FormData = this.data.FormData
  //     console.log(e, e.detail.value)
  //     let value = e.detail.value
  //     let room = value[0]
  //     let hall = value[1]
  //     let toilet = value[2]

  //     console.log(room, typeof (room), hall, toilet)

  //     if (room == 0) {
  //         room = ''
  //     } else {
  //         room = HouseStyleList[0][room]
  //     }
  //     if (hall == 0) {
  //         hall = ''
  //     } else {
  //         hall = HouseStyleList[1][hall]
  //     }
  //     if (toilet == 0) {
  //         toilet = ''
  //     } else {
  //         toilet = HouseStyleList[2][toilet]
  //     }

  //     let houseStyle = `${room}${hall}${toilet}`

  //     let roomStyle = ''

  //     switch (e.detail.value[0]) {
  //         case 1:
  //             roomStyle = '一居室';
  //             break;
  //         case 2:
  //             roomStyle = '二居室';
  //             break;
  //         case 3:
  //             roomStyle = '三居室';
  //             break;
  //         case 4:
  //             roomStyle = '四居室';
  //             break;
  //         case 5:
  //             roomStyle = '五居室';
  //             break;
  //         default:
  //             roomStyle = '无'
  //     }

  //     FormData.roomStyle = roomStyle
  //     FormData.houseStyle = houseStyle

  //     this.setData({
  //         HouseStyleSelected: value,
  //         FormData
  //     })
  // },

  // 选择照片
  ChooseImage() {
      wx.chooseImage({
          count: 4, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], //从相册选择
          success: (res) => {
              if (this.data.imgList.length != 0) {
                  this.setData({
                      imgList: this.data.imgList.concat(res.tempFilePaths)
                  })
              } else {
                  this.setData({
                      imgList: res.tempFilePaths
                  })
              }
          }
      });
  },

  // 预览照片
  ViewImage(e) {
      wx.previewImage({
          urls: this.data.imgList,
          current: e.currentTarget.dataset.url
      });
  },

  // 删除照片
  DelImg(e) {
      wx.showModal({
          title: '提示',
          content: '确定要删除这张照片吗？',
          cancelText: '取消',
          confirmText: '确定',
          success: res => {
              if (res.confirm) {
                  this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                  this.setData({
                      imgList: this.data.imgList
                  })
              }
          }
      })
  },

  // 显示弹窗
  showModal(e) {
      console.log('0.showModal')
      let templeCheckbox = this.data.checkbox
      this.setData({
          templeCheckbox: templeCheckbox,
          modalName: e.currentTarget.dataset.target
      })
  },

  // 关闭弹窗
  hideModal(e) {
      // console.log('1.hideModal')
      // // let templeCheckbox = this.data.templeCheckbox
      // let Tags = this.data.Tags
      // let checkbox = this.data.checkbox
      // // 数据恢复到选择前的状态
      // this.setData({
      //     templeCheckbox: checkbox,
      //     templeTags: Tags,
      //     modalName: null
      // })
  },

  // 点击确认后保存显示confirm
  Confirm(e) {
      console.log('2.Confirm')
      let templeTags = this.data.templeTags
      let templeCheckbox = this.data.templeCheckbox
      let FormData = this.data.FormData
      //FormData.Tags = templeTags
      this.setData({
          FormData: FormData,
          checkbox: templeCheckbox,
          displayTags: templeTags.join(','),
          modalName: null
      })
  },

 

  // Tab切换
  ChangeTab(e) {
      wx.showToast({
          title: `切换为 ${e.detail.name}`,
          icon: 'none'
      });
  },

  // 提交信息前进行数据校验
  Submit(e) {
      let ImgList = this.data.imgList
      let FormData = this.data.FormData
      let InputList = this.data.InputList
      
      // 表单数据的校验
      for (let key in FormData) {
          if (FormData[key] == '') {
              wx.showToast({
                  title: '请把所有数据填写完整',
                  icon: 'none',
                  mask: true,
                  duration: 2000
              })
              return;
          }
      }

      console.log(ImgList.length)

      // 图片的校验
      // 图片为空时报错
      if (ImgList.length == 0) {
          wx.hideLoading()
          wx.showToast({
              title: '图片不能为空,最少需要一张',
              icon: 'none',
              mask: true,
              duration: 2000
          })
          return;
      }
      // 图片超过四张报错
      if (ImgList.length > 4) {
          wx.hideLoading()
          wx.showToast({
              title: '图片不能超过四张',
              icon: 'none',
              mask: true,
              duration: 2000
          })
          return;
      }

      this.setData({
          FormData: FormData
      })

      // 上传图片
      this.UploadImages()
  },


  // 上传图片
  UploadImages() {
      wx.showLoading({
          title: '保存图片...',
          mask: true
      })
      let that = this
      let imgPathList = []
      // 保存照片
      for (let i = 0; i < that.data.imgList.length; i++) {
          const fileName = that.data.imgList[i];
          const dotPosition = fileName.lastIndexOf('.');
          const extension = fileName.slice(dotPosition);
          const cloudPath = "img/"+`${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`;
          wx.cloud.uploadFile({
              cloudPath,
              filePath: fileName,
              success(res) {
                  wx.hideLoading()
                  console.log('imgs', res, imgPathList.length, that.data.imgList.length)
                  imgPathList.push(res.fileID)
                  if (imgPathList.length == that.data.imgList.length) {
                      // 保存信息
                      that.SubmitEntrust(imgPathList)
                  }
              },
              fail: err => {
                  wx.hideLoading()
                  wx.showToast({
                      title: '图片保存失败',
                      icon: "none",
                      duration: 1500
                  })
              },
              complete: res => { }
          })
      }
  },

  // 提交信息
  SubmitEntrust(photoInfo) {
      wx.showLoading({
          title: '提交商品...',
          mask: true
      })
      let FormData = this.data.FormData
      //let imgList = this.data.imgList 
      let EntrustType = this.data.EntrustType
      let that = this
      console.log("FormData",FormData)
      console.log("img",photoInfo)
      console.log("开始链接")
      wx.cloud.callFunction({
        name:'add_goods',
        data:{
          FormData:FormData,
          sendTimeTS:Date.now(),
          userid:app.globalData.userId,
          userinfo: app.globalData.userInfo,
          fileIDs:photoInfo,
          add:true
        },
        success: res => {
                  wx.hideLoading()
                  console.log(res)
                  wx.showToast({
                      title: '商品提交成功',
                      icon: 'success',
                      duration: 2000
                  })
                  // 页面跳转到成功页面
                  wx.switchTab({
                    url: '/pages/goodsManage/index/index'
                  })
              },
              fail: err => {
                  wx.hideLoading()
                  console.log(err)
                  wx.showToast({
                      title: '商品提交失败',
                      icon: 'success',
                      duration: 2000
                  })
                  
              },
              complete: res => {
                  console.log(res)
              }
      })
      // wx.cloud.callFunction({
      //     name: 'addGoods',
      //     data: {
      //         type: 'add',
      //         EntrustType: EntrustType,
      //         FormData: FormData,
      //         photoInfo: photoInfo,
      //         updateTime: Date.now()
      //     },
      //     success: res => {
      //         wx.hideLoading()
      //         console.log(res)
      //         wx.showToast({
      //             title: '委托提交成功',
      //             icon: 'success',
      //             duration: 2000
      //         })
      //         // 页面跳转到成功页面
      //         wx.redirectTo({
      //             url: '../steps/steps?id=entrust',
      //             success: function (res) { },
      //             fail: function (res) { },
      //             complete: function (res) { },
      //         })
      //     },
      //     fail: err => {
      //         wx.hideLoading()
      //         console.log(err)
      //         wx.showToast({
      //             title: '商品提交失败',
      //             icon: 'success',
      //             duration: 2000
      //         })
      //         // 把已经上传的图片删除
              
      //     },
      //     complete: res => {
      //         console.log(res)
      //     }
      // })
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