var form = document.forms[0],
nf = chrome.notifications,
blue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYPj/HwADAgH/OSkZvgAAAABJRU5ErkJggg==";

form.onsubmit = function (e) {
	e.preventDefault();
	console.log(e);
	var user = e.target[0].name;
	var password = e.target[1].name;
	chrome.storage.sync.set({
		user : e.target[0].value,
		password : e.target[1].value
	}, function (result) {
    console.log(result);
    if(!chrome.runtime.lastError) {
      nf.create("settingFinish", {
        "type" : "basic",
        "iconUrl" : blue,
        "title" : "設定成功",
        "message" : "設定成功"
      });
      window.close();
    } else {
      nf.create("settingFinish", {
        "type" : "basic",
        "iconUrl" : blue,
        "title" : "設定失敗",
        "message" : "設定失敗: " + chrome.runtime.lastError
      });
    }
	});
};
chrome.storage.sync.get(["user", "password"], function (data) {
	var targets = form.querySelectorAll("[name]");
	targets[0].value = data.user;
	targets[1].value = data.password;
});

