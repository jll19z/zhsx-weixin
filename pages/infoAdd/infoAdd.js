import { request } from "../../utils/request"

Page({
  data: {
    address:'',
    phone:'',
    upId:0
  },


  bindKeyInput:function(e) {
     console.log('111111111111111111111')
     console.log(e.detail)
    this.setData({
      phone: e.detail.value
    })
  },

  bindKeyInput1(e) {
    this.setData({
      address: e.detail.value
    })
  },

  infoOK(){
    console.log(this.data.address)
    console.log(this.data.phone)
    this.saveOrUpdate()
    wx.showModal({
      title: '提示',
      content: '设置成功',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url:"/pages/userInfo/Userinfo"
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  infoAdd(){
    console.log("添加方法")
    request({
      url:'/zhsx/user-info/save',
      method:'POST',
      data:{
        openid:wx.getStorageSync('openid'),
        userAddress:this.data.address,
        userPhone:this.data.phone
      }
    }).then(res=>{
      console.log(res)
    })
  },
  infoUpdate(){
    request({
      url:'/zhsx/user-info/update',
      method:'POST',
      data:{
        id:this.data.upId,
        userAddress:this.data.address,
        userPhone:this.data.phone
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        upId:0
      })
    })
  },
  saveOrUpdate(){
 if(this.data.upId == 0){
   this.infoAdd()
 }else{
   this.infoUpdate()
 }
  },
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({

    })
      if(options.id){
        this.setData({
          upId:options.id
        })
        request({
          url:`/zhsx/user-info/get/${options.id}`,
          method:'GET'
        }).then(res=>{
          console.log(res.data.info)
          this.setData({
            address:res.data.info.userAddress,
            phone:res.data.info.userPhone
          })
        })
      }
},


})