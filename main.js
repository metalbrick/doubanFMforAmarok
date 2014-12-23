Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.gui");
Importer.loadQtBinding("qt.network");
Importer.loadQtBinding("qt.xml");
Importer.include("config.js");

var douban_fm_fetcher = {
    Cate_List: [["1_搜索兆赫","#Channels#"],["2_搜索节目","#Programmes#"],["3_我的兆赫","#MyChannels#"],["4_我的节目","#MyProgrammes#"],["5_热门兆赫","#HotChannels#"],["6_推荐兆赫","#RecommendChannels#"],["7_推荐节目","#RecommendProgrammes#"]],
    max_entries_count: "30",
    current_channel_id: "",
    current_channel_last_sid: "",
    reqPool: {}
};

function DoubanFMforAmarok()
{
    ScriptableServiceScript.call(this, "Douban FM", 3, "Access Music on Douban FM", "DoubanFM", true);
}

function fetchProgrammeWithHeader(id, error)
{
    var result = douban_fm_fetcher.reqPool["id"+id].readAll();
    delete douban_fm_fetcher.reqPool["id"+id];
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);

    if ( jsonResult.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    var programmes = jsonResult.programmes;
    var counts = programmes.length;
    for ( var i = 0; i < counts; i++ )
    {
        var item = Amarok.StreamItem;
        item.level = 1;
        item.itemName = programmes[i].title + " - " + programmes[i].creator.name;
        item.callbackData = "PROGRAMME:" + programmes[i].id;
        item.coverUrl = programmes[i].cover;
        item.playableUrl = "";
        script.insertItem(item);
    } 

    script.donePopulating();
}

function fetchRecommendProgramme(id, error)
{
    var result = douban_fm_fetcher.reqPool["id"+id].readAll();
    delete douban_fm_fetcher.reqPool["id"+id];
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);

    if ( jsonResult.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    for ( var k = 0; k < 2; k ++ )
    {
        var programmes = jsonResult[k].programmes;
        var counts = programmes.length;
        for ( var i = 0; i < counts; i++ )
        {
            var item = Amarok.StreamItem;
            item.level = 1;
            item.itemName = programmes[i].title + " - " + programmes[i].creator.name;
            item.callbackData = "PROGRAMME:" + programmes[i].id;
            item.coverUrl = programmes[i].cover;
            item.playableUrl = "";
            script.insertItem(item);
        } 
    }

    script.donePopulating();
}

function fetchChannelWithHeader(id, error)
{
    var result = douban_fm_fetcher.reqPool["id"+id].readAll();
    delete douban_fm_fetcher.reqPool["id"+id];
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);

    if ( jsonResult.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    var channels = jsonResult.channels;
    var counts = channels.length;
    for ( var i = 0; i < counts; i++ )
    {
        var item = Amarok.StreamItem;
        item.level = 1;
        item.itemName = channels[i].name;
        item.callbackData = "CHANNEL:" + channels[i].id;
        item.coverUrl = channels[i].cover;
        item.playableUrl = "";
        script.insertItem(item);
    } 

    script.donePopulating();
}

function fetchRecommendChannel(id, error)
{
    var result = douban_fm_fetcher.reqPool["id"+id].readAll();
    delete douban_fm_fetcher.reqPool["id"+id];
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);

    if ( jsonResult.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    var channels = jsonResult.data.channels;
    var counts = channels.length;
    for ( var i = 0; i < counts; i++ )
    {
        var item = Amarok.StreamItem;
        item.level = 1;
        item.itemName = channels[i].name;
        item.callbackData = "CHANNEL:" + channels[i].id;
        item.coverUrl = channels[i].cover;
        item.playableUrl = "";
        script.insertItem(item);
    } 

    script.donePopulating();
}

