// pages/about/about.js
import { request } from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
test(){
  request({
    url:'/zhsx/banner/getAll',
    method:'GET'
  }).then(res=>{
    console.log(res)
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  this.test()
  },

  getUserProfile(e){
    console.log("getUserProfile方法");
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
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
  }


})