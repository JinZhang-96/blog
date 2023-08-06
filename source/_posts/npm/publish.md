---
title: 发布 npm 包
date: 2023-08-07 03:06:35
categories:
  - npm
tags:
  - npm
  - publish
---
平时我们写的一些前端公共工具或者库，在复用时如果还手动复制，效率不仅比较低并且不够优雅。  
为什么不发布到 [npm](https://docs.npmjs.com/) 仓库呢？   
发布到仓库后，我们在其他项目中使用时只需要使用 `npm i xxx` 命令安装就可以了。  

发布一个包通常包含以下几步操作，没有任何难度：  

<!-- more -->

## 注册 npm 账号

要往 npm 发布包，首先要有一个 npm 账号，可以在 ` https://www.npmjs.com/signup ` 进行注册。

## 登录账号

在项目中使用 ` npm login ` 命令登录注册的账号。  
登录完成后，使用 ` npm whoami ` 命令查看当前登录的账号，确认是否登录成功。

## 配置项目

发布包之前，请确保项目已经符合发布的标准，别人安装后能正常使用。  

一般需要正确配置以下：  

1. ` package.json ` 文件中 ` dependencies ` 配置正确的依赖。  

2. ` package.json ` 文件中 ` main ` 配置正确的入口文件，这样在项目中才能正确导入模块。

3. 构建项目

4. npm 的 registry 必须是 ` https://registry.npmjs.org/ `，如果配置了代理镜像，请改过来。

5. 确保包名唯一。包名就是  ` package.json ` 文件中 ` name ` 的值，可使用 ` npm view <name>` 命令查看此包名是否存在。

## 发布

使用 ` npm publish ` 发布本地包到 npm registry，发布成功后。可以在 ` https://www.npmjs.com/ ` 网站登录自己的账号，进入 packages 页面查看是否发布成功，如（图一）所示:
![(图一)]

[(图一)]: package.jpg

