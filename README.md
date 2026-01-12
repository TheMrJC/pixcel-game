# Pixel Art Quiz Game (React + Google Sheets)

這是一個復古像素風格的網頁問答遊戲。遊戲前端使用 React + Vite 構建，後端使用 Google Apps Script (GAS) 連結 Google Sheets 作為資料庫（題目來源與成績紀錄）。

![Demo](./demo.gif) <!-- 若有 Demo 圖可補上 -->

## 🚀 專案安裝與執行

### 1. 環境準備
請確保電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)。

### 2. 安裝套件
在本專案目錄下開啟終端機 (Terminal)，執行：
```bash
npm install
```

### 3. 啟動開發伺服器
執行以下指令開啟遊戲：
```bash
npm run dev
```
畫面將開啟於 `http://localhost:5173`。

---

## 📊 Google Sheets (資料庫) 設定

請依照以下欄位格式建立一個新的 Google Sheet：

### 工作表 1: 命名為「`題目`」
這是題庫來源。第一列 (Row 1) 為標題，請**嚴格依照順序**建立：

| 行 | 欄位名稱 | 說明 |
| :--- | :--- | :--- |
| A | ID | 題目編號 (可以用數字 1, 2, 3...) |
| B | Question | 題目內容 |
| C | Option A | 選項 A 內容 |
| D | Option B | 選項 B 內容 |
| E | Option C | 選項 C 內容 |
| F | Option D | 選項 D 內容 |
| G | Answer | 正確答案 (填 A, B, C 或 D) |

### 工作表 2: 命名為「`回答`」
這是紀錄玩家成績的地方。第一列 (Row 1) 為標題：

| 行 | 欄位名稱 | 說明 |
| :--- | :--- | :--- |
| A | ID | 玩家輸入的 ID |
| B | PlayCount | 遊玩次數 |
| C | TotalScore | 累積總分 |
| D | MaxScore | 下最佳成績 |
| E | FirstClearScore | 第一次通關分數 |
| F | AttemptsToClear | 通關所需次數 |
| G | LastPlayedTime | 最近遊玩時間 |

---

## 🛠 Google Apps Script (後端) 設定

1. 在你的 Google Sheet 中，點擊上方選單 **「擴充功能 (Extensions)」** > **「Apps Script」**。
2. 將專案中 `google-apps-script/Code.gs` 的完整程式碼複製，貼上並覆蓋 Apps Script 編輯器中的內容。
3. 點擊磁碟片圖示 **「儲存」**。

### 部署為網頁應用程式 (Web App)
1. 點擊右上角的 **「部署 (Deploy)」** > **「新增部署 (New deployment)」**。
2. 點擊左側齒輪圖示，選擇 **「網頁應用程式 (Web app)」**。
3. 設定如下：
    - **說明 (Description)**: (可留空)
    - **執行身份 (Execute as)**: **`我 (Me)`** (這很重要！)
    - **誰可以存取 (Who has access)**: **`所有人 (Anyone)`** (這也很重要，確保前端能讀取)。
4. 點擊 **「部署 (Deploy)」**。
5. 複製產生的 **「網頁應用程式網址 (Web App URL)」** (以 `https://script.google.com/...` 開頭)。

### 連結前端
1. 在專案根目錄，將 `.env.example` 複製並重新命名為 `.env`。
2. 編輯 `.env` 檔案，填入你的網址：

```env
VITE_GOOGLE_APP_SCRIPT_URL=你的_WEB_APP_URL
VITE_PASS_THRESHOLD=3
VITE_QUESTION_COUNT=5
```
3. **重新啟動** `npm run dev` 讓設定生效。

---

## 🤖 測試題庫：生成式 AI 基礎知識 (10題)

你可以直接複製下表內容貼到 Google Sheets 的 **「題目」** 工作表 (從 A2 儲存格開始貼上)。

| ID | Question | Option A | Option B | Option C | Option D | Answer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | ChatGPT 是由哪家公司開發的？ | Google | Microsoft | OpenAI | Meta | C |
| 2 | 生成式 AI (Generative AI) 的主要功能是什麼？ | 只能分析數據 | 創造新的內容 (如文字、圖片) | 搜尋網路資料 | 管理資料庫 | B |
| 3 | 下列何者著名的 AI 繪圖工具？ | Midjourney | Excel | PowerPoint | Word | A |
| 4 | LLM 在 AI 領域中代表什麼？ | Large Language Model | Long Learning Machine | Local Logic Module | Little Language Mode | A |
| 5 | 生成式 AI 常見的「幻覺 (Hallucination)」是指什麼？ | AI 拒絕回答問題 | AI 產生自信但錯誤的資訊 | AI 運算速度變慢 | AI 自動關機 | B |
| 6 | Transformer 模型架構最初是為了處理什麼任務而提出的？ | 圖像識別 | 機器翻譯 | 語音合成 | 影片生成 | B |
| 7 | 在 Prompt Engineering 中，「Few-shot prompting」的意思是？ | 給模型少量範例讓它學習 | 不給任何提示 | 給模型成千上萬的資料 | 重新訓練模型 | A |
| 8 | 下列哪一個不是生成式 AI 的應用場景？ | 撰寫行銷文案 | 修改程式碼 Bug | 自動駕駛的即時路況判斷 | 生成虛擬頭像 | C |
| 9 | 什麼是 RAG (Retrieval-Augmented Generation)？ | 一種繪圖技術 | 一種檢索增強生成技術 | 一種硬體加速器 | 一種作業系統 | B |
| 10 | 下列何者是 Meta 開發的開源大型語言模型？ | GPT-4 | Claude | Llama | Gemini | C |

---

## 🎮 操作說明
1. 輸入任意 **Player ID** (例如: `SAM001`)。
2. 點擊 **START** 開始挑戰。
3. 答對題目，畫面的 Pixel Boss 會震動；答錯則會變灰。
4. 完成所有題目後，成績會自動上傳至 Google Sheets。

---

## ☁️ 自動部署到 GitHub Pages

本專案已設定好 GitHub Actions，只要將程式碼上傳到 GitHub，並設定好 Secrets，就能自動部署。

### 步驟 1: 上傳到 GitHub
1.  在 GitHub 建立一個新的 Repository。
2.  將本專案 push 上去：
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/你的帳號/你的Repo.git
    git push -u origin main
    ```

### 步驟 2: 設定 Secrets
由於 `.env` 檔案不會被上傳（為了安全），你需要將變數設定到 GitHub：

1.  進入你的 GitHub Repo 頁面。
2.  點選 **Settings** > **Secrets and variables** > **Actions**。
3.  點擊 **New repository secret**，新增以下變數（參考 `.env.example`）：
    -   Name: `VITE_GOOGLE_APP_SCRIPT_URL`
    -   Value: 你的 Google Web App URL
4.  (選填) 如果你有改預設值，也可以新增：
    -   `VITE_PASS_THRESHOLD`
    -   `VITE_QUESTION_COUNT`

### 步驟 3: 開啟 Pages 功能
1.  點選 **Settings** > **Pages**。
2.  在 **Build and deployment** 下的 **Source**，確認選擇 **GitHub Actions** (或是等待 Action 跑完後自動偵測)。
    *   *注意：新的 Actions 流程通常不需要手動選 Branch，只需確保 Source 是 GitHub Actions 即可。*
3.  等待 Actions 執行完畢 (約 2-3 分鐘)，你的遊戲網址就會出現在這裡！

