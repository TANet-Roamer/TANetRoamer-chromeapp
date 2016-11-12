# TANet Roamer
https://chrome.google.com/webstore/detail/tanet-roamer/oholmaopjilhledjkmfpolbbjoacmcak?hl=zh-TW

## 宗旨
以最方便的操作流程，取得全台灣的 TANetRoaming WIFI 的漫遊認證。

## 使用說明
一鍵登入校園 WI-FI 的 Chrome APP，目前測試中。

## 特色
 - 記憶帳號密碼，存於 Google 帳戶，可跨裝置。
 - 一鍵登入校園 WI-FI ，方便快速。

## 適用學校
 - 國立彰化師範大學
 - 國立中興大學
 - 國立中央大學
 - (其他校園待測試)

## 開發

### schools.json

```javascript
[{
  "id" : "0015", // 學校代碼，依照 https://ulist.moe.gov.tw/ 公布資訊為主
  "name" : "國立彰化師範大學", // 學校名稱
  "url" : "http://securelogin.arubanetworks.com/auth/index.html/u", // 登入 API 網址
  "data" : { // 登入資訊設定，視學校 API 而有所不同，此為彰師大設定。
    "user" : "%u", // 值為 '%u'，指的是帳號
    "password" : "%p", //值為 '%p'，指的是密碼
    "cmd" : "authenticate",
    "Login" : "繼續"
  }
}]
```
