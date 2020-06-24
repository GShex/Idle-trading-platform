//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/static/images/my.png'
    },
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    logined: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {

  },
  onShow: function() {

    //获取用户的登录信息
    if (app.globalData.logined) {
      //let userInfo = wx.getStorageSync('userInfo');
      let userInfo = app.globalData.userInfo
      this.setData({
        userInfo: userInfo,
        logined: true
      });

      let that = this;
      // util.request(api.UserIndex).then(function(res) {
      //   if (res.errno === 0) {
      //     that.setData({
      //       order: res.data.order
      //     });
      //   }
      // });
    }

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  goLogin() {
    if (!this.data.logined) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },
  goHelp: function () {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },  
  goSold() {
    if (this.data.logined) {
      try {
        wx.setStorageSync('tab', 0);
      } catch (e) {

      }
      wx.navigateTo({
        url: "/pages/ucenter/sold/sold"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goBought() {
    if (this.data.logined) {
      try {
        wx.setStorageSync('tab', 0);
      } catch (e) {

      }
      wx.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goHistory() {
    if (this.data.logined) {
      wx.navigateTo({
        url: "/pages/groupon/myGroupon/myGroupon"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goCollect() {
    if (this.data.logined) {
      wx.navigateTo({
        url: "../../../packageA/pages/favorate/favorate"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },

}
)
