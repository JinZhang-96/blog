---
title: Spring Cloud Alibaba deploy for Docker 
categories:
- CentOS 
- Docker
tags:
- CentOS
- Docker
- Nacos
---

在 Docker 中部署 Spring Cloud Alibaba 插件中遇到的几个问题， 在此记录一下。
<!-- more -->

## Nacos 容器启动成功，应用连接不到

  如果 Nacos 容器已经启动成功，管理页面也能访问，但是 Spring Cloud 项目却连接不上 Nacos。
  请确认 Nacos 容器是否开放 9848 端口，因为应用和 Nacos 通信的端口是 9848, 而不是管理页面的 8848。

## Nacos 服务列表中的服务 IP 为 容器内部 IP， 导致应用不能通信

  请配置 `docker-compose.yml` 文件，添加正确的 IP。
  如下指定 Seata 的 IP：
    ``` yml
          environment:
        - SEATA_IP=192.168.128.3
    ```
