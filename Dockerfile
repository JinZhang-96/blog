FROM  node

MAINTAINER JinZhang

RUN apt-get update;\
    apt-get install yum;\
    yum install git;\
    git clone https://gitee.com/meimingla/blog.git /usr/blog

WORKDIR /usr/blog

RUN npm i; \
    npm run build;\
    yum install nginx

VOLUME /etc/nginx
