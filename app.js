App({
    onLaunch: function () {
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: this.globalData.backendUrl + "/wechat/openid",
                    data: {
                        "jsCode": res.code
                    },
                    complete: res => {
                        console.log("login response:", res)
                        this.globalData.openid = res.data.data
                        wx.request({
                            url: getApp().globalData.backendUrl + "/wechat/beShopMember",
                            method: 'POST',
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                branchId: getApp().globalData.branchId,
                                openid: getApp().globalData.openid
                            }
                        })
                    }
                })
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: {},
        backendUrl: "https://qudiancan.mynatapp.cc/qudiancan",
        branchId: 1,
        branchTableId: 1,
        openid: null
    }
})