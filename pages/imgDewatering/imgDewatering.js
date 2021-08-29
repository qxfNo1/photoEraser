// pages/imgDewatering/imgDewatering.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    imgViewHeight:0,
    imageNotChoosed:true,
    tempImageSrc:'',
    originImageSrc:'',
    imgWidth:0,
    imgHeight:0,
    imgTop:0,
    imgLeft:0,
    showModal:false,
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    self.device = wx.getSystemInfoSync()
    // self.device = app.globalData.myDevice
    self.deviceRatio = self.device.windowWidth / 750
    self.imgViewHeight = self.device.windowHeight - 160 * self.deviceRatio
    self.setData({
      imgViewHeight: self.imgViewHeight,
      // tempCanvasHeight: self.imgViewHeight,
    })
    console.log(this.data.imgViewHeight)
    self.chooseOneImg(self)

  },
  chooseImg(){
    this.chooseOneImg(this)

  },
  chooseOneImg(self){
    wx.chooseImage({
      count: 1,
      // sizeType: ['original '], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        self.setData({
          imageNotChoosed: false,
          tempImageSrc: tempFilePaths[0],
          originImageSrc: tempFilePaths[0],
        })
        self.loadImgOnImage(self)
      },
      fail: function (res) {
        self.setData({
          imageNotChoosed: true
        })
      }
    })
  },
  loadImgOnImage(self){

    wx.getImageInfo({
      src: self.data.tempImageSrc,
      success: function (res) {
        self.oldScale = 1
        self.initRatio = res.height / self.imgViewHeight  //转换为了px 图片原始大小/显示大小
        if (self.initRatio < res.width / (750 * self.deviceRatio)) {
          self.initRatio = res.width / (750 * self.deviceRatio)
        }
        //图片显示大小
        self.scaleWidth = (res.width / self.initRatio)
        self.scaleHeight = (res.height / self.initRatio)
        self.initScaleWidth = self.scaleWidth
        self.initScaleHeight = self.scaleHeight
        self.startX = 750 * self.deviceRatio / 2 - self.scaleWidth / 2;
        self.startY = self.imgViewHeight / 2 - self.scaleHeight / 2;
        self.setData({
          imgWidth: self.scaleWidth,
          imgHeight: self.scaleHeight,
          imgTop: self.startY,
          imgLeft: self.startX
        })
        wx.hideLoading();
      }
    })
  },

  downloadImg(){
    wx.downloadFile({

      url: this.data.tempImageSrc, //仅为示例，并非真实的资源
  
      success: (res) => {
  
          let image = res.tempFilePath;
          console.log(res)
  
      }
  
  })
  },
// 长按保存图片
saveImg(e){
  let url = e.currentTarget.dataset.url;
  //用户需要授权
  wx.getSetting({
   success: (res) => {
    if (!res.authSetting['scope.writePhotosAlbum']) {
     wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success:()=> {
       // 同意授权
       this.saveImg1(url);
      },
      fail: (res) =>{
       console.log(res);
      }
     })
    }else{
     // 已经授权了
     this.saveImg1(url);
    }
   },
   fail: (res) =>{
    console.log(res);
   }
  })  
 },
 showModal(e){
   this.setData({
     showModal:true,
   })

 },
 handleSave(){
  let url = this.data.tempImageSrc;
  //用户需要授权
  wx.getSetting({
   success: (res) => {
    if (!res.authSetting['scope.writePhotosAlbum']) {
     wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success:()=> {
       // 同意授权
       this.saveImg1(url);
      },
      fail: (res) =>{
       console.log(res);
      }
     })
    }else{
     // 已经授权了
     this.saveImg1(url);
    }
   },
   fail: (res) =>{
    console.log(res);
   }
  })  
 },
 saveImg1(url){
  wx.getImageInfo({
   src: url,
   success:(res)=> {
    let path = res.path;
    wx.saveImageToPhotosAlbum({
     filePath:path,
     success:(res)=> { 
      console.log(res);
     },
     fail:(res)=>{
      console.log(res);
     }
    })
   },
   fail:(res)=> {
    console.log(res);
   }
  })
 },

 handleCancel(){
   this.setData({
     showModal:false
   })

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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    // let userInfo =  wx.getStorageSync('userInfo');
    // console.log(userInfo)   
   
    console.log(from);
    if(from === 'button'){
      return {
        title: '天空飘来五个字',
        // page: '/pages/video/video',
        imageUrl: this.data.tempImageSrc
      }
    }else {
      return {
        // title: `${userInfo.nickname}`,
        // page: '/pages/video/video',
        imageUrl: userInfo.avatarUrl
      }
    }
    
  }
})