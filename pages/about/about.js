// pages/about/about.js
import { request } from '../../utils/request'
Page({
  data: {
    userInfo: { },
    hasUserInfo: false,
  },
  onLoad(options) {
  this.userData()

  },
  userData(){
    this.setData({
      userInfo:wx.getStorageSync('userInfo')
    })
  },
  getUserProfile(e){
    
    const that = this;
    console.log("getUserProfile方法");
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
       // console.log("---------------------")
        console.log(res)
        wx.setStorageSync('userInfo', res.userInfo)
        this.onLoad()
        this.userSaveOrUpdate()
        //console.log("---------------------")
      }
    });

    wx.login({
      success (res) {
        console.log("code:"+res.code);
        if (res.code) {
          //发起网络请求
          request({
            url:'/login/wx',
            method:'POST',
            data:{
              code: res.code
            }
          }).then(res=>{
            console.log(res)
            // console.log(JSON.parse(res.data.key).openid)
            let openid=JSON.parse(res.data.key).openid
            wx.setStorageSync('openid', openid)
            wx.setStorageSync('token', res.data.token)
            
          })
         
          // wx.request({
          //   url: 'http://localhost:9090/login/wx',
          //   method:"POST",
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
      that.onLoad()

    //that.userSaveOrUpdate()
  },
  userSaveOrUpdate(){
    console.log(wx.getStorageSync('userInfo').nickName)
    request({
      url:'/zhsx/user/login',
      method:'POST',
      data:{
        username:wx.getStorageSync('userInfo').nickName,
        password:'',
        avatar:wx.getStorageSync('userInfo').avatarUrl,
        openid:wx.getStorageSync('openid')
      }
    }).then(res=>{
     // console.log(res.data.userid)
      wx.setStorageSync('userid', res.data.userid)
    })
  },
  loginout(){
    wx.clearStorageSync();  // 清除所有的key
    this.setData({
      userInfo:''
    })
  },
  orderGo(){
    wx.switchTab({
      url: '/pages/orderInfo/orderInfo'
    })
  },
  addressGo(){
    wx.navigateTo({
      url: '/pages/userInfo/Userinfo',
    })
  },
  xxgo(){
    wx.showModal({
      title: '提示',
      content: '本店老板黄明洋',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
    
  }
})

