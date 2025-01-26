---
slug: 266-wechat-appmsggallery-sort
date: '2025-01-25'
layout: post
title: 无需安装扩展，快速排序公众号合集文章
tags:
  - 分享工具
  - 分享创造
issue: 266
---

如果你有有运营自己的公众号，并且有维护文章合集，有没有强迫症想要文章按照发布时间排序？

## 合集的排序不好用

公众号合集默认是按照添加顺序排列的，虽然可以正序或者倒序，但是如果你是添加了最近的几篇文章，又想去添加老早以前的文章，可能会导致添加的文章时间混乱。

想要保持排序干净，但是公众号后台的拖拽排序又极其难用，尤其是合集文章列表已经超过一屏的情况下，需要拖着文章来回滚动，非常煎熬。

![Image](https://github.com/user-attachments/assets/8dd14790-dadb-4d68-b707-61452d2a467d)

甚至排序图标的那个 Tooltip 还时不时挑出来阻断你的拖动操作。

![Image](https://github.com/user-attachments/assets/46dbeb4e-a5d1-4613-85e0-18df3bcdef44)

## 探索自动排序之路

那么有没有什么方法探索自动排序呢？我尝试了几种方案。

-   自动化工具，比如 PyAutoGUI, AutoHotKeys, AutoIt，这些工具操作传统的桌面窗口还行，但是网页元素却是获取不到，虽然有 OCR 的方案可以间接定位元素，但是太麻烦了，不值得。
-   Selenium webdriver， 虽然可以操作浏览器，模拟鼠标也不在话下，但是想分享给不懂技术的人使用，依赖太重，不合适。
-   JavaScript 模拟事件，虽然没什么依赖，但是模拟鼠标点击还行，要模拟鼠标运动，就捉襟见肘了。

在我快要放弃的时候，突然想到或许可以直接模拟请求，看了下请求结构，非常清晰。

![Image](https://github.com/user-attachments/assets/5cbbc2fc-ee1a-424d-88ea-de5f4c5cc80d)

唯一的难点是，这个 msgid 不好取得，现在的网页都是用 React 这类框架制作，不像 jQuery 时代，还会在元素的 dataset 或者 attribute 上留下蛛丝马迹。

![Image](https://github.com/user-attachments/assets/d6eb7e90-4ee0-4a03-8b7a-1e017157bacf)

在我考虑要不先抓一次请求，然后按请求中的顺序给页面元素做映射再重新排序提交请求时，发现页面竟然直接可以拿到消息列表的数据。

![Image](https://github.com/user-attachments/assets/3691e28d-7cd0-4bc5-868f-f86d174cff9f)

那事情就好办多了，一个简单脚本就能搞定。

## 在开发人员工具中请求排序

在合集编辑页面按 F12 或者 Ctrl+Shift+I (macOS 是 Option+⌘+I) 打开开发人员工具，如果默认不是 Console 标签页，就手动切换一下。

![Image](https://github.com/user-attachments/assets/8906215a-ca76-4470-b252-8f3ed53524ea)

粘贴下面的代码，根据注释，按照自己的需要修改，然后按回车运行后刷新页面即可。

```js
(function() {
  function getSortedAppMsgInfos () {
    const list = window.CGI_DATA['pages/album/edit']['edit_resp']['appmsg_infos'];
    return list.sort((a, b) => new Date(b.time) - new Date(a.time)).map(x => [x.appmsgid, x.title, x.time])
  }
  const appmsgList = getSortedAppMsgInfos();
  console.table(appmsgList);
  const urlParams = new URLSearchParams(window.location.search);
  const formData = new FormData();
  formData.append('subtype', 0);
  formData.append('id', urlParams.get('id'));
  formData.append('type', urlParams.get('type'));
  formData.append('title', document.querySelector('#album_title').value);
  formData.append('desc', document.querySelector('#album_desc').value);
  formData.append('is_updating', 0);
  formData.append('is_reverse', 1); // 排序 - 1 从新到旧, 0 从旧到新
  formData.append('is_numbered', 0); // 标题序号 - 1 显示, 0 不显示
  formData.append('appmsg_total', appmsgList.length);
  formData.append('sync_version', 1);
  formData.append('update_time', parseInt(new Date().getTime() / 1000));
  formData.append('continous_read_on', 1); // 连续阅读 - 1 开启, 0 关闭
  formData.append('update_frequence', '{}');
  formData.append('appmsg_info', JSON.stringify({appmsgkeys: getSortedAppMsgInfos().map(x => ({msgid: x[0], itemidx: "1"}))}));
  formData.append('crop_list', JSON.stringify({crop_list: []}));
  formData.append('token', urlParams.get('token'));
  formData.append('lang', urlParams.get('lang') || 'zh_CN');
  formData.append('f', 'json');
  formData.append('ajax', 1);
  fetch("https://mp.weixin.qq.com/cgi-bin/appmsgalbummgr?action=commit", {
    "body": new URLSearchParams(formData).toString(),
    "method": "POST",
    "mode": "cors",
    "credentials": "include",
    "headers": {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },    
  }).then(response => {
      if (!response.ok) {
          throw new Error('网络响应异常');
      }
      return response.json();
  })
  .then(data => {
      console.log('提交成功，响应数据:', data);
  })
  .catch(error => {
      console.error('提交失败:', error);
  });
})();
```

看到这清爽的排序，那真的是非常舒适。

## 抛砖引玉

因为个人技术能力限制，无法解析到合集编辑器中一些表单元素的值，脚本中的一些选项，需要手动修改。

```js
formData.append('is_reverse', 1); // 排序 - 1 从新到旧, 0 从旧到新
formData.append('is_numbered', 0); // 标题序号 - 1 显示, 0 不显示
formData.append('continous_read_on', 1); // 连续阅读 - 1 开启, 0 关闭
```

我把代码开源到了 github，欢迎懂前端的朋友交流和改进

https://github.com/greatghoul/devtool-scripts/

---

文章同步发表于微信公众号**老狗拾光**，欢迎关注。

https://mp.weixin.qq.com/s/ur_52iBbnBnKRsp2sTSFFA

![微信公众号老狗拾光](https://github.com/user-attachments/assets/1a652b8b-7f5b-4879-af52-65e1fe3f7b4d)
