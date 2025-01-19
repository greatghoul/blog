---
slug: 261-vscode-github-copilot-proxy
date: '2025-01-19'
layout: post
title: 解决 VSCode Remote 项目中 Github Copilot 连接错误的问题
tags:
  - VS Code
  - Github Copilot
issue: 261
---

我有一个在通过 VSCode WSL 中运行的项目，这个项目中 Github Copilot 总是运行不起来，查看日志显示代理连接错误：**FetchError: tunneling socket could not be established**

```
[error] [default] Error sending telemetry FetchError: tunneling socket could not be established, cause=Failed to establish a socket connection to proxies: PROXY ***
    at fetch (/root/.vscode-server/extensions/github.copilot-1.257.0/node_modules/@adobe/helix-fetch/src/fetch/index.js:99:11)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at cachingFetch (/root/.vscode-server/extensions/github.copilot-1.257.0/node_modules/@adobe/helix-fetch/src/fetch/index.js:288:16)
    at Pge.fetch (/root/.vscode-server/extensions/github.copilot-1.257.0/lib/src/network/helix.ts:94:22) {
  type: 'system',
  _name: 'FetchError',
  code: 'ProxyFailedToEstablishSocketConnection',
  errno: undefined,
  erroredSysCall: undefined
}
```

![Image](https://github.com/user-attachments/assets/f79b56f7-1dea-49e8-a05a-4ff49a8d6704)

但是一个本地的项目却能正常连接

![Image](https://github.com/user-attachments/assets/679b486b-b336-4274-8bec-4764f357d2cb)

这个问题困扰了我好久，最终在一个 Github Issue 中找到了解决方法。

https://github.com/orgs/community/discussions/43188#discussioncomment-4611500

![Image](https://github.com/user-attachments/assets/039c1b18-75aa-4d7e-99b6-7a9a2dcd99e1)

原文中说取消勾选 Http: Proxy Strict SSL 并且 Http: Proxy Support 改为 on，不过我本地实验发现，其实只需要 Http: Proxy Support 从默认的 override 改为 on 就可以了。

![Image](https://github.com/user-attachments/assets/e701af6a-dcff-42a9-99a8-8d3438c95a4e)

