const app = getApp();
const db = wx.cloud.database();
Page({

  data: {
  
  items: [],
  
  startX: 0, //开始坐标
  
  startY: 0,
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
  
  onLoad: function (e) {
    //this.fetchGoodsList(e)
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
    wx.cloud.callFunction({
      name: 'query_mygoods',
      data: {
        userid:app.globalData.userId
      },
      complete: res => {
       console.log(app.globalData.userId)
       console.log('this is result: ', res)
        for (var i = 0; i < res.result.data.length; i++) {
          var state = "上架中"
          if(res.result.data[i].status != true)
          {
            //state = "已下架"
            continue
          }
          this.data.items.push({

          isTouchMove: false, //默认隐藏删除
          goodsname: res.result.data[i].goodsname,
          intro: res.result.data[i].intro,
          img: res.result.data[i].fileIDs[0],
          status: state,
          id: res.result.data[i]._id
          })

          // this.setData({
          //   goodsname: res.result.data[i].goodsname

          // })
          
          }
          for (var i = 0; i < res.result.data.length; i++) {
            var state = "已下架"
            if(res.result.data[i].status == true)
            {
              continue
            }
            this.data.items.push({
  
            isTouchMove: false, //默认隐藏删除
            goodsname: res.result.data[i].goodsname,
            intro: res.result.data[i].intro,
            img: res.result.data[i].fileIDs[0],
            status: state,
            id: res.result.data[i]._id
            })
            
            // this.setData({
            //   goodsname: res.result.data[i].goodsname
  
            // })
            
            }
          
          this.setData({
          
          items: this.data.items
          
          
          });


      },
    })

  
  // for (var i = 0; i < length; i++) {
  
  // this.data.items.push({
  
  // content: i + " 向左滑动删除哦",
  // content2: i + " 向右滑动删除哦",
  // isTouchMove: false //默认隐藏删除
  
  // })
  
  // }
  
  // this.setData({
  
  // items: this.data.items
  
  // });
  
  },
  // fetchGoodsList(e){
  //   this.loading = true
  //   wx.cloud.callFunction({
  //     name: 'query_mygoods',
  //     data: {
  //       userid:app.globalData.userId
  //     },
  //     complete: res => {
  //      console.log(app.globalData.userId)
  //      console.log('this is result: ', res)
  //       for (var i = 0; i < res.result.data.length; i++) {
  //         var state = "上架中"
  //         if(res.result.data[i].status != true)
  //         {
  //           //state = "已下架"
  //           continue
  //         }
  //         this.data.items.push({

  //         isTouchMove: false, //默认隐藏删除
  //         goodsname: res.result.data[i].goodsname,
  //         intro: res.result.data[i].intro,
  //         img: res.result.data[i].fileIDs[0],
  //         status: state,
  //         })

  //         // this.setData({
  //         //   goodsname: res.result.data[i].goodsname

  //         // })
          
  //         }
  //         for (var i = 0; i < res.result.data.length; i++) {
  //           var state = "已下架"
  //           if(res.result.data[i].status == true)
  //           {
  //             continue
  //           }
  //           this.data.items.push({
  
  //           isTouchMove: false, //默认隐藏删除
  //           goodsname: res.result.data[i].goodsname,
  //           intro: res.result.data[i].intro,
  //           img: res.result.data[i].fileIDs[0],
  //           status: state,
  //           })
            
  //           // this.setData({
  //           //   goodsname: res.result.data[i].goodsname
  
  //           // })
            
  //           }
  //         this.loading = false
  //         this.setData({
          
  //         items: this.data.items
          
          
  //         });


  //     },
  //   })


  
  // // for (var i = 0; i < length; i++) {
  
  // // this.data.items.push({
  
  // // content: i + " 向左滑动删除哦",
  // // content2: i + " 向右滑动删除哦",
  // // isTouchMove: false //默认隐藏删除
  
  // // })
  
  // // }
  
  // // this.setData({
  
  // // items: this.data.items
  
  // // });
  // },
  // onShow:function(e){
  //   wx.cloud.callFunction({
  //     name: 'query_mygoods',
  //     data: {
  //       userid:app.globalData.userId
  //     },
  //     complete: res => {
  //      console.log(app.globalData.userId)
  //      console.log('this is result: ', res)
  //       for (var i = 0; i < res.result.data.length; i++) {
  //         var state = "上架中"
  //         if(res.result.data[i].status != true)
  //         {
  //           //state = "已下架"
  //           continue
  //         }
  //         this.data.items.push({

  //         isTouchMove: false, //默认隐藏删除
  //         goodsname: res.result.data[i].goodsname,
  //         intro: res.result.data[i].intro,
  //         img: res.result.data[i].fileIDs[0],
  //         status: state,
  //         })

  //         // this.setData({
  //         //   goodsname: res.result.data[i].goodsname

  //         // })
          
  //         }
  //         for (var i = 0; i < res.result.data.length; i++) {
  //           var state = "已下架"
  //           if(res.result.data[i].status == true)
  //           {
  //             continue
  //           }
  //           this.data.items.push({
  
  //           isTouchMove: false, //默认隐藏删除
  //           goodsname: res.result.data[i].goodsname,
  //           intro: res.result.data[i].intro,
  //           img: res.result.data[i].fileIDs[0],
  //           status: state,
  //           })
            
  //           // this.setData({
  //           //   goodsname: res.result.data[i].goodsname
  
  //           // })
            
  //           }
          
  //         this.setData({
          
  //         items: this.data.items
          
          
  //         });


  //     },
  //   })
  
  // // for (var i = 0; i < length; i++) {
  
  // // this.data.items.push({
  
  // // content: i + " 向左滑动删除哦",
  // // content2: i + " 向右滑动删除哦",
  // // isTouchMove: false //默认隐藏删除
  
  // // })
  
  // // }
  
  // // this.setData({
  
  // // items: this.data.items
  
  // // });
  // },
  onPullDownRefresh(e) {
    // 上拉刷新
    this.setData({
          
      items: []
      
      
      });
    this.onLoad(); //重新加载onLoad()
    
  },
  //手指触摸动作开始 记录起点X坐标
  
  touchstart: function (e) {
  
  //开始触摸时 重置所有删除
  
  this.data.items.forEach(function (v, i) {
  
  if (v.isTouchMove)//只操作为true的
  
  v.isTouchMove = false;
  
  })
  
  this.setData({
  
  startX: e.changedTouches[0].clientX,
  
  startY: e.changedTouches[0].clientY,
  
  items: this.data.items
  
  })
  
  },
  
  //滑动事件处理
  
  touchmove: function (e) {
  
  var that = this,
  
  index = e.currentTarget.dataset.index,//当前索引
  
  startX = that.data.startX,//开始X坐标
  
  startY = that.data.startY,//开始Y坐标
  
  touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
  
  touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
  
  //获取滑动角度
  
  angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  
  that.data.items.forEach(function (v, i) {
  
  v.isTouchMove = false
  
  //滑动超过30度角 return
  
  if (Math.abs(angle) > 30) return;
  
  if (i == index) {
  
  if (touchMoveX > startX) //右滑
  
  v.isTouchMove = false
  
  else //左滑
  
  v.isTouchMove = true
  
  }
  
  })
  
  //更新数据
  
  that.setData({
  
  items: that.data.items
  
  })
  
  },
  
  /**
  
  * 计算滑动角度
  
  * @param {Object} start 起点坐标
  
  * @param {Object} end 终点坐标
  
  */
  
  angle: function (start, end) {
  
  var _X = end.X - start.X,
  
  _Y = end.Y - start.Y
  
  //返回角度 /Math.atan()返回数字的反正切值
  
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  
  },
  
  //删除事件
  
  del: function (e) {
  
    var i = e.currentTarget.dataset.index
  
    db.collection('goods').doc(this.data.items[i].id).remove().then(res=>{
      console.log(i)
    })
   this.data.items.splice(i, 1)
   this.setData({
  
    items: this.data.items
  
   })
  
  },
  onshelf: function (e) {
    
    var i = e.currentTarget.dataset.index
    db.collection('goods').doc(this.data.items[i].id).update({
  		data:{
  			status:true,
    	}
   	}).then(res=>{
    	console.log(i)
   	})
     this.setData({
  
      items: []
      
      })
      this.onLoad()
    
    },
  offshelf: function (e) {
  
    var i = e.currentTarget.dataset.index
    db.collection('goods').doc(this.data.items[i].id).update({
      data:{
        status:false,
      }
      }).then(res=>{
      console.log(i)
      })
      this.setData({
  
      items: []
      
      })
      this.onLoad()
    
    },
  
  })




  // name: 'get2setUserInfo',
  // data: {
  //   getSelf: true
  // },
  // success: res => {
  //   if (res.errMsg == "cloud.callFunction:ok")
  //     if (res.result) {
  //       //如果成功获取到
  //       //将获取到的用户资料写入app.js全局变量
  //       console.log(res)
  //       app.globalData.logined = true
  //       app.globalData.userInfo = res.result.data.userData
  //       app.globalData.userId = res.result.data._id
  //       wx.switchTab({
  //         url: '/pages/index/index'
  //       })