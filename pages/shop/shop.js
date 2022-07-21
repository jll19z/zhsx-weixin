import { request } from "../../utils/request";
Page({
  data: {
      tabs: [{tabTypename: "鲜冰淇淋",tabType:"a",tabImg:"../image/12.png"},
          {tabTypename: "真鲜果茶",tabType:"b",tabImg:"../image/12.png"},
          {tabTypename: "醇香奶茶",tabType:"c",tabImg:"../image/12.png"},
          {tabTypename: "小小零食",tabType:"d",tabImg:"../image/12.png"},
      ],
      tabsList: [{
            quantity:0,productPrice: 10.1,productPriceNow: 9.90,productImg:"../image/cai.png", tabType:"a", productId: 0, productName: "皇家烩四宝套餐"
          },
          {
            quantity:0,productPrice: 10.4,productPriceNow: 10.0,productImg:"../image/cai.png", tabType:"b", productId: 3, productName: "皇家烩四宝套餐"
          },
          {
            quantity:0,productPrice: 10.7, productPriceNow: 10.0,productImg:"../image/cai.png",tabType:"c", productId: 6, productName: "皇家烩四宝套餐"
          },
          {
            quantity:0,productPrice: 11.0,productPriceNow: 10.0,productImg:"../image/cai.png", tabType:"d", productId: 9, productName: "皇家烩四宝套餐"
          }, {
            quantity:0,productPrice: 11.1,productPriceNow: 10.0,productImg:"../image/cai.png", tabType:"d", productId: 10, productName: "皇家烩四宝套餐"
          }
          , {
              quantity:0,productPrice: 11.1,productPriceNow: 10.0,productImg:"../image/cai.png", tabType:"d", productId: 11, productName: "皇家烩四宝套餐"
            }
            , {
              quantity:0,productPrice: 11.1,productPriceNow: 10.0,productImg:"../image/cai.png", tabType:"d", productId: 12, productName: "皇家烩四宝套餐"
            }
            , {
              quantity:0,productPrice: 11.1,productPriceNow: 10.0,productImg:"../image/cai.png", tabType:"d", productId: 13, productName: "皇家烩四宝套餐"
            }],
      indexId: 0,
      toTitle: "title-0",
      scrollTop: 0,
      top: [],
      totalPrice: 0, //选中商品总价格
      totalNum: 0, //选中商品数量
      cartList: [], //选中商品列表
      // 购物车动画
      animationData: {},
      animationMask: {},
      maskVisual: "hidden",
      maskFlag: true,
  },
  // 左侧点击事件
  jumpIndex(e) {
      let index = e.currentTarget.dataset.menuindex;
     // console.log(e.currentTarget.dataset)
      let tabType = e.currentTarget.dataset.tabtype;
     // console.log(tabType)
      let that = this
      that.setData({
          indexId: index,
          toTitle: "title-" + tabType
      });

      //console.log(this.data.toTitle)
  },
  scrollToLeft(res) {
      // console.log("scrollToLeft-res:" + JSON.stringify(res) + JSON.stringify(this.data.top));
      this.setData({
          scrollTop: res.detail.scrollTop
      })
      var length = this.data.top.length;
      for (var i = 0; i < this.data.top.length; i++) {
          if (this.data.top[i] - this.data.top[0] <= this.data.scrollTop && (i < length - 1 && this.data.top[i + 1] - this.data.top[0] > this.data.scrollTop)) {
              if (this.data.indexId != i) {
                  this.setData({
                      indexId: i,
                  });
              }
          }
      }
  },
    //搜索菜品
    Search(e){
        var searchkey=e.detail.value;

        console.log(searchkey);
        request({
          url:'/zhsx/product-info/search',
          method:'POST',
          data:{
            productName:searchkey
          }
        }).then(res=>{
          console.log(res.data.list)
          this.setData({
            tabsList:res.data.list
          })
        })
    },
  getList(){
    request({
      url:'/zhsx/product-info',
      method:'GET'
    }).then(res=>{
      console.log(res)
      this.setData({
        tabsList:res.data.productlist
      })
    })
    request({
      url:'/zhsx/product-tab',
      method:'GET'
    }).then(res=>{
      console.log(res)
      this.setData({
        tabs:res.data.tablist
      })
    })
  },
  onLoad: function (options) {
      this.getList()
      var that = this;
      wx.showLoading({
          mask: true,
          title: '加载中…',
      })

      wx.hideLoading()
      //设置高度，左右滚动
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            winHeight: res.windowHeight - 100
          });
          var top2 = new Array();
          for (var i = 0; i < that.data.tabs.length; i++) {
            wx.createSelectorQuery().select('#view-' + that.data.tabs[i].tabType).boundingClientRect(function (rect) {
              var isTop = Number(rect.top);
              top2.push(isTop);
              console.log("view-c:" + JSON.stringify(rect));
            }).exec();
          }
          that.setData({
            top: top2
          });
        }
      });
  },
  onShow: function (options) {
      var that = this;
      // 获取购物车缓存数据
      var arr = wx.getStorageSync('cart') || [];
      // 进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
      if (arr.length > 0) {
          for (var i in arr) {
              for (var j in that.data.tabsList) {
                  if (that.data.tabsList[j].productId == arr[i].productId) {
                      that.data.tabsList[j].quantity = arr[i].quantity;
                      break
                  } 
                  // else {
                  //     that.data.tabsList[j].quantity = 0;
                  // }
              }
          }
      } else {
          for (var j in that.data.tabsList) {
              that.data.tabsList[j].quantity = 0;
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
          tabsList: that.data.tabsList,
          totalPrice: totalPrice.toFixed(2),
          totalNum: totalNum
      })
  },
  // 购物车增加数量
  addCart(e) {
      var id = e.currentTarget.dataset.id;
      var arr = wx.getStorageSync('cart') || [];
      var f = false;
      for (var i in this.data.tabsList) { // 遍历菜单找到被点击的菜品，数量加1
          if (this.data.tabsList[i].productId == id) {
              this.data.tabsList[i].quantity += 1;
              if (arr.length > 0) {
                  for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
                      if (arr[j].productId == id) {
                          arr[j].quantity += 1;
                          f = true;
                          try {
                              wx.setStorageSync('cart', arr)
                          } catch (e) {
                              console.log(e)
                          }
                          break;
                      }
                  }
                  if (!f) {
                      arr.push(this.data.tabsList[i]);
                  }
              } else {
                  arr.push(this.data.tabsList[i]);
              }
              try {
                  wx.setStorageSync('cart', arr)
              } catch (e) {
                  console.log(e)
              }
              break;
          }
      }
      this.setData({
          cartList: arr,
          tabsList: this.data.tabsList
      })
      this.getTotalPrice();
  },
  // 购物车减少数量
  delCart(e){
      var id = e.currentTarget.dataset.id;
      var arr = wx.getStorageSync('cart') || [];
      for (var i in this.data.tabsList) {
          if (this.data.tabsList[i].productId == id) {
              this.data.tabsList[i].quantity -= 1;
              if (this.data.tabsList[i].quantity <= 0) {
                  this.data.tabsList[i].quantity = 0;
              }
              if (arr.length > 0) {
                  for (var j in arr) {
                      if (arr[j].productId == id) {
                          arr[j].quantity -= 1;
                          if (arr[j].quantity <= 0) {
                              this.removeByValue(arr, id) 
                          }
                          if (arr.length <= 0) {
                              this.setData({
                                  tabsList: this.data.tabsList,
                                  cartList: [],
                                  totalNum: 0,
                                  totalPrice: 0,
                              })
                              this.cascadeDismiss()
                          }
                          try {
                              wx.setStorageSync('cart', arr)
                          } catch (e) {
                              console.log(e)
                          }
                      }
                  }
              }
          }
      }
      this.setData({
          cartList: arr,
          tabsList: this.data.tabsList
      })
      this.getTotalPrice();
  },
  //定义根据id删除数组的方法
  removeByValue(array, val) {
      for (var i = 0; i < array.length; i++) {
          if (array[i].f_Cooks_Id == val) {
              array.splice(i, 1);
              break;
          }
      }
  },
  // 获取购物车总价、总数
  getTotalPrice() {
      var cartList = this.data.cartList; // 获取购物车列表
      var totalP = 0;
      var totalN = 0
      for (var i in cartList) { // 循环列表得到每个数据
          totalP += cartList[i].quantity * cartList[i].productPriceNow; // 所有价格加起来     
          totalN += cartList[i].quantity
      }
      this.setData({ // 最后赋值到data中渲染到页面
          cartList: cartList,
          totalNum: totalN,
          totalPrice: totalP.toFixed(2)
      });
  },
  // 清空购物车
  cleanList(e) {
      for (var t in this.data.tabs) {
          for (var j in this.data.tabsList) {
              this.data.tabsList[j].quantity = 0;
          }
      }
      try {
          wx.setStorageSync('cart', "")
      } catch (e) {
          console.log(e)
      }
      this.setData({
          tabsList: this.data.tabsList,
          cartList: [],
          cartFlag: false,
          totalNum: 0,
          totalPrice: 0,
      })
      this.cascadeDismiss()
  },
  //删除购物车单项
  deleteOne(e){
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      var arr = wx.getStorageSync('cart')
      for (var i in this.data.tabsList) {
          if (this.data.tabsList[i].productId == id) {
              this.data.tabsList[i].quantity = 0;
          }
      }
      arr.splice(index, 1);
      if (arr.length <= 0) {
          this.setData({
              tabsList: this.data.tabsList,
              cartList: [],
              cartFlag: false,
              totalNum: 0,
              totalPrice: 0,
          })
          this.cascadeDismiss()
      }
      try {
          wx.setStorageSync('cart', arr)
      } catch (e) {
          console.log(e)
      }
      this.setData({
          cartList: arr,
          tabsList: this.data.tabsList
      })
      this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle() {
      var that = this;
      if (that.data.maskVisual == "hidden") {
          that.cascadePopup()
      } else {
          that.cascadeDismiss()
      }
  },
  // 打开购物车方法
  cascadePopup() {
      var that = this;
      // 购物车打开动画
      var animation = wx.createAnimation({
          duration: 200,
          timingFunction: 'ease-in-out',
          delay: 0
      });
      that.animation = animation;
      animation.translate(0, -285).step();
      that.setData({
          animationData: that.animation.export(),
      });
      // 遮罩渐变动画
      var animationMask = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear',
      });
      that.animationMask = animationMask;
      animationMask.opacity(0.8).step();
      that.setData({
          animationMask: that.animationMask.export(),
          maskVisual: "show",
          maskFlag: false,
      });
  },
  // 关闭购物车方法
  cascadeDismiss() {
      var that = this
      // 购物车关闭动画
      that.animation.translate(0, 285).step();
      that.setData({
          animationData: that.animation.export()
      });
      // 遮罩渐变动画
      that.animationMask.opacity(0).step();
      that.setData({
          animationMask: that.animationMask.export(),
      });
      // 隐藏遮罩层
      that.setData({
          maskVisual: "hidden",
          maskFlag: true
      });
  },
  // 提交订单
  gotoOrder() {
      
      wx.navigateTo({
          url: '../order/order'
      })
  },


})
