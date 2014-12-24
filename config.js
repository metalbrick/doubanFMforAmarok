var Config = {
    UserName: "",
    UserPass: ""
};
var request;

Amarok.Window.addToolsSeparator();
Amarok.Window.addToolsMenu("DoubanFMLogin", "Login to Douban FM", Amarok.Info.scriptPath() + "/icon.png");
Amarok.Window.ToolsMenu.DoubanFMLogin['triggered()'].connect(openLoginDialog);
Amarok.Window.addToolsMenu("DoubanFMLike" ,"Like/Unlike Current Song", Amarok.Info.scriptPath() + "/like.png");
Amarok.Window.ToolsMenu.DoubanFMLike['triggered()'].connect(toggleLikeAction);
Amarok.Window.addToolsMenu("DoubanFMCollect" ,"Collect Current Channel/Programme", Amarok.Info.scriptPath() + "/star.png");
Amarok.Window.ToolsMenu.DoubanFMCollect['triggered()'].connect(collectProgrammeChannelAction);
getToken();

function collectProgrammeChannelAction()
{
    album = Amarok.Engine.currentTrack().album;
    var posFMID = album.search("#FMID");
    var posPMID = album.search("#PMID");
    if ( posFMID >= 0 )
    {
        var fmid = album.substring(posFMID+5, album.length);
        collectChannel(fmid);
        text =  "Collect Channel: " + album.substring(0, posFMID);
    }
    else if ( posPMID >= 0 )
    {
        var pmid = album.substring(posPMID+5, album.length);
        collectProgramme(pmid);
        text =  "Collect Programme: " + album.substring(0, posPMID);
    }
    else
    {
        Amarok.Window.Statusbar.longMessage("Not a song on DoubanFM.");
        return;
    }

    image = new QImage(Amarok.Info.scriptPath() + "/star.png");
    Amarok.Window.OSD.setText(text);
    Amarok.Window.OSD.setImage(image);
    Amarok.Window.OSD.setOffset(2000);
    Amarok.Window.OSD.show();
    Amarok.Window.OSD.setDuration(5000);
}

function collectChannel(fmid)
{
    var token = Amarok.Script.readConfig("DoubanToken", "");
    if ( token != "" )
    {
        url = "/v2/fm/app_collect_channel?app_name=radio_android&" +
              "type=e&version=618&kbps=64&channel=0&id=" + fmid;

        header = new QHttpRequestHeader("POST", url);
        header.setValue("Host", "api.douban.com");
        header.setValue("Authorization", "Bearer "+token);
        header.setValue("Content-type", "application/x-www-form-urlencoded");

        req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
        req.request(header);
    }
    else
        Amarok.Window.Statusbar.longMessage('Please login to DoubanFM first."');
}

function collectProgramme(pmid)
{
    var token = Amarok.Script.readConfig("DoubanToken", "");
    if ( token != "" )
    {
        url = "/v2/fm/programme/collect?app_name=radio_android&" +
              "type=e&version=618&kbps=64&channel=0&id=" + pmid;

        header = new QHttpRequestHeader("POST", url);
        header.setValue("Host", "api.douban.com");
        header.setValue("Authorization", "Bearer "+token);
        header.setValue("Content-type", "application/x-www-form-urlencoded");

        req = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
        req.request(header);
    }
    else
        Amarok.Window.Statusbar.longMessage('Please login to DoubanFM first."');
}

function toggleLikeAction()
{   
    title = Amarok.Engine.currentTrack().title;
    pos = title.search("#SID");

    if ( pos >= 0 )
    {
        sid = title.substring(pos+4, title.length);
        state = title.substring(0, 3);
        isLiked = (state=="[❤]");
        var text, image;
        if ( isLiked ) 
        {
            text =  "Unliked the song: " + title.substring(3, pos);
            image = new QImage(Amarok.Info.scriptPath() + "/unlike_osd.png");
        }
        else
        {
            text =  "liked the song: " + title.substring(0, pos);
            image = new QImage(Amarok.Info.scriptPath() + "/like_osd.png");
        }
        Amarok.Window.OSD.setText(text);
        Amarok.Window.OSD.setImage(image);
        Amarok.Window.OSD.setOffset(2000);
        Amarok.Window.OSD.show();
        Amarok.Window.OSD.setDuration(5000);
        toggleLikedSong(sid, isLiked);
    }
    else
    {
        Amarok.Window.Statusbar.longMessage("Not a Song on Douban FM");
    }
}

