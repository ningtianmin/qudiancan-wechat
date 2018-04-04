Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '订单详情'
        })
        this.setData({
            order: wx.getStorageSync('order')
        })
    },
    onshow: function () {
        this.setData({
            order: wx.getStorageSync('order')
        })
    }
})