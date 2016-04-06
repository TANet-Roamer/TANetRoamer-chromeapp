var form = document.forms[0],
nf = chrome.notifications,
blue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYPj/HwADAgH/OSkZvgAAAABJRU5ErkJggg==";

form.onsubmit = function (e) {
	e.preventDefault();
	chrome.storage.sync.set({
		school_current : e.target[0].value,
		school_for : e.target[1].value,
		user : e.target[2].value,
		password : e.target[3].value,
		autologin : e.target[4].checked
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

var errorHandler = function(e) {console.error(e)};

chrome.runtime.getPackageDirectoryEntry(function(root) {
  root.getFile("schools.json", {}, function(fileEntry) {
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        var schools = JSON.parse(this.result);
        var target_current = form.querySelector("[name=school_current]");
        var target_for = form.querySelector("[name=school_for]");
        for(var i in schools) {
          var ele = document.createElement("option");
          ele.value = schools[i].id;
          ele.innerText = schools[i].name;
          target_current.add(ele.cloneNode(true));
          target_for.add(ele.cloneNode(true));
        }
        syncInfo();
      };
      reader.readAsText(file);
    }, errorHandler);
  }, errorHandler);
});

function syncInfo() {
  chrome.storage.sync.get(["school_current", "school_for", "user", "password", "autologin"], function (data) {
    var targets = form.querySelectorAll("[name]");
    targets[0].querySelector('[value="' + data.school_current + '"]').selected = true;
    targets[1].querySelector('[value="' + data.school_for + '"]').selected = true;
    targets[2].value = data.user;
    targets[3].value = data.password;
    targets[4].checked = data.password;
  });
}
