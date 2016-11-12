(() => {

  const
    nf = chrome.notifications,
    errorHandler = (e) => {
      console.error(e)
    },
    SETTING_BTN = {
      title: '設定',
      iconUrl: YELLOW
    };
  let schools;

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
        url = data.school_place.url || 'http://securelogin.arubanetworks.com/auth/index.html/u',
        cur_school = schools.find((e) => e.id === data.school_place) l
      if (!cur_school) {
        console.log('找不到此學校');
        return;
      }
      const account = new Account({
        id: user,
        pwd: password,
        apiUrl: url,
        apiDataPattern: cur_school.data,
      });
      nf.create({
        type: 'basic',
        iconUrl: GREEN,
        title: STRING_LOGIN,
        message: '使用 ' + user + ' 帳號\n登入' + ((!cur_school.url) ? '\n此校園尚無專屬設定檔，使用預設設定檔登入。' : cur_school.name),
        buttons: [SETTING_BTN],
      });
      /* 登入 */
      account.login()
        .then((status) => {
          nf.create({
            type: 'basic',
            iconUrl: (status.isSuccess) ? GREEN : RED,
            title: (status.isSuccess) ? STRING_LOGIN_SUCCESS : STRING_LOGIN_FAILED,
            message: status.message,
            buttons: (!status.isSuccess) ? [SETTING_BTN] : undefined,
          }, () => {});
        })
    });
  };

  function isConnect() {
    return fetch('https://www.google.com', {
      method: 'POST',
    })
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
})();
