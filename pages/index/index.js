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
  onShow(){
    this.flagchange()
  },
  onLoad(options) {

    this.getBanner()
    this.flagchange()
  
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  this.flagchange()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onRefresh()

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
    getApp().globalData.yjLogin=1
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
  onRefresh(){
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading(); 
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.flagchange()
  },

})