---
title: Docker Install
categories:
- CentOS 
- Docker
tags:
- CentOS
- Docker
- Install
---

[Docker](https://www.docker.com/) 是一款开源的虚拟化容器。  
本文记录了在 CentOS 7 操作系统中安装 Docker 的完整过程。

## 准备安装环境

在安装 Docker 之前，需要先检查一下操作系统是否具备以下条件：
1. 可以正常访问网络
2. 分区文件系统类型，支持 Docker 的存储驱动类型。
3. 操作系统内核版本满足 Docker 的要求。

运气不是太好，以上这 3 个问题在安装的过程中都遇到了，这浪费了很多的时间。
以下分别是这 3 个问题的解决办法。
### 配置网卡

如果 CentOS 7 连不上网络，是无法使用包管理工具安装 Docker 的。  
出现这种问题主要原因是网卡没有配置正确，查看当前有哪些网卡，使用以下命令：  
``` bash
$ ifconfig
```
输出结果如下：  
```
eno16777736: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.128.3  netmask 255.255.255.0  broadcast 192.168.128.255
        inet6 fe80::20c:29ff:fe90:7a54  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:90:7a:54  txqueuelen 1000  (Ethernet)
        RX packets 98076  bytes 117924104 (112.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 20565  bytes 1481553 (1.4 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 206  bytes 18234 (17.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 206  bytes 18234 (17.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
可以看到当前主机有 2 张网卡。  
其中名字为 lo 这张网卡为本地环回网卡，它的IP地址是127.0.0.1（localhost），利用这个接口可以实现系统内部发送和接收数据，无需关心。  
名字的前缀为 eno 的网卡才是和外部网络交换数据的网卡， 我们需要重新配置它， 执行以下命令：
``` bash
$ vim /etc/sysconfig/network-script/ifcfg-[name]     # name 为网卡的名字

修改如下：

TYPE=Ethernet
BOOTPROTO=static        # static 使用静态 IP; dhcp 通过 dhcp 服务动态分配IP
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
NAME=eno16777736
UUID=2bd860aa-dcf9-4e5f-9297-63bfd3b5943c
DEVICE=eno16777736
ONBOOT=yes              # 指定是否在开机时启用该网卡
IPADDR=192.168.128.3    # 配置正确的网卡IP         BOOTPROTO=dhcp 时 无需配置
NETMASK=255.255.255.0   # 配置正确的子网掩码       BOOTPROTO=dhcp 时 无需配置
GATEWAY=192.168.128.2   # 配置正确的网关           BOOTPROTO=dhcp 时 无需配置
DNS1=192.168.128.2      # 配置正确的DNS服务器， 如果错误会导致 IP 可以访问， 域名无法访问的问题

:wq 保存并退出
```
其中IPADDR 、NETMASK 、GATEWAY 、DNS1 这 4 项不是固定的，没必要按照上边的复制，要根据实际的网络环境配置。
当前主机的虚拟网络编辑器如（图一）所示：
![(图一)]

重启网卡，执行如下命令：  
``` bash
$ systemctl restart network （启动中）
$ systemctl start network   （已关闭）
```
执行 `ping www.baidu.com`，查看能否 ping 通。
如果还是不通， 则查看防火墙是否关闭，并执行下面命令关闭防火墙：
``` bash
$ systemctl stop firewalld
$ systemctl disable  firewalld (禁用，重启操作系统后， 防火墙不会自动启动)
```
### 格式化分区

下表是 Docker 存储驱动类型和 CentOS 文件系统类型的对应关系。

| Storage driver | Supported backing filesystems |
|:--------------:|:-----------------------------:|
| overlay2	     | xfs with ftype=1, ext4        |
| fuse-overlayfs | any filesystem                |
| devicemapper	 | direct-lvm                    |
| btrfs	         | btrfs                         |
| zfs	         | zfs                           |
| vfs	         | any filesystem                |

如果没有在 `/etc/docker/daemon.json` 指定 storage-driver，  Docker 在安装的过程中发现CentOS 文件系统类型不支持存储驱动类型的时候，会自动降级，其中 vfs 存储驱动类型可以在任何文件系统类型中兼容， 这样能保证 Docker 在这一步安装过程能正常通过。

本机在 `/etc/docker/daemon.json` 文件中指定了 `"storage-driver":"overlay2"`，所以格式化分区为xfs文件系统，否则安装过程会报错。
在分区格式化之前， 请确保重要数据进行备份，因为重新格式化文件系统将删除所有数据。
1. 查看各个分区当前的文件类型，执行以下命令：  
``` bash
$ lsblk -f
```
2. 选择要分区的磁盘。例如，如果要分区的磁盘是/dev/sda，则运行以下命令：  
``` bash
$ sudo fdisk /dev/sda
```
3. 在fdisk命令提示符下，可以使用以下命令进行分区：  
n：创建一个新分区。
d：删除一个分区。
p：显示分区表。
w：保存并退出。

4. 使用n命令创建一个新分区。根据提示输入分区的起始扇区和大小。

5. 使用p命令查看分区表，确保分区已成功创建。

6. 使用w命令保存并退出fdisk。

7. 分区格式化，执行以下命令：
``` bash
$ sudo mkfs.xfs -n ftype=1 /dev/<device>
```
将<device>替换为您要重新格式化的设备名称，例如/dev/sda。

8. 挂载重新格式化的文件系统。运行以下命令：  
``` bash
$ sudo mount -o ftype=1 /dev/<device> /var/lib/docker
```
同样，将<device>替换为重新格式化的设备名称。

### 升级内核

本机安装的 Docker 为 24.0.4 ，要求内核版本为 3.10 或更高版本。
如果内核版本过低， Docker 安装之后， 容器暴露的接口，无法访问。

1. 查看当前系统的内核版本，命令如下：  
``` bash
$ uname -r
```
2. 更新系统软件包列表：  
``` bash
$ sudo yum update
```
3. 安装 ELRepo 存储库，该存储库提供了最新的稳定内核版本：
``` bash
$ sudo yum install -y https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
```
4. 安装最新的稳定内核版本：
``` bash
$ sudo yum --enablerepo=elrepo-kernel install kernel-ml
```
5. 更新 GRUB 配置以使用新内核：
``` bash
$ sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```
6. 重启系统以应用新内核：
``` bash
$ sudo reboot
```
7. 重启后，您可以再次运行 `uname -r` 命令来确认内核版本是否已成功升级。


## 开始安装

### 准备

安装 Docker 之前， 需要做以下2件事：  

1. 移除之前安装的 Docker，执行以下命令：  
``` bash
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

2. 配置 Docker 仓库，执行以下命令
``` bash
$ sudo yum install -y yum-utils
$ sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
### 安装

1. 安装 docker 依赖，执行以下命令：  
``` bash
$ sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

2. 启动 Docker，执行以下命令：  
``` bash
$ sudo systemctl start docker
```

3. 拉取 Nginx 镜像，执行以下命令： 
``` bash
$ docker pull nginx
```

4. 运行 Nginx ，并暴露 80 接口，执行以下命令：  
``` bash
$ docker run nginx -d -p 80:80
```

5. 监测是否启动成功  
浏览器访问 `http://192.168.128.3`， 如(图二)所示：  
![(图二)]




[(图一)]: network.jpg
[(图二)]: nginx.jpg
