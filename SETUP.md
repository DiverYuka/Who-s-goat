# NBA GOAT 排名工具 - 安裝與運行指南

## 前置需求

- **Node.js**：版本 18.0.0 或更高
- **npm** 或 **yarn**：Node.js 包管理器

## 安裝步驟

### 1. 進入項目目錄
```bash
cd d:\code\2025\goat
```

### 2. 安裝依賴
```bash
npm install
```

這將安裝所有必要的依賴包：
- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS
- Recharts（用於圖表）

### 3. 啟動開發服務器
```bash
npm run dev
```

應用將自動在瀏覽器中打開，默認地址為 `http://localhost:5173`

## 開發命令

| 命令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發服務器，支持熱更新 |
| `npm run build` | 構建生產版本（dist 目錄） |
| `npm run preview` | 預覽生產構建 |
| `npm run lint` | 運行 ESLint 檢查 |

## 生產部署

### 構建生產版本
```bash
npm run build
```

構建後的文件位於 `dist/` 目錄，可直接部署到任何靜態托管服務：
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Azure Static Web Apps**
- 任何支持 SPA 的 Web 服務器

### 本地測試構建
```bash
npm run preview
```

## 常見問題

### Q: 無法連接到 localhost:5173
**A:** 
- 檢查端口是否被占用
- 修改 `vite.config.ts` 中的端口號
- 確認防火牆設置

### Q: 依賴安裝失敗
**A:**
```bash
# 清除 npm 緩存
npm cache clean --force

# 刪除 node_modules 和 package-lock.json
rm -r node_modules package-lock.json

# 重新安裝
npm install
```

### Q: 修改代碼後頁面未更新
**A:**
- Vite 支持熱模塊更新 (HMR)
- 確保保存文件
- 在瀏覽器中手動刷新（Ctrl+F5）

## 項目文件說明

```
nba-goat/
├── src/
│   ├── components/          # React 組件
│   ├── hooks/              # 自定義 Hooks
│   ├── data/               # JSON 數據
│   ├── types/              # TypeScript 類型定義
│   ├── App.tsx             # 主應用
│   ├── main.tsx            # 入口點
│   └── index.css           # 全局樣式
├── index.html              # HTML 模板
├── package.json            # 依賴管理
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # Tailwind CSS 配置
└── postcss.config.js       # PostCSS 配置
```

## 擴展功能

### 添加新球員
編輯 `src/data/players.json`，按以下格式添加：

```json
{
  "id": "unique-id",
  "name": "球員名稱",
  "seasons": "進入年-退役年",
  "teams": ["球隊代碼", ...],
  "photo_url": "頭像URL",
  "honors": { ... },
  "career_stats": { ... },
  "advanced": { ... },
  "team_records": { ... }
}
```

### 修改預設權重
編輯 `src/App.tsx` 中的 `DEFAULT_WEIGHTS` 對象

### 自定義樣式
修改 `src/index.css` 或 `tailwind.config.js`

## 性能優化

應用已包含以下優化：
- ✅ React 18 自動批處理
- ✅ Recharts 按需加載
- ✅ Tailwind CSS 樹搖優化（生產構建）
- ✅ 代碼分割（通過 Vite）

## 故障排除

### 構建失敗
```bash
# 檢查 TypeScript 類型
npx tsc --noEmit

# 查看詳細錯誤
npm run build -- --debug
```

### 內存溢出（大型項目）
```bash
# 增加 Node 內存限制
set NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

## 支持

遇到問題？
1. 檢查 [Vite 文檔](https://vitejs.dev/)
2. 查閱 [React 官方文檔](https://react.dev/)
3. 參考 [Tailwind CSS 文檔](https://tailwindcss.com/)

---

**祝您使用愉快！** 🏀
