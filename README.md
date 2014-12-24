# Intro
和其他豆瓣电台Gadget比较起来，区别如下：
* **可以收听节目**
* 安装简单，不用编译不用装其他依赖
* 歌曲只要播放便会记录上传douban.fm，用来刷收听数再好不过
* 寄生在Amarok，所以基本上一切Bug我都会推卸给Amarok

# Installation
可以直接在Amarok中搜索Script进行安装，或者：
## OpenSUSE
```shell
git clone https://github.com/metalbrick/doubanFMforAmarok.git ~/kde4/share/apps/amarok/scripts/
```

## Ubuntu
```shell
git clone https://github.com/metalbrick/doubanFMforAmarok.git ~/kde/share/apps/amarok/scripts/
```

# Screenshot
![Screenshot](http://kde-apps.org/CONTENT/content-pre1/168312-1.png)

基本上是截图说明一切的小插件。

# Login
点击 "Tools->Login to Douban FM" 实现登陆操作，密码本地储存，由Amarok管理。

# Like/Unlike Current Song
请求会立即上传至douban.fm，但在Amarok中的状态不会立马更改，所以要在下一次播放该歌曲时才能反操作。

# Collect Current Channel/Programme
收藏当前播放歌曲来自的兆赫或节目，没有反操作，因为暂时没有想到直观展示当前兆赫的节目收藏状态的方法，取消收藏请在网页端进行。

# Known Issue
切换歌曲时，偶尔会导致整个程序假死，这个应该是Amarok收听Streaming内容时获取Cover Art时发生的bug，没有Confirm，建议使用时反选设置中"General->Automatically retrieve cover art"。

Enjoy yourself.
# ADs
http://music.douban.com/programme/496053
这么好的节目不上推荐，豆瓣音乐的编辑都是自己动手丰衣足食么。