function loginDialog() 
{
    this.window = new QMainWindow(this);
    this.dialog = new QWidget(this);

    this.show = function () {
        this.window.show();
    };

    this.accept = function () {
        this.saveConfiguration();
        this.window.close();
        // Do the Login
        getToken();
    };

    this.close = function () {
        this.window.close();
    };

    this.readConfiguration = function () {
        Config.UserName = Amarok.Script.readConfig("DoubanName", "");
        Config.UserPass = Amarok.Script.readConfig("DoubanPass", "");
    };

    this.saveConfiguration = function () {
        try {
            Config.UserName = this.UserInput.text;
            Config.UserPass = this.PassInput.text;

            Amarok.Script.writeConfig("DoubanName", Config.UserName);
            Amarok.Script.writeConfig("DoubanPass", Config.UserPass);
        } catch (err) {
            Amarok.debug(err);
        }
    };

    this.readConfiguration();

    this.Title = new QHBoxLayout();
    this.Label = new QLabel("<b>Login - Douban FM</b>");
    this.Title.addWidget(this.Label, 0, Qt.AlignLeft);

    this.Logo = new QHBoxLayout();
    this.logo = new QPixmap(Amarok.Info.scriptPath() + "/icon.png");
    this.logoLabel = new QLabel();
    this.logoLabel.setPixmap(this.logo);
    this.Logo.addWidget(this.logoLabel, 0, Qt.AlignRight);

    // Login Tab
    this.UserBox = new QHBoxLayout();
    this.UserLabel = new QLabel("Username:");
    this.UserInput = new QLineEdit(Config.UserName);
    this.UserInput.setMinimumSize(210, 0);

    this.UserInput.setDisabled(false);
    this.UserBox.addWidget(this.UserLabel, 0, Qt.AlignLeft);
    this.UserBox.addWidget(this.UserInput, 0, Qt.AlignRight);

    this.PassBox = new QHBoxLayout();
    this.PassLabel = new QLabel("Password:");
    this.PassInput = new QLineEdit(Config.UserPass, "password");
    this.PassInput.setMinimumSize(210, 0);

    this.PassInput.setDisabled(false);
    this.PassInput.echoMode = QLineEdit.Password;
    this.PassBox.addWidget(this.PassLabel, 0, Qt.AlignLeft);
    this.PassBox.addWidget(this.PassInput, 0, Qt.AlignLeft);

    // Main
    this.mainHeader = new QHBoxLayout();
    this.mainHeader.addLayout(this.Title, 0);
    this.mainHeader.addLayout(this.Logo, 0);

    this.HeadearTab = new QWidget();
    this.HeadearTab.setLayout(this.mainHeader);

    // Login Box 
    this.loginBox = new QGridLayout();
    this.loginBox.addLayout(this.UserBox, 1, 0);
    this.loginBox.addLayout(this.PassBox, 2, 0);

    this.loginTab = new QGroupBox("");
    this.loginTab.setLayout(this.loginBox);

    this.buttonBox = new QDialogButtonBox();
    this.buttonBox.addButton(QDialogButtonBox.Ok);
    this.buttonBox.addButton(QDialogButtonBox.Cancel);
    this.buttonBox.accepted.connect(this, this.accept);
    this.buttonBox.rejected.connect(this, this.close);

    this.mainTabs = new QTabWidget();
    this.mainTabs.addTab(this.loginTab, new QIcon(Amarok.Info.scriptPath() + "/icon.png"), "Login");

    this.vblSet = new QVBoxLayout(this.dialog);
    this.vblSet.addWidget(this.HeadearTab, 0, 0);
    this.vblSet.addWidget(this.mainTabs, 0, 0);
    this.vblSet.addWidget(this.buttonBox, 0, 0);

    var QRect = new QDesktopWidget;
    var Size = QRect.screenGeometry()
    var W = (Size.width() - 350) / 2;
    var H = (Size.height() - 400) / 2;

    this.dialog.setLayout(this.vblSet);
    this.dialog.sizeHint = new QSize(350, 400);
    this.dialog.size = new QSize(350, 400);
    this.window.move(W, H);
    this.window.setWindowTitle("Login - Douban FM");
    this.window.windowIcon = new QIcon(Amarok.Info.scriptPath() + "/icon.png");
    this.window.setCentralWidget(this.dialog);

    return true;
}

function openLoginDialog()
{
    var loginDlg = new loginDialog();
    loginDlg.show();
    return;
}