function parseSearchedProgramme(reply) 
{  
    json_tmp = JSON.parse(reply); 
    if ( json_tmp.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    var searched_programmes = json_tmp.programmes;
    programmes_count = searched_programmes.length;
    for ( var i = 0; i < programmes_count; i++ )
    {
        var item = Amarok.StreamItem;
        item.level = 1;
        item.itemName = searched_programmes[i].title + " - " + 
                        searched_programmes[i].creator.name+ "#PMID"+searched_programmes[i].id;
        item.callbackData = "PROGRAMME:" + searched_programmes[i].id;
        item.coverUrl = searched_programmes[i].cover;
        item.playableUrl = "";
        script.insertItem(item);
    }
    script.donePopulating();
}

function parseSearchedChannel(reply)
{   
    json_tmp = JSON.parse(reply); 
    if ( json_tmp.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    var searched_channels = json_tmp.channels;
    channels_count = searched_channels.length;
    for ( var i = 0; i < channels_count; i++ )
    {
        var item = Amarok.StreamItem;
        item.level = 1;
        item.itemName = searched_channels[i].name;
        item.callbackData = "CHANNEL:" + searched_channels[i].id;
        item.coverUrl = searched_channels[i].cover;
        item.playableUrl = "";
        script.insertItem(item);
    }

    script.donePopulating();
}

function parseHotChannel(reply)
{   
    json_tmp = JSON.parse(reply); 
    if ( json_tmp.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return;
    }

    var searched_channels = json_tmp.data.channels;
    channels_count = searched_channels.length; for ( var i = 0; i < channels_count; i++ ) {
        var item = Amarok.StreamItem;
        item.level = 1;
        item.itemName = searched_channels[i].name;
        item.callbackData = "CHANNEL:" + searched_channels[i].id;
        item.coverUrl = searched_channels[i].cover;
        item.playableUrl = "";
        script.insertItem(item);
    }
 script.donePopulating(); }

function parseProgrammeDetail(id, error)
{
    var result = douban_fm_fetcher.reqPool["id"+id].readAll();
    delete douban_fm_fetcher.reqPool["id"+id];
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);
    if ( jsonResult.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return; 
    }

    songs = jsonResult.songs;
    songs_count = songs.length;

    for ( var i = 0; i < songs_count; i++ )
    {
        var item = Amarok.StreamItem;
        item.level = 0;
        if ( songs[i].like == "0" )
            item.itemName = songs[i].title+" - "+songs[i].artist+" -《"+songs[i].albumtitle+"》#SID"+songs[i].sid;
        else
            item.itemName = "[❤]" + songs[i].title+" - "+songs[i].artist+" -《"+songs[i].albumtitle+"》#SID"+songs[i].sid;
        item.playableUrl = songs[i].url;
        item.coverUrl = songs[i].picture;
        item.callbackData = "";
        script.insertItem(item);
    }

    script.donePopulating();
}

function onPopulate(level, callbackData, filter)
{
    // filter = filter.replace("/ /g", "%20");
    filter = filter.replace("%20", " ", "gi");
    filter = filter.trim();
    filter = filter.replace(" ", "%20", "gi");
    currentFilter = filter.toLowerCase();
    if ( level == 2 )
    {
        count = douban_fm_fetcher.Cate_List.length;
        for ( var i = 0; i < count; i ++ )
        {
            var category = Amarok.StreamItem;
            category.level = 2;
            category.itemName = douban_fm_fetcher.Cate_List[i][0];
            category.callbackData = douban_fm_fetcher.Cate_List[i][1];
            category.playableUrl = "";
            category.coverUrl = "";
            script.insertItem(category);
        }

        script.donePopulating();
    }
    else if ( level == 1 ) 
    {
        if ( callbackData == "#Programmes#")
        {
            url = "https://api.douban.com/v2/fm/search/programme?start=0&limit="+
             douban_fm_fetcher.max_entries_count+"&q=" + currentFilter; 
            qurl = new QUrl(url);
            new Downloader(qurl, parseSearchedProgramme);
        }
        else if ( callbackData == "#Channels#")
        {
            url = "https://api.douban.com/v2/fm/search/channel?start=0&limit="+
             douban_fm_fetcher.max_entries_count+"&q=" + currentFilter; 
            qurl = new QUrl(url);
            new Downloader(qurl, parseSearchedChannel);
        }
        else if ( callbackData == "#HotChannels#")
        {
            url = "https://api.douban.com/v2/fm/hot_channels";
            qurl = new QUrl(url); 
            new Downloader(qurl, parseHotChannel); 
        }
        else if ( callbackData == "#MyChannels#")
        {
            var token = Amarok.Script.readConfig("DoubanToken", "");
            if ( token == "" )
            {
                Amarok.Window.Statusbar.longMessage("You need login to DoubanFM first.");
            }
            else
            {
                // Hearted FM
                var HeartedFM = Amarok.StreamItem; 
                HeartedFM.level = 1;
                HeartedFM.itemName = "_红心兆赫";
                HeartedFM.callbackData = "CHANNEL:-3";
                HeartedFM.playableUrl = "";
                HeartedFM.coverUrl = "http://img3.douban.com/pics/fm/channel_-3_cover.png";
                script.insertItem(HeartedFM);
                // Private FM 
                var PrivateFM = Amarok.StreamItem; 
                PrivateFM.level = 1;
                PrivateFM.itemName = "_私人兆赫";
                PrivateFM.callbackData = "CHANNEL:0";
                PrivateFM.playableUrl = "";
                PrivateFM.coverUrl = "http://img3.douban.com/pics/fm/channel_0_cover.png";
                script.insertItem(PrivateFM);

                var header = new QHttpRequestHeader("GET", "/v2/fm/channel_collection?start=0&limit=500");
                header.setValue("Host", "api.douban.com");
                header.setValue("Authorization", "Bearer " + token);

                req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
                req.requestFinished.connect(fetchChannelWithHeader);
                id = req.request(header);
                douban_fm_fetcher.reqPool["id"+id] = req;
            }
        }
        else if ( callbackData == "#MyProgrammes#")
        {
            var token = Amarok.Script.readConfig("DoubanToken", "");
            if ( token == "" )
            {
                Amarok.Window.Statusbar.longMessage("You need login to DoubanFM first.");
            }
            else
            {
                var header = new QHttpRequestHeader("GET", "/v2/fm/programme/collection?start=0&limit=500");
                header.setValue("Host", "api.douban.com");
                header.setValue("Authorization", "Bearer " + token);

                req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
                req.requestFinished.connect(fetchProgrammeWithHeader);
                id = req.request(header);
                douban_fm_fetcher.reqPool["id"+id] = req;
            }
        }
        else if ( callbackData == "#RecommendChannels#")
        {
            var token = Amarok.Script.readConfig("DoubanToken", "");
            var header = new QHttpRequestHeader("GET", "/v2/fm/rec_channels");
            header.setValue("Host", "api.douban.com");
            if ( token != "" )
                header.setValue("Authorization", "Bearer " + token);

            req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
            req.requestFinished.connect(fetchRecommendChannel);
            id = req.request(header);
            douban_fm_fetcher.reqPool["id"+id] = req;
        }
        else if ( callbackData == "#RecommendProgrammes#")
        {
            var token = Amarok.Script.readConfig("DoubanToken", "");
            var header = new QHttpRequestHeader("GET", "/v2/fm/programme/selections?"+
                "app_name=radio_android&version=618");
            header.setValue("Host", "api.douban.com");
            if ( token != "" )
                header.setValue("Authorization", "Bearer " + token);

            req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
            req.requestFinished.connect(fetchRecommendProgramme);
            id = req.request(header);
            douban_fm_fetcher.reqPool["id"+id] = req;
        }
    } 
    else if ( level == 0 )
    {
        if ( callbackData.substring(0, 10) == "PROGRAMME:") 
        {
            var programme_id = callbackData.replace("PROGRAMME:", "");
            updateProgrammeList(programme_id);
        }
        else if ( callbackData.substring(0, 8) == "CHANNEL:") 
        {
            var channel_id = callbackData.replace("CHANNEL:", "");
            updateChannlePlaylist(channel_id);
            script.donePopulating();
        }
    }
}


function onCustomize() {
    var currentDir = Amarok.Info.scriptPath() + "/";
    var iconPixmap = new QPixmap(currentDir + "icon.png");
    script.setIcon(iconPixmap);
    var emblemPixmap = new QPixmap(currentDir + "like.png");
    script.setEmblem(iconPixmap);
}

function updateProgrammeList(programme_id)
{
    var token = Amarok.Script.readConfig("DoubanToken", "");
    url = "/v2/fm/programme/detail?kbps=64&from=0&id=" + programme_id;

    header = new QHttpRequestHeader("GET", url);
    header.setValue("Host", "api.douban.com");

    if ( token != "" )
        header.setValue("Authorization", "Bearer " + token);

    req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
    req.requestFinished.connect(parseProgrammeDetail);
    id = req.request(header);
    douban_fm_fetcher.reqPool["id"+id] = req;
}

function updateChannlePlaylist(channel_id) 
{
    douban_fm_fetcher.current_channel_id = channel_id;
    url = "/v2/fm/playlist?app_name=radio_android&" +
          "type=n&version=618&kbps=64&channel=" + channel_id;
    if ( douban_fm_fetcher.current_channel_last_sid != "")
          url += "&sid=" + douban_fm_fetcher.current_channel_last_sid; 
    var token = Amarok.Script.readConfig("DoubanToken", "");

    header = new QHttpRequestHeader("GET", url);
    header.setValue("Host", "api.douban.com");

    if ( token != "" )
        header.setValue("Authorization", "Bearer " + token);

    req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
    req.requestFinished.connect(parseChannelDetail);
    id = req.request(header);
    douban_fm_fetcher.reqPool["id"+id] = req;
}

function parseChannelDetail(id, error)
{
    var result = douban_fm_fetcher.reqPool["id"+id].readAll();
    delete douban_fm_fetcher.reqPool["id"+id];
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);
    if ( jsonResult.status == false )
    {
        Amarok.Window.Statusbar.longMessage("Fail to fetch douban FM, please check your network connection.");
        return; 
    }

    songs = jsonResult.song;
    songs_count = songs.length;

    // Generate Playlist
    var path = Amarok.Info.scriptPath()+"/tmp.xspf";
    var file = new QFile(path);
    file.open(QIODevice.WriteOnly||QIODevice.Truncate);
    var xml = new QXmlStreamWriter();
    xml.setDevice(file);
    xml.writeStartDocument();
    xml.writeStartElement("playlist");
    xml.writeAttribute("version", "1.0");
    xml.writeAttribute("xmlns", "http://xspf.org/ns/0/0");
    xml.writeStartElement("trackList");
    for ( var i = 0; i < songs_count; ++ i )
    {
        xml.writeStartElement("track");
        url = songs[i].url.replace("&", "&amp;", "g").replace("<", "&lt;", "g").replace(">", "&gt;", "g");
        title = songs[i].title.replace("&", "&amp;", "g").replace("<", "&lt;", "g").replace(">", "&gt;", "g");
        artist = songs[i].artist.replace("&", "&amp;", "g").replace("<", "&lt;", "g").replace(">", "&gt;", "g");
        albumtitle = songs[i].albumtitle.replace("&", "&amp;", "g").replace("<", "&lt;", "g").replace(">", "&gt;", "g");
        imageurl = songs[i].picture.replace("&", "&amp;", "g").replace("<", "&lt;", "g").replace(">", "&gt;", "g");
        xml.writeTextElement("location", url);
        xml.writeTextElement("identifier", songs[i].sid);
        xml.writeTextElement("creator", artist);
        if ( songs[i].like == "0" )
            xml.writeTextElement("title", title+"#SID"+songs[i].sid);
        else
            xml.writeTextElement("title", "[❤]"+title+"#SID"+songs[i].sid);
        xml.writeTextElement("album", "《"+albumtitle+"》#FMID"+douban_fm_fetcher.current_channel_id);
        xml.writeTextElement("image", imageurl);
        xml.writeEndElement();
    }
    xml.writeEndElement();
    xml.writeEndElement();
    xml.writeEndDocument();

    file.close();

    douban_fm_fetcher.current_channel_last_sid = songs[songs_count-1].sid;
    playlistUrl= new QUrl("file://"+path);
    Amarok.Playlist.clearPlaylist();
    Amarok.Playlist.addMedia(playlistUrl);
}

