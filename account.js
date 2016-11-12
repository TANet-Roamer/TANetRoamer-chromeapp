class Account {
  constructor(option) {
    /* initial*/
    this._id = option.id;
    this._pwd = option.pwd;
    this._apiUrl = option.apiUrl;
    this._apiDataPattern = option.apiDataPattern;
    this._apiData = {};

    /* 整理 post data */
    this._apiData = Object.assign({}, this._apiDataPattern)
    for (let i in this._apiDataPattern) {
      if (this._apiDataPattern[i] === '%u')
        this._apiData[i] = this._id;
      if (this._apiDataPattern[i] === '%p')
        this._apiData[i] = this._pwd;
    }
  }

  /* 使用 API 登入。 */
  login() {
    const searchParams = new URLSearchParams();
    for (let i in this._apiData)
      searchParams.append(i, this._apiData[i]);
    return fetch(this._apiUrl, {
        method: 'POST',
        body: searchParams,
      })
      .then((res) => {
        const hash = decodeURI(new URL(res.url).search).replace(/^\?/, '').split('=');

        switch (hash.errmsg = hash[1]) {
          case LOGIN_SUCCESS:
            return {
              isSuccess: true,
              message: STRING_MSG_LOGIN_SUCCESS,
            };
            break;
          case LOGIN_WRONG_PASSWORD:
            return {
              isSuccess: false,
              message: STRING_MSG_WRONG_PASSWORD,
            };
            break;
          case LOGIN_NO_INFORMATION:
            return {
              isSuccess: false,
              message: '',
            };
            break;
          case ONLY_ONE_USER:
            return {
              isSuccess: false,
              message: STRING_MSG_ONLY_ONE_USER,
            };
            break;
        }
      }, (res) => {
        return {
          isSuccess: false,
          message: STRING_MSG_WRONG_SSID,
        }
      });
  }
}
