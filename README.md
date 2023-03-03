# 機妍-機車美容官網

> 機車就算是代步工具也應該乾乾淨淨，漂漂亮亮。有些人會DIY，有些人可能因為時間、場地等因素限制，希望交由專業店家處理。目前大多數店家都只有FB/IG，車主只能透過電話/社群服務查詢可預約的時間，所以希望能建立一個形象官網，並提供服務介紹、線上預約等功能。
  
  
## 專案介紹
本作品分為2個專案，分別為：
- [前端畫面（使用者） ＋ 模擬伺服器](https://github.com/yts38n/BlingMotorProject) / [Github Pages](https://yts38n.github.io/BlingMotorProject/)
  
- [後端畫面（店家）](https://github.com/yts38n/BlingMotorProjectAdmin) / [Github Pages](https://yts38n.github.io/BlingMotorProjectAdmin/)
  
> 預設提供 2 組客戶帳號及1組管理員帳號 ***(請勿隨意更改管理員帳號密碼)*** 以供測試。  
測試人員可自行新增客戶帳號。位於 [Render](https://render.com/) 的模擬伺服器，會不定時重啟刪除所有後續添加的資料，恢復為原始狀態。
  
```cmd
客戶帳號 1: testUser01@gmail.com  (密碼: 00000000)  
客戶帳號 2: testUser02@gmail.com  (密碼: 00000000)  
管理員帳號 1: service@blingblingbike.com  (密碼: 00000000)
```
  
  
## 使用技術
- Axios (發送網路請求進行API串接)
- Bootstrap (前端RWD)
- EJS (自訂網頁樣板)
- Gulp (任務管理工具)
- JSON Server (建立模擬伺服器，模擬 RESTful API的運作)
- Node.js (模組化 JSON Server)
- Sass/SCSS (CSS 預處理器，協助修改 Bootstrap 變數及管理自定義 CSS 樣式)
- Swipper (圖片輪播套件)
  
  
## 指令列表
下載完成後，請開啟cmd。__分別以 cd 指令進入以下3個資料夾：__ 
- ***前端(homepage)***  
- ***後端(BlingMotorProjectAdmin)***  
- ***伺服器(mockServer)***
  
```cmd
cd '資料夾位置' :: 輸入 cd(空格) 後可以直接拉動資料夾到cmd
npm install
gulp ::前端 & 後端使用，開啟模擬瀏覽器並監聽相關檔案
npm start ::伺服器使用
```