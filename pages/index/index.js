const app = getApp()

Page({
    data: {
        imgUrls: [
            '../../images/1.png',
            '../../images/3.png',
            '../../images/4.png'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000
    },
    onLoad: function () {
        // imgUrls通过后端api获得
    },
    golist: function () {
        wx.navigateTo({
            url: '../list/list'
        })
    }
})
