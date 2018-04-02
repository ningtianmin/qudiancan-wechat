const app = getApp()

Page({
    data: {
        menu: [],
        cart: [],
        loading: false,
        showCart: false,
        currentCategoryIndex: 0,
        scrollTop: 0,
        toView: 'item0',
        scrollViewHeight: 1200,
        bottomHeight: 100,
        sumMonney: 0,
        itemHeight: 160,
        itemTabHeight: 40,
        scrollTopScale: 2
    },
    computeSumMonney: function () {
        var cart = this.data.cart
        var sumMonney = 0
        console.log(cart)
        for (var i = 0, iBorder = cart.length; i < iBorder; i++) {
            sumMonney += parseFloat((cart[i].sum).toFixed(2))
        }
        this.setData({
            sumMonney: sumMonney
        })
    },
    onLoad: function (options) {
        var page = this
        wx.showLoading({
            title: '努力加载中',
        })
        this.setData({
            scrollViewHeight: this.data.scrollViewHeight - this.data.bottomHeight
        })
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                page.setData({
                    topHeight: res.screenHeight - res.windowHeight
                })
            },
        })
        wx.request({
            url: app.globalData.backendUrl + "/wechat/branches/" + app.globalData.branchId + "/products",
            method: 'GET',
            success: function (res) {
                wx.hideLoading()
                console.log(res)
                page.setData({
                    menu: res.data.data,
                    loading: true
                })
            }
        })
        wx.request({
            url: app.globalData.backendUrl + "/wechat/branches/" + app.globalData.branchId + "/cart",
            method: 'GET',
            data: {
                "openid": app.globalData.openid
            },
            success: res => {
                console.log(res)
                page.setData({
                    cart: res.data.data
                })
                page.computeSumMonney()
            }
        })
    },
    selectMenu: function (e) {
        console.log(e)
        var categoryIndex = e.currentTarget.dataset.index
        this.setData({
            currentCategoryIndex: categoryIndex,
            toView: 'item' + categoryIndex
        })
    },
    showCartList: function (e) {
        if (this.data.cart.length != 0) {
            this.setData({
                showCart: !this.data.showCart
            })
        }
    },
    subtractNum: function (e) {
        console.log(e)
        var productId = e.currentTarget.dataset.productId
        console.log(productId)
        var cart = this.data.cart
        var cartTemp = new Array()
        for (var i = 0, iBorder = cart.length; i < iBorder; i++) {
            var cartProduct = cart[i]
            if (cartProduct.productId == productId) {
                if (cartProduct.productNum != 1) {
                    cartProduct.productNum--
                    cartProduct.sum = parseFloat((cartProduct.productPrice * cartProduct.productNum).toFixed(2))
                } else {
                    continue
                }
            }
            cartTemp.push({
                "productId": cartProduct.productId,
                "productNum": cartProduct.productNum,
                "productName": cartProduct.productName,
                "productPrice": cartProduct.productPrice,
                "sum": cartProduct.sum
            })
        }
        var showCart = cartTemp.length != 0
        this.setData({
            cart: cartTemp,
            showCart: showCart
        })
        this.computeSumMonney()
        wx.request({
            url: app.globalData.backendUrl + "/wechat/branches/" + app.globalData.branchId + "/cart/subtractNum",
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                "openid": app.globalData.openid,
                "productId": productId
            }
        })

    },
    addNum: function (e) {
        console.log(e)
        var productId = e.currentTarget.dataset.productId
        var cart = this.data.cart
        var exist = false
        for (var i = 0, iBorder = cart.length; i < iBorder; i++) {
            var cartProduct = cart[i]
            if (cartProduct.productId == productId) {
                exist = true
                cartProduct.productNum++
                cartProduct.sum = parseFloat((cartProduct.productPrice * cartProduct.productNum).toFixed(2))
            }
        }
        if (!exist) {
            var product = e.currentTarget.dataset.product
            var obj = {
                "productId": product.id,
                "productNum": 1,
                "productName": product.name,
                "productPrice": product.price,
                "sum": product.price
            }
            cart.push(obj)
        }
        this.setData({
            cart: cart
        })
        this.computeSumMonney()
        wx.request({
            url: app.globalData.backendUrl + "/wechat/branches/" + app.globalData.branchId + "/cart/addNum",
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                "openid": app.globalData.openid,
                "productId": productId
            }
        })
    },
    clearCart: function (e) {
        console.log(e)
        this.setData({
            cart: [],
            showCart: false,
            sumMonney: 0
        })
        wx.request({
            url: app.globalData.backendUrl + "/wechat/branches/" + app.globalData.branchId + "/clearCart",
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                "openid": app.globalData.openid
            }
        })
    },
    scroll: function (e) {
        console.log(e)
        var itemTabHeight = this.data.itemTabHeight
        var itemHeight = this.data.itemHeight
        var menu = this.data.menu
        var scrollTop = e.detail.scrollTop
        var scrollTopScale = this.data.scrollTopScale
        var acc = 0
        for (var i = 0, iBorder = menu.length; i < iBorder; i++) {
            acc = acc + (itemTabHeight + (itemHeight * menu[i].products.length))
            if (scrollTop * scrollTopScale < acc) {
                this.setData({
                    currentCategoryIndex: i
                })
                break
            }
        }
    }
})