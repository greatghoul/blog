---
slug: 265-vercel-as-rss-source
date: '2025-01-24'
layout: post
title: 借助 vercel 自建 rss 源
tags:
  - 分享工具
  - 分享创造
issue: 265
---

上一篇文章 [分享阅读 - AI编程，英语学习，SEO，Rails 以及老罗的相声](https://www.anl.gg/post/263-reading-ai-english-seo-rails-and-luoyonghao/) 提到自制 RSS 源，本篇就来分享一下。

作为一个 RSS 阅读器深度用户，经常碰到看着不错的博客或者资讯网站没有带 RSS 订阅这种上古的东西，而我又懒得每次挨个打开网站查看更新，于是就得想办法自制 RSS 了，选择其实蛮多的。

## RSS Generator 服务

网上其实有一些自动将网站变为 RSS 的服务，比如 FetchRSS, RSS.app，Feed43 等，它们大都还蛮好用的，甚至支持可视化界面来处理 RSS 条目。

![Image](https://github.com/user-attachments/assets/a50d7932-45b9-4803-877e-9300636084ab)

不过这些服务基本都有一些限制，比如抓取频率和数量，或者会插入广告等等，多多少少缺失一些掌控感。

## Runkit，曾经的王者

Runkit.com 是一个在线平台，允许用户直接在浏览器中编写、运行和共享 JavaScript 代码，支持实时协作和即时反馈，以及 API Endpoint，它支持调用 npm package，而不是很多 code runner 那样仅仅是运行简单无依赖的代码。可以算是一个很轻量的 Serverless + API Gateway。

我曾经就用这个平台自建过某个博客的 RSS，非常好用。

![Image](https://github.com/user-attachments/assets/6f7100be-0ca1-4af6-a866-0b558db314b4)

但是这个平台目前已经名存实亡了，它无法安装任何 npm package，客服几个月都没有任何反馈。

![Image](https://github.com/user-attachments/assets/1c6b500a-d8a2-4568-b3ab-01f92b8f5f88)

## Vercel 真的挺香的

Runkit 不行之后，我就切换到了 Vercel，它可以免费运行很多种语言的 web 应用，虽然必须部署一个项目而不是像 Runkit 那样仅仅在网页上写一个函数，但是它都免费了，也就没什么好抱怨的了。

最近和 Flask 恋奸情热，我就选择了 Flask 来生成 RSS

https://github.com/greatghoul/feedbook

![Image](https://github.com/user-attachments/assets/3dd85fc1-d2bb-4897-93b4-b0b651838367)

犯懒的话，其实可以把目标网页的 HTML 丢给 AI，让它帮你写好，省力又省心。

> 测试 RSS Feed
> https://myfeedbook.vercel.app/feed/yufm.com

----

目前我找 RSS 源大概是这么个顺序

1. 网站提供的话，优先用网站自带的
2. 网站不提供的话，找 RSSHub
3. RSSHub 没有的话，先用 RSS Generator
4. 觉得 RSS 有价值的话，改为自建

---

文章同步发表于微信公众号**老狗拾光**，欢迎关注。

https://mp.weixin.qq.com/s/UbUNGJIC-nJxv_Lls6Hrag

![微信公众号老狗拾光](https://github.com/user-attachments/assets/1a652b8b-7f5b-4879-af52-65e1fe3f7b4d)
