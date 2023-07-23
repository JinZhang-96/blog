---
title: Hexo Guide
categories:
- Hexo
tags:
- hexo
---
[Hexo](https://hexo.io/) 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他标记语言）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。  

## 快速开始

### 安装

#### 安装前提

安装 Hexo 相当简单，只需要先安装下列应用程序即可：

Node.js (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)
Git
如果您的电脑中已经安装上述必备程序，那么恭喜您！你可以直接前往 安装 Hexo 步骤。

如果您的电脑中尚未安装所需要的程序，请根据以下安装指示完成安装。

#### 安装 Git

* Windows：下载并安装 [git](https://git-scm.com/download/win)。
* Mac：使用 Homebrew, MacPorts 或者下载 [安装程序](http://sourceforge.net/projects/git-osx-installer/)。
* Linux (Ubuntu, Debian)：`sudo apt-get install git-core`
* Linux (Fedora, Red Hat, CentOS)：`sudo yum install git-core`

#### 安装 Node.js

Node.js 为大多数平台提供了官方的 [安装程序](https://nodejs.org/zh-cn/download/)。对于中国大陆地区用户，可以前往 [淘宝 Node.js 镜像](https://npmmirror.com/mirrors/node/) 下载。

其它的安装方法：

* Windows：通过 nvs（推荐）或者 nvm 安装。
* Mac：使用 Homebrew 或 MacPorts 安装。
* Linux（DEB/RPM-based）：从 NodeSource 安装。
* 其它：使用相应的软件包管理器进行安装，可以参考由 Node.js 提供的 指导。
* 对于 Mac 和 Linux 同样建议使用 nvs 或者 nvm，以避免可能会出现的权限问题。

#### 安装 Hexo

所有必备的应用程序安装完成后，即可使用 npm 安装 Hexo。

执行以下命令进行全局安装
``` bash
$ npm install -g hexo-cli
``` 


执行以下命令进行局部安装
``` bash
$ npm install hexo
```

### 建站

安装 Hexo 完成后，请执行下列命令，Hexo 将会在指定文件夹中新建所需要的文件。

``` bash
$ hexo init <folder>
$ cd <folder>
$ npm install
```

新建完成后，指定文件夹的目录如下：
```
.
├── node_modules
├── scaffolds
├── source
├── themes
├── _config.landscape.yml
├── _config.yml
└── package.json
```
现在可以执行下列命令，运行Hexo博客。

``` bash
$ npm run server
```

## 配置

网站的 [配置](https://hexo.io/zh-cn/docs/configuration) 信息，您可以在此配置大部分的参数。

### 网站

|  参数  |  描述  |
|--------|-------|
| title	| 网站标题 |
| subtitle	| 网站副标题 |
| description	| 网站描述 |
| author	| 您的名字 |
| language	| 网站使用的语言。对于简体中文用户来说，使用不同的主题可能需要设置成不同的值，请参考你的主题的文档自行设置，常见的有 zh-Hans和 zh-CN。 |
| timezone	| 网站时区。Hexo 默认使用您电脑的时区。请参考 [时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) 进行设置，如 America/New_York, Japan, 和 UTC 。一般的，对于中国大陆地区可以使用 Asia/Shanghai。 |

其中，description 主要用于SEO，告诉搜索引擎一个关于您站点的简单描述，通常建议在其中包含您网站的关键词。author 参数用于主题显示文章的作者。

### 网址

|参数	|描述|默认值|
|---|----|----|
|url|	网址, 必须以 http:// 或 https:// 开头|	
|root	|网站根目录|	url's pathname|
|permalink	|文章的 永久链接 格式|	:year/:month/:day/:title/|
|permalink_defaults	|永久链接中各部分的默认值	|
|pretty_urls|	改写 permalink 的值来美化 URL|	
|pretty_urls.trailing_index|	是否在永久链接中保留尾部的 index.html，设置为 false 时去除|	true|
|pretty_urls.trailing_html|	是否在永久链接中保留尾部的 .html, 设置为 false 时去除 (对尾部的 index.html无效)|	true|

### 目录

|参数	|描述|默认值|
|---|----|----|
source_dir|	资源文件夹，这个文件夹用来存放内容。|	source
public_dir|	公共文件夹，这个文件夹用于存放生成的站点文件。|	public
tag_dir|	标签文件夹|	tags
archive_dir	|归档文件夹|	archives
category_dir|	分类文件夹|	categories
code_dir|	Include code 文件夹，source_dir 下的子目录|	downloads/code
i18n_dir|	国际化（i18n）文件夹|	:lang
skip_render	|跳过指定文件的渲染。匹配到的文件将会被不做改动地复制到 public 目录中。您可使用 [glob 表达式](https://github.com/micromatch/micromatch#extended-globbing)来匹配路径。	

### 文章

|参数	|描述|默认值|
|---|----|----|
new_post_name|	新文章的文件名称|	:title.md
default_layout	|预设布局|	post
auto_spacing|	在中文和英文之间加入空格|	false
titlecase	|把标题转换为 title case|	false
external_link|	在新标签中打开链接|	true
external_link.enable|	在新标签中打开链接|	true
external_link.field|	对整个网站（site）生效或仅对文章（post）生效|	site
external_link.exclude|	需要排除的域名。主域名和子域名如 www 需分别配置|	[]
filename_case|	把文件名称转换为 (1) 小写或 (2) 大写|	0
render_drafts|	显示草稿	|false
post_asset_folder|	启动 Asset 文件夹|	false
relative_link|	把链接改为与根目录的相对位址|	false
future	|显示未来的文章|	true
highlight|	代码块的设置, 请参考 [Highlight.js](https://hexo.io/zh-cn/docs/syntax-highlight#Highlight-js) 进行设置	
prismjs|	代码块的设置, 请参考 [PrismJS](https://hexo.io/zh-cn/docs/syntax-highlight#PrismJS) 进行设置

### 分类 & 标签

|参数	|描述|默认值|
|---|----|----|
default_category|	默认分类|	uncategorized
category_map	|分类别名	
tag_map|	标签别名	

### 日期 / 时间格式

Hexo 使用 [Moment.js](http://momentjs.com/) 来解析和显示时间。

|参数	|描述|默认值|
|---|----|----|
date_format|	日期格式|	YYYY-MM-DD
time_format|	时间格式|	HH:mm:ss
updated_option|	当 Front Matter 中没有指定 updated 时 updated 的取值|	mtime	

### 分页

|参数	|描述|默认值|
|---|----|----|
per_page|	每页显示的文章量 (0 = 关闭分页功能)|	10
pagination_dir|	分页目录|	page

### 扩展

|参数	| 描述 |
|-------|----|
theme|	当前主题名称。值为false时禁用主题
theme_config|	主题的配置文件。在这里放置的配置会覆盖主题目录下的 _config.yml 中的配置
deploy|	部署部分的设置
meta_generator|	Meta generator 标签。 值为 false 时 Hexo 不会在头部插入该标签

#### 独立的 _config.[theme].yml 文件

该特性自 Hexo 5.0.0 起提供

独立的主题配置文件应放置于站点根目录下，支持 yml 或 json 格式。需要配置站点 _config.yml 文件中的 theme 以供 Hexo 寻找 _config.[theme].yml 文件。

``` json
# _config.yml
theme: "my-theme"
```
``` json
# _config.my-theme.yml
bio: "My awesome bio"
foo:
  bar: 'a'
```
``` json
# themes/my-theme/_config.yml
bio: "Some generic bio"
logo: "a-cool-image.png"
  foo:
    baz: 'b'
```
最终主题配置的输出是：
``` json
{
  bio: "My awesome bio",
  logo: "a-cool-image.png",
  foo: {
    bar: "a",
    baz: "b"
  }
}
```
我们强烈建议你将所有的主题配置集中在一处。如果你不得不在多处配置你的主题，那么这些信息对你将会非常有用：Hexo 在合并主题配置时，Hexo 配置文件中的 theme_config 的优先级最高，其次是 _config.[theme].yml 文件，最后是位于主题目录下的 _config.yml 文件。

## 主题

Hexo[开源社区](https://hexo.io/themes/) 提供了很多主题。

执行以下命令安装主题, 然后参照[扩展](#%E6%89%A9%E5%B1%95)配置主题即可。
``` bash
$ npm install <theme-name>
```

## 指令

### init

``` bash
$ hexo init [folder]
```
新建一个网站。如果没有设置 folder ，Hexo 默认在目前的文件夹建立网站。

本命令相当于执行了以下几步：

Git clone [hexo-starter](https://github.com/hexojs/hexo-starter) 和 [hexo-theme-landscape](https://github.com/hexojs/hexo-theme-landscape) 主题到当前目录或指定目录。
使用 Yarn 1、pnpm 或 npm 包管理器下载依赖（如有已安装多个，则列在前面的优先）。npm 默认随 Node.js 安装。

### new
``` bash
$ hexo new [layout] <title>
```

新建一篇文章。如果没有设置 layout 的话，默认使用 _config.yml 中的 default_layout 参数代替。如果标题包含空格的话，请使用引号括起来。

`$ hexo new "post title with whitespace"`

|参数|	描述|
|---|---|
-p, --path|	自定义新文章的路径
-r, --replace|	如果存在同名文章，将其替换
-s, --slug|	文章的 Slug，作为新文章的文件名和发布后的 URL

默认情况下，Hexo 会使用文章的标题来决定文章文件的路径。对于独立页面来说，Hexo 会创建一个以标题为名字的目录，并在目录中放置一个 index.md 文件。你可以使用 --path 参数来覆盖上述行为、自行决定文件的目录：

`hexo new page --path about/me "About me"`
以上命令会创建一个 source/about/me.md 文件，同时 Front Matter 中的 title 为 "About me"

注意！title 是必须指定的！如果你这么做并不能达到你的目的：

`hexo new page --path about/me`
此时 Hexo 会创建 `source/_posts/about/me.md`，同时 me.md 的 Front Matter 中的 title 为 "page"。这是因为在上述命令中，hexo-cli 将 page 视为指定文章的标题、并采用默认的 layout。

### generate

`$ hexo generate`
生成静态文件。

|选项|	描述|
|---|---|
-d, --deploy|	文件生成后立即部署网站
-w, --watch|	监视文件变动
-b, --bail|	生成过程中如果发生任何未处理的异常则抛出异常
-f, --force|	强制重新生成文件
Hexo 引入了差分机制，如果 public 目录存在，那么 hexo g 只会重新生成改动的文件。
使用该参数的效果接近 hexo clean && hexo generate
-c, --concurrency|	最大同时生成文件的数量，默认无限制
该命令可以简写为

`$ hexo g`

### publish

`$ hexo publish [layout] <filename>`
发表草稿。

### server

`$ hexo server`
启动服务器。默认情况下，访问网址为： http://localhost:4000/。

|选项|	描述|
|---|----|
-p, --port|	重设端口
-s, --static|	只使用静态文件
-l, --log|	启动日记记录，使用覆盖记录格式

### deploy
`$ hexo deploy`

部署网站。

|参数|	描述|
|---|----|
-g, --generate|	部署之前预先生成静态文件
该命令可以简写为：

`$ hexo d`

### render

`$ hexo render <file1> [file2] ...`
渲染文件。

参数|	描述
|---|----|
-o, --output|	设置输出路径

### migrate

`$ hexo migrate <type>`
从其他博客系统 [迁移内容](https://hexo.io/zh-cn/docs/migration)。

### clean

`$ hexo clean`

清除缓存文件 (db.json) 和已生成的静态文件 (public)。

在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行该命令。

### list

`$ hexo list <type>`
列出网站资料。

### version

`$ hexo version`

显示 Hexo 版本。

### 选项

#### 安全模式

`$ hexo --safe`
在安全模式下，不会载入插件和脚本。当您在安装新插件遭遇问题时，可以尝试以安全模式重新执行。

#### 调试模式

`$ hexo --debug`
在终端中显示调试信息并记录到 debug.log。当您碰到问题时，可以尝试用调试模式重新执行一次，并 提交调试信息到 GitHub。

#### 简洁模式

`$ hexo --silent`
隐藏终端信息。

#### 自定义配置文件的路径
``` bash
# 使用 custom.yml 代替默认的 _config.yml
$ hexo server --config custom.yml

# 使用 custom.yml 和 custom2.json，其中 custom2.json 优先级更高
$ hexo generate --config custom.yml,custom2.json,custom3.yml
```

自定义配置文件的路径，指定这个参数后将不再使用默认的 _config.yml。
你可以使用一个 YAML 或 JSON 文件的路径，也可以使用逗号分隔（无空格）的多个 YAML 或 JSON 文件的路径。例如：

``` bash
# 使用 custom.yml 代替默认的 _config.yml
$ hexo server --config custom.yml

# 使用 custom.yml, custom2.json 和 custom3.yml，其中 custom3.yml 优先级最高，其次是 custom2.json
$ hexo generate --config custom.yml,custom2.json,custom3.yml
```

当你指定了多个配置文件以后，Hexo 会按顺序将这部分配置文件合并成一个 _multiconfig.yml。如果遇到重复的配置，排在后面的文件的配置会覆盖排在前面的文件的配置。这个原则适用于任意数量、任意深度的 YAML 和 JSON 文件。

### 显示草稿

``` bash
$ hexo --draft
```

显示 source/_drafts 文件夹中的草稿文章。

### 自定义 CWD

``` bash
$ hexo --cwd /path/to/cwd
```

自定义当前工作目录（Current working directory）的路径。

## GitHub Pages 部署

GitHub Pages是[Github](https://github.com/)提供的免费服务，它可以让我们部署一些静态资源。
这样我们不需要购买服务器和域名， 就可以让自己的博客在公网上可以访问了。

### 创建仓库

1. 建立名为 <你的 GitHub 用户名>.github.io 的储存库，若之前已将 Hexo 上传至其他储存库，将该储存库重命名即可。
2. 将 Hexo 文件夹中的文件 push 到储存库的默认分支，默认分支通常名为 main，旧一点的储存库可能名为 master。
将 main 分支 push 到 GitHub：

    ``` bash
    $ git push -u origin main
    ```
    默认情况下 public/ 不会被上传(也不该被上传)，确保 .gitignore 文件中包含一行 public/。整体文件夹结构应该与 范例储存库 大致相似。


### 部署

1. 安装 hexo-deployer-git。

    ``` bash
    $ npm install hexo-deployer-git --save
    ```

2. 在 _config.yml 中添加以下配置（如果配置已经存在，请将其替换为如下）:

    ``` yml
    deploy:
    type: git
    repo: https://github.com/<username>/<project>
    # example, https://github.com/hexojs/hexojs.github.io
    branch: gh-pages
    ```
3. 执行 `hexo clean && hexo deploy` 。

    除非你使用令牌或 SSH 密钥认证，否则你会被提示提供目标仓库的用户名和密码。
    hexo-deployer-git 并不会存储你的用户名和密码. 请使用 [git-credential-cache](https://git-scm.com/docs/git-credential-cache) 来临时存储它们。

4. 浏览 <GitHub 用户名>.github.io 检查你的网站能否运作。