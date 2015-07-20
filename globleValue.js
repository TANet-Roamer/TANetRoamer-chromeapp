const LOGIN_SUCCESS = undefined,
LOGIN_WRONG_PASSWORD = "Authentication failed",
LOGIN_NO_INFORMATION = "Access denied",
ONLY_ONE_USER = "Only one user login session is allowed",

STRING_LOGOUT = "登出",
STRING_LOGOUT_SUCCESS = "登出成功",
STRING_LOGIN = "登入",
STRING_LOGIN_SUCCESS = "登入成功",
STRING_LOGIN_FAILED = "登入失敗",
STRING_MSG_LOGIN_SUCCESS = "已成功登入TANet網路。",
STRING_MSG_WRONG_PASSWORD = "錯誤的密碼",
STRING_MSG_FAILED = "1. 錯誤的帳號/n2. 已登入",
STRING_MSG_ONLY_ONE_USER = "這個帳號目前正在使用中，請更換帳號。",
STRING_MSG_WRONG_SSID = "您尚未連上TANet Roaming",

RED = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8DwHwAFAAH/VscvDQAAAABJRU5ErkJggg==",
GREEN = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNg+M/wHwAEAQH/rrVV9QAAAABJRU5ErkJggg==",
YELLOW = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4/5/hPwAH/QL+ecrXpAAAAABJRU5ErkJggg==",

chromeVersion = Number(window.navigator.userAgent.match(/Chrome\/\d*/)[0].split("/")[1]);