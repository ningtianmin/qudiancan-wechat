const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cart: [],
        sumMonney: 0,
        currentTable: {},
        tableOrder: null,
        productCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '去下单'
        })
        this.setData({
            cart: wx.getStorageSync('cart'),
            sumMonney: wx.getStorageSync('sumMonney'),
            productCount: wx.getStorageSync('productCount')
        })
    },
    onShow: function () {
        this.setData({
            cart: wx.getStorageSync('cart'),
            sumMonney: wx.getStorageSync('sumMonney'),
            productCount: wx.getStorageSync('productCount')
        })
        wx.showLoading({
            title: '努力加载中',
        })
        wx.request({
            url: app.globalData.backendUrl + "/wechat/tables/" + app.globalData.branchTableId,
            data: {
                openid: app.globalData.openid
            },
            success: res => {
                console.log(res)
                this.setData({
                    currentTable: res.data.data.table,
                    tableOrder: res.data.data.order
                })
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    },
    placeOrder: function () {
        if (this.data.cart.length == 0) {
            return
        }
        var url = ""
        if (this.data.tableOrder == null) {
            url = app.globalData.backendUrl + "/wechat/orders"
        } else {
            url = app.globalData.backendUrl + "/wechat/orders/addProducts"
        }
        var cart = this.data.cart
        var cartDataArray = new Array()
        for (var i = 0, iBorder = cart.length; i < iBorder; i++) {
            cartDataArray.push({
                productId: cart[i].productId,
                productNum: cart[i].productNum
            })
        }
        wx.showLoading({
            title: '正在下单',
        })
        wx.request({
            url: url,
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                branchId: app.globalData.branchId,
                branchTableId: app.globalData.branchTableId,
                openid: app.globalData.openid,
                note: "note",
                cartData: JSON.stringify(cartDataArray),
                orderId: this.data.tableOrder == null ? '' : this.data.tableOrder.id
            },
            success: res => {
                console.log(res)
                if (res.data.code != 1000) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                    })
                    return
                }

                wx.setStorageSync('cart', [])
                wx.setStorageSync('sumMonney', 0)
                wx.setStorageSync('productCount', 0)
                wx.setStorageSync('order', res.data.data)
                this.setData({
                    cart: [],
                    sumMonney: 0,
                    productCount: 0
                })
                wx.navigateTo({
                    url: '../detail/detail',
                })
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    }
})