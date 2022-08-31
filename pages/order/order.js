import {
  request
} from "../../utils/request"

// pages/order/order.js
Page({
  data: {
    indexId: 0,
    toTitle: "title-0",
    scrollTop: 0,
    top: [],
    totalPrice: 0, //选中商品总价格
    totalNum: 0, //选中商品数量

    orderCode: ''
  },

  onLoad(options) {
    this.getList()
    this.getCartData()
  },

  getList() {
    let tabsList = wx.getStorageSync('cart')
    this.setData({
      tabsList
    })
    console.log(tabsList)
  },
  getCartData() {
    var arr = wx.getStorageSync('cart') || [];
    // 进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
    if (arr.length > 0) {
      for (var i in arr) {
        for (var j in this.data.tabsList) {
          if (this.data.tabsList[j].productId == arr[i].productId) {
            this.data.tabsList[j].quantity = arr[i].quantity;
            break
          }
          // else {
          //     that.data.tabsList[j].quantity = 0;
          // }
        }
      }
    } else {
      for (var j in this.data.tabsList) {
        this.data.tabsList[j].quantity = 0;
      }
    }
    // 进入页面计算购物车总价、总数
    var totalPrice = 0;
    var totalNum = 0;
    if (arr.length > 0) {
      for (var i in arr) {
        totalPrice += arr[i].productPriceNow * arr[i].quantity;
        totalNum += Number(arr[i].quantity);
      }
    }
    //赋值数据
    this.setData({
      cartList: arr,
      tabsList: this.data.tabsList,
      totalPrice: totalPrice.toFixed(2),
      totalNum: totalNum
    })
  },
  OrderOk() {
    let address = wx.getStorageSync('address')

    if (address != '') {
      this.addOrder()
    } else {
      wx.showModal({
        title: '提示',
        content: '请设置地址',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/userInfo/Userinfo',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  gotoOrder() {
    wx.switchTab({
      url: '/pages/orderInfo/orderInfo'
    })
  },

  addOrder() {
    request({
      url: '/zhsx/order-master/save',
      method: 'POST',
      data: {
        userId: wx.getStorageSync('userid'),
        buyerName: wx.getStorageSync('userInfo').nickName,
        buyerPhone: wx.getStorageSync('Phone'),
        buyerAddress: wx.getStorageSync('address'),
        buyerOpenid: wx.getStorageSync('openid'),
        orderBuynum: this.data.totalNum,
        orderAmount: this.data.totalPrice
      }
    }).then(res => {
      console.log(res.data.orderNo)
      this.addOrderDetial(res.data.orderNo)
      this.gotoOrder()
      wx.setStorageSync('cart', )
    })
  },
  addOrderDetial(orderNo) {
    var list = wx.getStorageSync('cart')
    for (var i = 0; i < list.length; i++) {
      request({
        url: '/zhsx/order-detail/save',
        method: 'POST',
        data: {
          orderNo: orderNo,
          productId: list[i].productId,
          productName: list[i].productName,
          productPrice: list[i].productPrice,
          productQuantity: list[i].quantity,
          productImg: list[i].productImg
        }
      }).then(res => {
        console.log(res)
      })
    }
  }



})