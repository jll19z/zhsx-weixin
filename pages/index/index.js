import { request } from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:'',
    loginflag:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.getBanner()
    this.flagchange()
  
  },

  onRefresh(){
    //在当前页面显示导航条加载动画
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
this.flagchange()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.flagchange()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  this.onRefresh()

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

  },
  goto1(){
    wx.switchTab({
      url: '/pages/about/about'
    ,
    })
  },
  goto2(){
    wx.navigateTo({
      url: '/pages/info/info'
    ,
    })
  },
  goLogin(){
    wx.switchTab({
      url: '/pages/about/about'
    ,
    })
  },
  
  gotoShop(){
    wx.switchTab({
      url: '/pages/shop/shop'
    ,
    })
  },
  getBanner(){
    request({
      url:'/zhsx/banner/getAll',
      method:'GET'
    }).then(res=>{
      console.log(res.data)
      this.setData({
        bannerList:res.data.banner
      })
    })
  },
  flagchange(){
    if(wx.getStorageSync('token')){
      this.setData({
        loginflag:true
      })
    }else{
      this.setData({
        loginflag:false
      })
    }
    wx.hideLoading();
    //隐藏导航条加载动画
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
  },

})