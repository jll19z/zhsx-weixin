const baseUrl = "http://localhost:9090"

export const request = (params)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url:baseUrl+params.url,
      header: {
        // wx.getStorageSync('token') 从缓存中取出token值 
        token: wx.getStorageSync('token'),
        },
      success:(result)=>{
       // console.log(wx.getStorageSync("token"))
        resolve(result.data)
      },
      fail:(error)=>{
        reject(error)
      }
    })
  })
}