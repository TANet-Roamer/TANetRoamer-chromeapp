var user, password, nf = chrome.notifications, 
chromeVersion = Number(window.navigator.userAgent.match(/Chrome\/\d*/)[0].split("/")[1]),
settingBtn = {
	"title" : "設定",
	"iconUrl" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4/5/hPwAH/QL+ecrXpAAAAABJRU5ErkJggg=="
},
red = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8DwHwAFAAH/VscvDQAAAABJRU5ErkJggg==",
green = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNg+M/wHwAEAQH/rrVV9QAAAABJRU5ErkJggg==";
chrome.app.runtime.onLaunched.addListener(launch);
function launch() {
	var data = {
		"user" : user,
		"password" : password,
		"cmd" : "authenticate",
		"Login" : "繼續"
	};
	nf.create("main", {
		"type" : "basic",
		"iconUrl" : green,
		"title" : "登入",
		"message" : "使用 " + data.user + " 帳號進行登入",
		"buttons" : [settingBtn]
	}, function () {});
	var xhr = new XMLHttpRequest();
	xhr.open("post", "http://securelogin.arubanetworks.com/upload/custom/default/Login.htm");
	xhr.onload = function () {
		console.log("s");
	};
	xhr.onerror = function () {
		nf.create("loginError", {
			"type" : "basic",
			"iconUrl" : red,
			"title" : "登入失敗",
			"message" : "您尚未連上TANet Roaming",
			"buttons" : [settingBtn]
		}, function () {});
	};
	xhr.send(JSON2URL(data));
}

function JSON2URL(JSON) {
	var URL = "",
	first = true;
	for (var i in JSON) {
		if (first)
			URL += i + "=" + JSON[i];
		else
			URL += "&" + i + "=" + JSON[i];
		first = false;
	}
	return URL;
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (var key in changes) {
	}
});

chrome.storage.sync.get(["user", "password"], function (data) {
	user = data.user;
	password = data.password;
});

nf.onButtonClicked.addListener(function (nfID, btnID) {
	if (nfID == "main" || nfID == "loginError" && btnID === 0) {
	  var CreateWindowOptions = ((chromeVersion >= 35)?
  	  {"resizable" : false, "innerBounds" : {"width":150,"minWidth":100, "maxWidth": 400,"height":200, "minHeight":200, "maxHeight":300}} : 
  	  {"resizable" : false,"bounds": {"width":150,"height":200},"minWidth":100, "maxWidth": 400, "minHeight":200, "maxHeight":300});
		chrome.app.window.create("setting.html", CreateWindowOptions);
	}
});