function finishLoginRequest(id, error)
{
    var result = request.readAll();
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);

    var token = jsonResult["access_token"];
    if ( token != null && token != "" )
    {
        Amarok.Script.writeConfig("DoubanToken",  jsonResult.access_token.toString());
        Amarok.Script.writeConfig("DoubanExpire", jsonResult.expires_in.toString());
        Amarok.Script.writeConfig("DoubanID", jsonResult.douban_user_id.toString());
        Amarok.Window.Statusbar.longMessage("DoubanFM Logged in.");
    }
    else
    {
        Amarok.Script.writeConfig("DoubanToken",  "");
        Amarok.Script.writeConfig("DoubanExpire", "");
        Amarok.Script.writeConfig("DoubanID",  "");
        Amarok.Window.Statusbar.longMessage("DoubanFM Authorization failed, reason is:\n"+jsonResult.msg);
    }
}

function getToken()
{
    var name = Amarok.Script.readConfig("DoubanName", "");
    var pswd = Amarok.Script.readConfig("DoubanPass", "");
    if ( name != "" )
    {
        url = "/service/auth2/token?redirect_uri=" +
              "http://douban.fm&client_secret=63cf04ebd7b0ff3b&client_id=" +
              "02f7751a55066bcb08e65f4eff134361&grant_type=password" +
              "&apikey=02f7751a55066bcb08e65f4eff134361" +
              "&username=" + name +
              "&password=" + pswd;
        var header = new QHttpRequestHeader("POST", url);
        header.setValue("Host", "www.douban.com");
        header.setValue("Content-type", "application/x-www-form-urlencoded");

        request = new QHttp("www.douban.com", QHttp.ConnectionModeHttps);
        request.requestFinished.connect(finishLoginRequest);
        request.request(header);
    }
    else
    {
        Amarok.Script.writeConfig("DoubanToken",  "");
        Amarok.Script.writeConfig("DoubanExpire", "");
        Amarok.Script.writeConfig("DoubanID",  "");
        Amarok.Window.Statusbar.longMessage('Fill your login info by "Tools->Login to Douban FM"');
    }
}

function postToggleLikedSong(id, error)
{
    var result = request.readAll();
    var codeBA = new QByteArray("utf8");
    var strResult = QTextCodec.codecForName(codeBA).toUnicode(result); 
    var jsonResult = JSON.parse(strResult);

    if ( jsonResult.r == 0 )
    {
        updateCurrentTrackLiked();
    }
    else
    {
        Amarok.Window.Statusbar.longMessage('Fail to toggle liked state on DoubanFM, check your network.');
    }
}

function toggleLikedSong(sid, liked)
{
    token = Amarok.Script.readConfig("DoubanToken", "");
    if ( token != "" )
    {
        if ( liked )
            url = "/v2/fm/unlike_song?sid=" + sid;
        else
            url = "/v2/fm/like_song?sid=" + sid;
        var header = new QHttpRequestHeader("POST", url);
        header.setValue("Host", "api.douban.com");
        header.setValue("Content-type", "application/x-www-form-urlencoded");
        header.setValue("Authorization", "Bearer " + token);

        request = new QHttp("api.douban.com", QHttp.ConnectionModeHttps);
        request.requestFinished.connect(postToggleLikedSong);
        request.request(header);
    }
    else
    {
        Amarok.Window.Statusbar.longMessage('Please login to DoubanFM first."');
    }
}

function updateCurrentTrackLiked()
{
    var title = Amarok.Engine.currentTrack().title;
    var wasLiked = false;
    if ( title.substring(0,3) == "[❤]" ) 
        wasLiked = true;

    // Remove old state
    Amarok.Playlist.removeCurrentTrack();
    // Insert new state
    if ( !wasLiked )
    {
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
        xml.writeStartElement("track");
        xml.writeTextElement("location", Amarok.Engine.currentTrack().url);
        xml.writeTextElement("identifier", Amarok.Engine.currentTrack().url);
        xml.writeTextElement("creator", Amarok.Engine.currentTrack().artist);
        xml.writeTextElement("title", "[❤]"+title);
        xml.writeTextElement("album", Amarok.Engine.currentTrack().album);
        xml.writeEndElement();
        xml.writeEndElement();
        xml.writeEndElement();
        xml.writeEndDocument();
        file.close();

        playlistUrl= new QUrl("file://"+path);
        Amarok.Playlist.addMedia(playlistUrl);
    }
}