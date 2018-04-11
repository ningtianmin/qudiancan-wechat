const app=getApp()

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
    },
    goOrderList: function (e) {
        wx.switchTab({
            url: '/pages/order/list/list',
        })
    },
    payOrder: function (e) {
        var page = this
        console.log("payOrder event:", e)
        wx.request({
            method: 'POST',
            url: app.globalData.backendUrl + '/wechat/order/pay',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                "orderNumber": page.data.order.orderNumber
            },
            complete: function (res) {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '支付成功',
                        icon: 'none'
                    })
                    var order =page.data.order
                    order.payStatus='PAID'
                    page.setData({
                        order: order
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                    })
                }
            }
        })
    }
})