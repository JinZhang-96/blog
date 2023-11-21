---
title: OAuth 2 使用方式
categories:
- OAuth
tags:
- OAuth
---

OAuth 2 具有 认证（Authentication）和授权（Authorization）的功能

<!-- more -->

## 授权码模式

A 应用 跳转到授权服务器的 `https://xxx/oauth/authorize?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=CALLBACK_URL&
  scope=read`地址，然后转发到登陆页面。  
  登录成功后，会创建一个授权码，通过 redirect_uri 参数的回调地址返回授权码。  

A 应用使用授权码 在后端请求 `https://xxx/oauth/token?
 client_id=CLIENT_ID&
 client_secret=CLIENT_SECRET&
 grant_type=authorization_code&
 code=AUTHORIZATION_CODE&
 redirect_uri=CALLBACK_URL` 地址，获取到 access_token 后保留在后端使用。  
 当access_token 过期后，通过 `https://xxx/oauth/token?
  grant_type=refresh_token&
  client_id=CLIENT_ID&
  client_secret=CLIENT_SECRET&
  refresh_token=REFRESH_TOKEN` 地址使用 refresh_token 重新获取 access_token。

这种方式是最常用的流程，安全性也最高，它适用于那些有后端的 Web 应用。授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏。

## 隐式模式

该模式会直接获取 access_token, A 应用 跳转到授权服务器的 `https://xxx/oauth/authorize?
  response_type=token&
  client_id=CLIENT_ID&
  redirect_uri=CALLBACK_URL&
  scope=read`地址，然后转发到登陆页面。  
登录成功后，会创建一个 access_token，通过 redirect_uri 参数的回调地址返回 access_token。  

这种方式把令牌直接传给前端，是很不安全的。因此，只能用于一些安全要求不高的场景，并且令牌的有效期必须非常短，通常就是会话期间（session）有效，浏览器关掉，令牌就失效了。

## 密码模式

该模式直接使用密码获取 access_token, A 应用通过 Ajax 方式请求 `https://xxx/token?
  grant_type=password&
  username=USERNAME&
  password=PASSWORD&
  client_id=CLIENT_ID` 地址，返回 access_token。  

这种方式需要用户给出自己的用户名/密码，显然风险很大，因此只适用于其他授权方式都无法采用的情况，而且必须是用户高度信任的应用。

## 凭证模式

该模式使用注册的 client_id 和 client_secret 获取 access_token。  
A 应用发送 `https://xxx/token?
  grant_type=client_credentials&
  client_id=CLIENT_ID&
  client_secret=CLIENT_SECRET` 请求， 获取 access_token。  

这种方式给出的令牌，是针对第三方应用的，而不是针对用户的，即有可能多个用户共享同一个令牌。
