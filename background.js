var user = "user", password = "password", status = false, nf = chrome.notifications,
settingBtn = {
	"title" : "設定",
	"iconUrl" : YELLOW
};
chrome.app.runtime.onLaunched.addListener(logInOut);
function logInOut() {
	if (status === true) {
		console.log("Out");
		console.log(status);
		var xhr = new XMLHttpRequest();
		xhr.open("get", "http://securelogin.arubanetworks.com/cgi-bin/login?cmd=logout");
		xhr.onload = function () {
			nf.create("main", {
				"type" : "basic",
				"iconUrl" : GREEN,
				"title" : STRING_LOGOUT,
				"message" : STRING_LOGOUT_SUCCESS,
				"buttons" : [settingBtn]
			}, function () {
				status = true;
			});
		}
		xhr.send();
	} else {
		console.log(status);
		chrome.storage.sync.get(["user", "password"], function (data) {
			var post = {
				"user" : data.user,
				"password" : data.password,
				"cmd" : "authenticate",
				"Login" : "繼續"
			};
			nf.create("main", {
				"type" : "basic",
				"iconUrl" : GREEN,
				"title" : STRING_LOGIN,
				"message" : "使用 " + data.user + " 帳號進行登入",
				"buttons" : [settingBtn]
			});
			var xhr = new XMLHttpRequest();
			xhr.open("post", "http://securelogin.arubanetworks.com/auth/index.html/u");
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			xhr.onload = function () {
				var hash = decodeURI(new URL(xhr.responseURL).search).replace(/^\?/, "").split("="),
				nfOption, result = "";
				switch (hash.errmsg = hash[1]) {
				case LOGIN_SUCCESS:
					result = "loginSuccess";
					nfOption = {
						"type" : "basic",
						"iconUrl" : GREEN,
						"title" : STRING_LOGIN_SUCCESS,
						"message" : STRING_MSG_LOGIN_SUCCESS
					};
					status = false;
					break;
				case LOGIN_WRONG_PASSWORD:
					result = "loginError";
					nfOption = {
						"type" : "basic",
						"iconUrl" : RED,
						"title" : STRING_LOGIN_FAILED,
						"message" : STRING_MSG_WRONG_PASSWORD,
						"buttons" : [settingBtn]
					};
					break;
				case LOGIN_NO_INFORMATION:
					result = "loginError";
					nfOption = {
						"type" : "basic",
						"iconUrl" : RED,
						"title" : STRING_LOGIN_FAILED,
						"message" : "",
						"buttons" : [settingBtn]
					};
					break;
				case ONLY_ONE_USER:
					result = "loginError";
					nfOption = {
						"type" : "basic",
						"iconUrl" : RED,
						"title" : STRING_LOGIN_FAILED,
						"message" : STRING_MSG_ONLY_ONE_USER,
						"buttons" : [settingBtn]
					};
					break;
				}
				nf.create(result, nfOption, function () {});
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
	}
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
	if (nfID == "main" || nfID == "loginError" && btnID === 0) {
		var CreateWindowOptions = ((chromeVersion >= 35) ? {
			"resizable" : false,
			"innerBounds" : {
				"width" : 150,
				"minWidth" : 100,
				"maxWidth" : 400,
				"height" : 200,
				"minHeight" : 200,
				"maxHeight" : 300
			}
		}
			 : {
			"resizable" : false,
			"bounds" : {
				"width" : 150,
				"height" : 200
			},
			"minWidth" : 100,
			"maxWidth" : 400,
			"minHeight" : 200,
			"maxHeight" : 300
		});
		chrome.app.window.create("setting.html", CreateWindowOptions);
	}
});