function onTrackChanged() 
{
    var isLastSong = Amarok.Playlist.totalTrackCount() - 2 <= Amarok.Playlist.activeIndex();
    if ( isLastSong )
    {
        var album = Amarok.Playlist.trackAt(Amarok.Playlist.totalTrackCount()-1).album;
        var posTmp = album.search("#FMID");
        var isFMChannel = posTmp >= 0;
        if ( isFMChannel ) 
        {
            var idTmp = album.substring(posTmp+5, album.length);
            douban_fm_fetcher.current_channel_id = idTmp;
            updateChannlePlaylist(idTmp);
        }
    }

    // Update Playing History
    var title = Amarok.Engine.currentTrack().title;
    var posTmp = title.search("#SID");
    if ( posTmp >= 0 )
    {
        var sid = title.substring(posTmp+4, title.length);
        updatePlayHist(sid);
    }
}

function updatePlayHist(sid)
{
    var token = Amarok.Script.readConfig("DoubanToken", "");
    if ( token != "" )
    {
        url = "/v2/fm/playlist?app_name=radio_android&" +
              "type=e&version=618&kbps=64&channel=0&sid=" + sid;

        header = new QHttpRequestHeader("GET", url);
        header.setValue("Host", "api.douban.com");
        header.setValue("Authorization", "Bearer "+token);

        req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
        req.request(header);
    }
}

function updateCurrentChannel(frow, row)
{
    album = Amarok.Playlist.trackAt(row).album;
    posTmp = album.search("#FMID");
    if ( posTmp < 0 )
    {
        douban_fm_fetcher.current_channel_id = "";
        douban_fm_fetcher.current_channel_last_sid = "";
    }
}

script = new DoubanFMforAmarok();
script.populate.connect(onPopulate);
script.customize.connect(onCustomize);
Amarok.Engine.trackChanged.connect(onTrackChanged);
Amarok.Playlist.trackInserted.connect(updateCurrentChannel);