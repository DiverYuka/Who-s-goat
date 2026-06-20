# NBA GOAT 排名工具

一個互動式 NBA 球員排名應用，讓您透過調整各項榮譽的加權分數，動態排出史上最偉大的 NBA 球員。

## 功能特性

### 📊 動態排名
- **實時計分**：調整加權滑桿即時更新排名
- **Min-Max 正規化**：確保各維度數據的公平比較
- **多維度評分**：結合個人獎項、生涯數據、進階統計等

### ⚙️ 加權調整面板
分類管理超過 25 項加權指標：
- **冠軍成就**：總冠軍、FMVP、季後賽出場次、總決賽出場次
- **個人獎項**：MVP、最佳防守球員、年度新秀、各項王數
- **入選榮譽**：全明星、最佳一陣、最佳防守一陣等
- **個人數據**：場均得分、助攻、籃板、抄截、火鍋
- **進階統計**：PER、Win Shares、VORP、BPM
- **球隊貢獻**：例行賽勝率、季後賽 Win Shares

### 🎯 預設方案
快速切換三種預設權重組合：
- **冠軍至上**：強調總冠軍、FMVP 等冠軍榮譽
- **個人數據流**：強調場均得分、進階統計等數據
- **均衡模式**：平衡各維度的預設權重

### 🔍 球員管理
- **搜尋功能**：按名稱快速查找球員
- **年代篩選**：按出生年代（1950s-2020s）篩選
- **多種排序**：按 GOAT 分數、總冠軍、MVP 等排序

### 💾 資料匯出
- **CSV 匯出**：將排名結果導出為 CSV 檔案
- **分數明細**：詳細展示每位球員的分數組成

### 🎨 球員對比
- **雷達圖**：視覺化比較 2-3 位球員的多維度表現
- **卡片展開**：查看詳細的生涯數據和榮譽

## 技術棧

- **前端框架**：React 18 + TypeScript
- **建置工具**：Vite
- **樣式**：Tailwind CSS
- **圖表**：Recharts
- **資料**：內建 25+ 位代表性球星數據

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 構建生產版本
npm run build

# 預覽生產構建
npm run preview
```

## 專案結構

```
src/
├── components/
│   ├── WeightPanel.tsx       # 左側加權調整面板
│   ├── PlayerCard.tsx        # 球員排名卡片
│   ├── LeaderBoard.tsx       # 排行榜主體
│   ├── RadarChart.tsx        # 球員對比雷達圖
│   └── PresetButtons.tsx     # 快速預設切換
├── hooks/
│   └── useGoatScore.ts       # 計分邏輯核心
├── data/
│   └── players.json          # 球員資料集
├── types/
│   └── index.ts              # TypeScript 型別定義
├── App.tsx                   # 主應用程式
└── index.css                 # 全局樣式
```

## 核心算法

### GOAT 分數計算公式

1. **正規化**：對每個維度進行 Min-Max 正規化
   ```
   normalized = (value - min) / (max - min)
   ```

2. **加權**：乘以對應的權重值
   ```
   weighted = normalized × weight
   ```

3. **聚合**：計算所有維度的加權平均值，標準化至 0-1000 分
   ```
   score = (Σ weighted / Σ weights) × 1000
   ```

### 特殊處理
- **空值處理**：進階數據缺失時自動排除，不影響評分
- **動態正規化**：基於全體球員集合，不是個別計算
- **即時更新**：任何權重變化即時重新計算排名

## 資料說明

### 內建球星（25+ 位）
涵蓋各個年代的傳奇球星：
- **1950-1970s**：Bill Russell, Wilt Chamberlain, Kareem Abdul-Jabbar
- **1980-1990s**：Michael Jordan, Larry Bird, Magic Johnson, Tim Duncan
- **2000-2010s**：Kobe Bryant, Shaquille O'Neal, LeBron James
- **2010-2020s**：Stephen Curry, Kevin Durant, Giannis Antetokounmpo

### 資料欄位
每位球員包含：
- 基本信息：名稱、效力年份、球隊
- 榮譽數據：總冠軍、FMVP、MVP 等 13 項
- 生涯統計：9 項主要統計指標
- 進階統計：PER、Win Shares、VORP、BPM 等
- 球隊成績：勝率、季後賽紀錄等

## 使用建議

### 最佳實踐
1. **逐步調整**：一次調整一個權重，觀察排名變化
2. **對比分析**：使用不同預設方案對比排名差異
3. **數據驗證**：展開球員卡片檢查詳細數據

### 權重調整技巧
- 設定為 0：完全忽視該維度
- 設定為 50：中等重視程度
- 設定為 100：最高重視程度

## 瀏覽器支持

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+

## 許可

MIT License

---

**NBA GOAT 排名工具** © 2025 | 用數據找出你心目中的籃球之神
