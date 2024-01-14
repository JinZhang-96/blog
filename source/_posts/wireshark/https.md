---
title: 在 Wireshark 中查看捕获的 https 数据
categories:
- Wireshark 
- HTTPS
tags:
- Wireshark 
- HTTPS
- Chrome
---

使用 Fiddler 抓包，https 协议的数据通常是可以查看明文的。而在 Wireshark 中抓到的 https 数据，如果不配置密钥，默认是无法查看明文的。究其原因， 这 2 个软件抓包的实现原理是不同的。  

<!-- more -->

  Fiddler 在客户端和服务器中间起到一个代理者的作用， 客户端向服务器请求数字证书时， Fiddler 会把自己的数字证书给客户端， 然后 Fiddler 再向服务器索要数字证书，自己存下来。  

一方面浏览器拿到 Fillder 发送的数字证书后，会用数字证书的公钥加密自己的密钥发给 Fiddler, 这样 Fiddler 就可以用自己的私钥解密客户端发来的密钥，有了密钥就可以解密后续客户端发来的数据。 

另一方面 Fiddler 拿到服务器的数字证书后，会用数字证书的公钥加密自己的密钥发给服务器，后续服务器发送的数据就会使用此密钥进行加密，这样 Fiddler 收到服务器发来的数据就可以使用自身的密钥进行解密了。


而 Wireshark 是对网卡进行监听，记录网卡发送的数据， 在端到端的发送中并不能做什么手脚，所以无法直接进行解密。  
而是需要拿到客户端的密钥，并在 Wireshark 中配置，才可以解密。  
以下以 Chrome 客户端为例，分几个步骤，介绍怎么配置解密。  

## 设置 Chrome 密钥记录的文件，并开启 Chrome 的密钥记录功能

1. 打开 cmd, 执行 `setx SSLKEYLOGFILE  [filename]`;
2. 打开 cmd, 执行 `"[chrome-execute-path]" --ssl-key-log-file=[filename]`;

[chrome-execute-path] 为 chrome 执行文件路径，[filename] 为密钥文件全路径。

## 设置 Wireshark

首先通过 `编辑 -> 首选项 -> Protocols -> TLS` 路径找到配置面板, 如(图一)所示：
![(图一)]

把标记区域的文件路径改为密钥文件的路径。

## 查看效果

经过以上配置，https 的数据包就被解密了，如(图二)所示：
![(图二)]

这里展示了 https://www.baidu.com 的响应报文数据。  
响应体的数据乱码，是因为数据进行了 gzip 压缩，只需复制一下原始数据，在进行 gzip 的解压就可以展示出正常的数据了。

[(图一)]: wirshark.png
[(图二)]: packet.png