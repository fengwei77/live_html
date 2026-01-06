# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個靜態網頁專案，使用純 HTML、CSS 和 JavaScript 建置。所有檔案內容均使用繁體中文。

## 專案結構

```
live_html/
├── index.html       # 主要 HTML 頁面
├── css/
│   └── style.css    # 主要樣式表
├── js/
│   └── main.js      # 主要 JavaScript 檔案
└── img/             # 圖片資源目錄
```

## 開發指南

### 語言與編碼
- 所有檔案使用 UTF-8 編碼
- HTML 設定 `lang="zh-Hant"` 屬性
- 所有使用者可見的內容必須使用繁體中文
- 程式碼註解也使用繁體中文

### 檔案組織
- HTML 檔案放在專案根目錄
- 所有 CSS 檔案放在 `css/` 目錄
- 所有 JavaScript 檔案放在 `js/` 目錄
- 圖片資源放在 `img/` 目錄

### 樣式慣例
- 使用 `Microsoft JhengHei`（微軟正黑體）作為主要字體
- CSS 選擇器命名使用連字號分隔（kebab-case）
- 響應式設計斷點設為 768px

### JavaScript 慣例
- 使用 `DOMContentLoaded` 事件確保 DOM 載入完成後執行
- 函式名稱使用駝峰式命名（camelCase）
- 將功能模組化，使用獨立函式處理不同功能

### 本地開發
由於這是靜態網頁專案，您可以：
1. 直接在瀏覽器中開啟 `index.html` 檔案
2. 使用 Laragon 或其他本地伺服器
3. 使用 VS Code 的 Live Server 擴充功能
