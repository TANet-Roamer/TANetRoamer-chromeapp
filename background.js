const
  nf = chrome.notifications,
  errorHandler = (e) => {
    console.error(e)
  },
  settingBtn = {
    title: '設定',
    iconUrl: YELLOW
  };
let user = 'user',
  password = 'password',
  status = false,
  schools;

chrome.runtime.getPackageDirectoryEntry((root) => {
  root.getFile('schools.json', {}, (fileEntry) => {
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        schools = JSON.parse(this.result);
      };
      reader.readAsText(file);
    }, errorHandler);
  }, errorHandler);
});

chrome.app.runtime.onLaunched.addListener(login);

function login() {
  chrome.storage.sync.get(['school_place', 'user', 'password'], (data) => {
    if (!data.user || !data.password || !data.school_place) {
      openSettingPage();
      return;
    }
    const user = data.user,
      password = data.password,
      url = data.school_place.url || 'http://securelogin.arubanetworks.com/auth/index.html/u';
    const cur_school = schools.find(function(e) {
      return e.id === data.school_place;
    });
    const post = cur_school.data || {
      user: user,
      password: password,
      cmd: 'authenticate',
      Login: '繼續'
    };
    /* 資訊設定 */
    for (let i in post) {
      if (post[i] === '%u')
        post[i] = user;
      if (post[i] === '%p')
        post[i] = password;
    }
    if (!cur_school) {
      console.log('找不到此學校');
      return;
    }
    nf.create({
      type: 'basic',
      iconUrl: GREEN,
      title: STRING_LOGIN,
      message: '使用 ' + user + ' 帳號\n登入' + ((!cur_school.url) ? '\n此校園尚無專屬設定檔，使用預設設定檔登入。' : cur_school.name),
      buttons: [settingBtn]
    });
    let nfOption = {
      type: 'basic',
      iconUrl: RED,
      title: STRING_LOGIN_FAILED,
      message: ''
    };
    /* 使用 API 登入。 */
    const searchParams = new URLSearchParams();
    for (let i in post)
      searchParams.append(i, post[i]);
    fetch(url, {
        method: 'POST',
        body: searchParams,
      })
      .then((res) => {
        const hash = decodeURI(new URL(res.url).search).replace(/^\?/, '').split('=');
        switch (hash.errmsg = hash[1]) {
          case LOGIN_SUCCESS:
            nfOption = Object.assign(nfOption, {
              iconUrl: GREEN,
              title: STRING_LOGIN_SUCCESS,
              message: STRING_MSG_LOGIN_SUCCESS
            });
            break;
          case LOGIN_WRONG_PASSWORD:
            nfOption = Object.assign(nfOption, {
              message: STRING_MSG_WRONG_PASSWORD,
              buttons: [settingBtn]
            });
            break;
          case LOGIN_NO_INFORMATION:
            nfOption = Object.assign(nfOption, {
              buttons: [settingBtn]
            });
            break;
          case ONLY_ONE_USER:
            nfOption = Object.assign(nfOption, {
              message: STRING_MSG_ONLY_ONE_USER,
              buttons: [settingBtn]
            });
            break;
        }
        nf.create(nfOption, function() {});
      }, (res) => {
        nf.create('loginError', Object.assign(nfOption, {
          message: STRING_MSG_WRONG_SSID,
          buttons: [settingBtn]
        }));
      });
  });
};

function isConnect() {
  return new Promise((res, rej) => {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('post', 'https://www.google.com');
      xhr.onload = function() {
        res(true);
      };
      xhr.onerror = function() {};
      xhr.send();
    } catch (e) {
      console.log('asd');
      res(false);
    }
  });
}

function openSettingPage() {
  var CreateWindowOptions = ((chromeVersion >= 35) ? {
    'resizable': false,
    'innerBounds': {
      'width': 150,
      'minWidth': 200,
      'maxWidth': 400,
      'height': 200,
      'minHeight': 350,
      'maxHeight': 400
    }
  } : {
    'resizable': false,
    'bounds': {
      'width': 200,
      'height': 350
    },
    'minWidth': 200,
    'maxWidth': 400,
    'minHeight': 350,
    'maxHeight': 400
  });
  chrome.app.window.create('setting.html', CreateWindowOptions);
}

nf.onButtonClicked.addListener((nfID, btnID) => {
  if (btnID === 0)
    openSettingPage
});
