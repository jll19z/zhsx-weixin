import { request } from "../../utils/request"
// pages/orderInfo/orderInfo.js
Page({
  data: {
    orderList:{}
  },
  onShow(){
    console.log("onShow")
    setTimeout(()=>{
      var i = 0;
      if(i<3){
        this.getDetail();
      }
  
  },1000)
},
onLoad(){
    console.log("onload")
  this.getDetail()
  },
getDetail(){
  request({
    url:`/zhsx/order-master/detail/`+wx.getStorageSync('userid'),
    method:'GET',
  }).then(res=>{
    console.log(res)
    this.setData({
      orderList:res.data.orderlist
    })
  })

},
updateStatus(id){
  request({
    url:'/zhsx/order-master/updateById',
    method:"POST",
    data:{
      orderId:id,
      payStatus:1
    }
  }).then(res=>{
    console.log(res)
    this.onLoad()
  })
},
goPay(e){
  console.log(e.currentTarget.dataset.id)
  const that = this;
  wx.showModal({
    title: '支付提示',
    content: '模拟支付',
    success (res) {
      if (res.confirm) {
        that.updateStatus(e.currentTarget.dataset.id);
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  }) 
},
deleteOr(e){
  console.log(e.currentTarget.dataset.id)
  const no = e.currentTarget.dataset.id
  const that =this
  wx.showModal({
    title: '提示',
    content: '确认删除订单吗',
    success (res) {
      if (res.confirm) {
        that.deleteOrder(no)
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
  // /zhsx/order-master/delete/${orderNo}

},
deleteOrder(no){
  request({
    url:`/zhsx/order-master/delete/${no}`,
    method:"DELETE"
  }).then(res=>{
    console.log(res)
    this.onLoad()
  })

},

})