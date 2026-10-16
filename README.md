# 誰是山羊？THE GOAT LAB

NBA GOAT 互動排名工具。本分支為 Vibe Coding 作業的單檔版本；原先 React 專案保留在 main。

## 開啟方式
直接下載並開啟 `index.html`，不需 npm、框架、API、CDN 或其他檔案。

## 互動功能
- 六項權重與四組觀點，即時計算排名。
- 中英文與別名搜尋、依進入 NBA 年代篩選。
- 雙人 SVG 雷達比較與原始數據表。
- 球員計分明細、設定自動保存、分享設定網址、CSV 匯出。
- 全零權重、空搜尋、損壞設定與無儲存權限的處理。

固定資料截止：2023–24 球季結束。現役球員資料不自動更新。本作不是官方 GOAT 排名。

完整規格見 [SPEC.md](SPEC.md)。

## GitHub Pages
發布來源使用 `gh-pages` 分支的 `/ (root)`。網站入口是 `index.html`。

## AI 協作與修改
以自己原有的「誰是山羊」想法為基礎，先寫 SPEC.md，再由 ChatGPT 協助產生 HTML、CSS 與 JavaScript。本次重新整理為 12 位球員、6 個指標，修正原資料的明顯錯誤，加入可解釋分數、固定正規化範圍、全零權重提示、損壞設定保護與離線分享提示。測試用 Node.js 的 vm 與模擬 DOM 驗證實際腳本，共 19 項通過；瀏覽器實測與截圖另行記錄，不以模擬 DOM 代替視覺驗證。

## 資料來源
- https://www.nba.com/news/history-nba-legends
- https://www.nba.com/news/history-mvp-award-winners
- https://www.nba.com/news/history-finals-mvp-award-winners
- https://www.basketball-reference.com/players/

本作使用原生 SVG 與 CSS 產生圖形，沒有外部照片或字型。
