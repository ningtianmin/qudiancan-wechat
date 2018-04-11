// pages/order/list/list.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onShow: function () {
        var page = this
        wx.request({
            method: 'GET',
            url: app.globalData.backendUrl + '/wechat/orders/' + app.globalData.openid,
            complete: function (res) {
                console.log("listOrder response:", res)
                page.setData({
                    orderList: res.data.data
                })
            }
        })
    },
    payOrder: function (e) {
        var page = this
        console.log("payOrder event:", e)
        var orderNumber = e.currentTarget.dataset.orderNumber
        wx.request({
            method: 'POST',
            url: app.globalData.backendUrl + '/wechat/order/pay',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                "orderNumber": orderNumber
            },
            complete: function (res) {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '支付成功',
                        icon: 'none'
                    })
                    var orderList = page.data.orderList
                    for (var i = 0, iBorder = orderList.length; i < iBorder; i++) {
                        if (orderList[i].orderNumber == orderNumber) {
                            orderList[i].payStatus = 'PAID'
                            break
                        }
                    }
                    page.setData({
                        orderList: orderList
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                    })
                }
            }
        })
    },
    goOrderDetail: function (e) {
        console.log('goOrderDetail event:', e)
        wx.setStorageSync('order', e.currentTarget.dataset.order)
        wx.navigateTo({
            url: '../detail/detail',
        })
    }
})