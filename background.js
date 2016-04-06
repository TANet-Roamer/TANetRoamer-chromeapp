var user = "user", password = "password", status = false, nf = chrome.notifications, schools,
settingBtn = {
	"title" : "設定",
	"iconUrl" : YELLOW
};
var errorHandler = function (e) {
	console.error(e)
};
chrome.app.runtime.onLaunched.addListener(login);

chrome.runtime.getPackageDirectoryEntry(function (root) {
	root.getFile("schools.json", {}, function (fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();
			reader.onloadend = function (e) {
				schools = JSON.parse(this.result);
			};
			reader.readAsText(file);
		}, errorHandler);
	}, errorHandler);
});

function login() {
	chrome.storage.sync.get(["school_current", "user", "password"], function (data) {
		var user = data.user,
		password = data.password,
		url = data.school_current.url || "http://securelogin.arubanetworks.com/auth/index.html/u";
		var post = {
			"user" : user,
			"password" : password,
			"cmd" : "authenticate",
			"Login" : "繼續"
		};
		nf.create({
			"type" : "basic",
			"iconUrl" : GREEN,
			"title" : STRING_LOGIN,
			"message" : "使用 " + user + " 帳號進行登入" + ((!schools.find(function (e) {
						return e.id === data.school_current;
					}).url) ? "\n此校園尚無專屬設定檔，使用預設設定檔登入。" : ""),
			"buttons" : [settingBtn]
		});
		var xhr = new XMLHttpRequest();
		xhr.open("post", url);
		xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
		xhr.onload = function () {
			var hash = decodeURI(new URL(xhr.responseURL).search).replace(/^\?/, "").split("="),
			nfOption;
			switch (hash.errmsg = hash[1]) {
			case LOGIN_SUCCESS:
				nfOption = {
					"type" : "basic",
					"iconUrl" : GREEN,
					"title" : STRING_LOGIN_SUCCESS,
					"message" : STRING_MSG_LOGIN_SUCCESS
				};
				break;
			case LOGIN_WRONG_PASSWORD:
				nfOption = {
					"type" : "basic",
					"iconUrl" : RED,
					"title" : STRING_LOGIN_FAILED,
					"message" : STRING_MSG_WRONG_PASSWORD,
					"buttons" : [settingBtn]
				};
				break;
			case LOGIN_NO_INFORMATION:
				nfOption = {
					"type" : "basic",
					"iconUrl" : RED,
					"title" : STRING_LOGIN_FAILED,
					"message" : "",
					"buttons" : [settingBtn]
				};
				break;
			case ONLY_ONE_USER:
				nfOption = {
					"type" : "basic",
					"iconUrl" : RED,
					"title" : STRING_LOGIN_FAILED,
					"message" : STRING_MSG_ONLY_ONE_USER,
					"buttons" : [settingBtn]
				};
				break;
			}
			nf.create(nfOption, function () {});
		};
		xhr.onerror = function () {
			nf.create("loginError", {
				"type" : "basic",
				"iconUrl" : RED,
				"title" : STRING_LOGIN_FAILED,
				"message" : STRING_MSG_WRONG_SSID,
				"buttons" : [settingBtn]
			});
		};
		xhr.send(JSON.toURL(post));
	});
};

function isConnect() {
	return new Promise(function (res, rej) {
		try {
			var xhr = new XMLHttpRequest();
			xhr.open("post", "https://www.google.com");
			xhr.onload = function () {
				res(true);
			};
			xhr.onerror = function () {};
			xhr.send();
		} catch (e) {
			console.log("asd");
			res(false);
		}
	});
}

JSON.toURL = function (JSON) {
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

nf.onButtonClicked.addListener(function (nfID, btnID) {
	if (btnID === 0) {
		var CreateWindowOptions = ((chromeVersion >= 35) ? {
			"resizable" : false,
			"innerBounds" : {
				"width" : 150,
				"minWidth" : 200,
				"maxWidth" : 400,
				"height" : 200,
				"minHeight" : 350,
				"maxHeight" : 400
			}
		}
			 : {
			"resizable" : false,
			"bounds" : {
				"width" : 200,
				"height" : 350
			},
			"minWidth" : 200,
			"maxWidth" : 400,
			"minHeight" : 350,
			"maxHeight" : 400
		});
		chrome.app.window.create("setting.html", CreateWindowOptions);
	}
});
