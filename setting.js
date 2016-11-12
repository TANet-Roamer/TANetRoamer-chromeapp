const form = document.forms[0],
  nf = chrome.notifications,
  BLUE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYPj/HwADAgH/OSkZvgAAAABJRU5ErkJggg==';

form.onsubmit = function(e) {
  e.preventDefault();
  console.log(e);
  chrome.storage.sync.set({
    school_place: e.target.querySelector('#school_place').value,
    school_studing: e.target.querySelector('#school_studing').value,
    user: e.target.querySelector('#account').value,
    password: e.target.querySelector('#pwd').value,
    autologin: e.target.querySelector('#autologin').checked
  }, function(result) {
    console.log(result);
    if (!chrome.runtime.lastError) {
      nf.create('settingFinish', {
        type: 'basic',
        iconUrl: BLUE,
        title: '設定成功',
        message: '設定成功'
      });
      window.close();
    } else {
      nf.create('settingFinish', {
        type: 'basic',
        iconUrl: BLUE,
        title: '設定失敗',
        message: '設定失敗: ' + chrome.runtime.lastError
      });
    }
  });
};

var errorHandler = function(e) {
  console.error(e)
};

chrome.runtime.getPackageDirectoryEntry(function(root) {
  root.getFile("schools.json", {}, function(fileEntry) {
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        var schools = JSON.parse(this.result);
        var school_place = form.querySelector('[name=school_place]');
        var school_studing = form.querySelector('[name=school_studing]');
        for (var i in schools) {
          var ele = document.createElement('option');
          ele.value = schools[i].id;
          ele.innerText = schools[i].name;
          school_place.add(ele.cloneNode(true));
          school_studing.add(ele.cloneNode(true));
        }
        syncInfo();
      };
      reader.readAsText(file);
    }, errorHandler);
  }, errorHandler);
});

function syncInfo() {
  chrome.storage.sync.get(['school_place', 'school_studing', 'user', 'password', 'autologin'], function(data) {
    var targets = form.querySelectorAll('[name]');
    targets[0].querySelector('[value="' + data.school_place + '"]').selected = true;
    targets[1].querySelector('[value="' + data.school_studing + '"]').selected = true;
    targets[2].value = data.user;
    targets[3].value = data.password;
    targets[4].checked = data.password;
  });
}
