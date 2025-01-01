---
slug: 259-android-auto-switch-wifi
date: '2024-12-29'
layout: post
title: Android 自动切换 Wi-Fi，道路艰难
tags:
  - Android
  - Automation
issue: 259
---

家里有一个路由器在客厅，主要覆盖客厅和书房，另有一个信号放大器在主卧，主要覆盖枕头和马桶，因为是不同的 Wi-Fi 名称，很多时候，还得手动切换信号。为了解决这个难题，我做了一些尝试。

## 不太智能的 WLAN 助理

![image](https://github.com/user-attachments/assets/7de00a19-e1b8-4ade-bdd5-2d7d9b4f4ab8)

手机自带的 WLAN助理里面，有只能连接最佳 WLAN 的功能，我是打开的，但经常是信号的差的剩一格了，它都不会切换，有时候信号良好，它反而秀起来了，基本就等于智障了，直接放弃。

## 烂泥扶不上墙的 Automate

Automate 支持检测 Wi-Fi 信号强度以及切换连接，实现起来倒是蛮容易得，但问题是它的  Connect Wi-Fi 的 Block 不工作呀。

![image](https://github.com/user-attachments/assets/5358f022-a4d5-489d-9728-267f6f540329)

```
I 26@1: Flow beginning
I 26@4: Wi-Fi signal strength?
U 26@20: 31.111112594604492
I 26@11: Expression true?
I 26@16: Wi-Fi network connected?
U 26@21: MIAO
I 26@17: Expression true?
I 26@18: Wi-Fi network connect
F 26@18: java.lang.IllegalStateException: Failed to bind service
I 26@18: Stopped by failure
```

在 Automate 的 Redddit 上没倒是有看到个反馈这个问题的，说是安装了 Legacy Extension 就好了。

![image](https://github.com/user-attachments/assets/d1b6364d-1bd9-49fd-874f-ea541477b1a7)

官方的说法是，应用一旦上了 Google Play，那么一些特性将因为安全原因受限，所以需要一个直接通过 apk 安装的辅助插件来曲线救国。

![image](https://github.com/user-attachments/assets/bbe02a8e-85e3-4822-b7d5-74fc7ac0fce1)


然而，安装后，还是没有什么鸟用，日志报告的异常依然完全一样。

放弃这条路了。

## AI 也束手无策

Automate 走不通后，我想着现在 AI 工具这么多，连 Github Copilot 都免费了，干脆直接写个 Android 应用用代码实现吧。

![image](https://github.com/user-attachments/assets/836370b8-1369-4cbe-b1f8-24c7990d4722)

简答写了要求，Copilot 倒是洋洋洒洒给出了详细的代码，几乎没怎么修改就可以跑起来，但是仍然在连接 Wi-Fi 的步骤卡壳。

经过反复的尝试和换方案，三种连接方式全部不行。

1. wifiManager.enableNetwork()

```kotlin
var found = false
for (config in wifiManager?.configuredNetworks!!) {
    Log.d("WifiService", "Config: $config")
    if (config.SSID == String.format("\"%s\"", ssid)) {
        var result = wifiManager?.enableNetwork(config.networkId, true)
        Log.d("WifiService", "Connect result: $result")
        found = true
        break
    }
}
Log.d("WifiService", "Found: $found")
```

问题是 wifiManager.configuredNetworks 拿到的列表永远是空的，就完全没有后面什么事儿了，命名需要的权限都授予了。

2. connectivityManager.requestNetwork()

```kotlin
val wifiNetworkSpecifier = WifiNetworkSpecifier.Builder()
    .setSsid(ssid)
    .build()

val networkRequest = NetworkRequest.Builder()
    .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
    .setNetworkSpecifier(wifiNetworkSpecifier)
    .build()

val connectivityManager = applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
connectivityManager.requestNetwork(networkRequest, object : ConnectivityManager.NetworkCallback() {
    override fun onAvailable(network: android.net.Network) {
        Log.d("WifiService", "Connected to: $ssid")
        connectivityManager.bindProcessToNetwork(network)
    }

    override fun onUnavailable() {
        Log.d("WifiService", "Failed to connect to: $ssid")
    }
})
```

执行总是失败，会走到 onUnavailable 这里，为什么失败，也没有个错误原因之类的消息，摸不着头脑。

3. wifiManager.addNetworkSuggestions()

```kotlin
val suggestion = WifiNetworkSuggestion.Builder()
    .setSsid(ssid)
    .build()

val suggestionsList = listOf(suggestion)

val status = wifiManager.addNetworkSuggestions(suggestionsList)
if (status == WifiManager.STATUS_NETWORK_SUGGESTIONS_SUCCESS) {
    Log.d("WifiService", "Suggestion for $ssid added successfully")
} else {
    Log.d("WifiService", "Suggestion for $ssid failed with status: $status")
}
```

这个方式会弹窗主动授权一下允许允许建议，虽然这个方法的执行的结果是成功，但实际上 Wi-Fi 并不会切换，可能真的只是 suggestion 而已。

![image](https://github.com/user-attachments/assets/5155fc08-5864-4326-bdaf-4fb1104aa59c)

受知识所限，继续折腾 AI 也无济于事，暂时放弃啦~

Android 的大佬们，可以指点下迷津吗？我甚至怀疑是不是我的 Oppo 手机在这方面有什么限制。





