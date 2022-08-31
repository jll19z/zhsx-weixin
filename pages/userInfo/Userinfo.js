import { request } from "../../utils/request"

// pages/userInfo/Userinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoList:{},
    radioValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

this.getUserInfo()
  },

  getUserInfo(){
    request({url:'/zhsx/user-info',
    method:'POST',
    data:{
      openid:wx.getStorageSync('openid')
    }
  }).then(res=>{
    console.log(res.data.list)
    this.setData({
      userInfoList:res.data.list
    })
  })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      radioValue:e.detail.value
    })
  },
  infoOk(){
    //console.log(this.data.radioValue)
    request({
      url:`/zhsx/user-info/get/${this.data.radioValue}`,
      method:'GET'
    }).then(res=>{
      console.log(res.data.info)
      wx.setStorageSync('address', res.data.info.userAddress)
      wx.setStorageSync('Phone', res.data.info.userPhone)
    })
wx.navigateTo({
  url: '/pages/order/order',
})
  },
  infoAdd(){
    wx.navigateTo({
      url: '/pages/infoAdd/infoAdd',
    })
  },
  infoEdit(){
    wx.navigateTo({
      url: '/pages/infoAdd/infoAdd?id='+this.data.radioValue,
    })
  }
})