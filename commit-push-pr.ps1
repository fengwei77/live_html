$ErrorActionPreference = "Stop"
Write-Host "🚀 開始執行 Commit-Push-PR 流程..." -ForegroundColor Cyan

# 1. 環境檢查
Write-Host "`n📋 檢查 Git 環境..." -ForegroundColor Yellow
try {
    $isRepo = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "目前目錄不是 Git 儲存庫"
    }
    Write-Host "✔ 確認為 Git 儲存庫" -ForegroundColor Green
} catch {
    Write-Host "❌ 錯誤: $_" -ForegroundColor Red
    exit 1
}

# 檢查是否已有任何 commit
$hasCommits = $null
try {
    $hasCommits = git rev-parse HEAD 2>$null
    if ($LASTEXITCODE -eq 0) {
        $hasCommits = $true
    } else {
        $hasCommits = $false
    }
} catch {
    $hasCommits = $false
}

# 2. 暫存所有變更
Write-Host "`n📦 暫存所有變更..." -ForegroundColor Yellow
git add -A
Write-Host "✔ 已暫存所有變更" -ForegroundColor Green

# 3. 提交邏輯
Write-Host "`n💾 執行提交..." -ForegroundColor Yellow
$commitMsg = "第一次push"

if (-not $hasCommits) {
    # 情況 A: 全新專案（首次 commit）
    Write-Host "📝 偵測到全新專案，使用 'Initial commit'" -ForegroundColor Cyan
    git commit -m "Initial commit"
    Write-Host "✔ 已建立初始提交" -ForegroundColor Green
} else {
    # 情況 B: 已有 commit 的專案
    Write-Host "📊 目前變更狀態:" -ForegroundColor Cyan
    git status --short

    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = Read-Host "📝 請輸入 Commit 訊息 (按 Enter 使用預設值 'Update')"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "Update"
        }
    }

    git commit -m $commitMsg
    Write-Host "✔ 提交成功: $commitMsg" -ForegroundColor Green
}

# 4. 推送邏輯
Write-Host "`n🚀 執行推送..." -ForegroundColor Yellow
$branch = git branch --show-current
Write-Host "📍 目前分支: $branch" -ForegroundColor Cyan

# 檢查是否有 upstream
$hasUpstream = $false
try {
    $upstream = git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>$null
    if ($LASTEXITCODE -eq 0) {
        $hasUpstream = $true
    }
} catch {
    $hasUpstream = $false
}

if ($hasUpstream) {
    Write-Host "📡 偵測到已設定 upstream，執行 git push" -ForegroundColor Cyan
    git push
    Write-Host "✔ 推送完成" -ForegroundColor Green
} else {
    Write-Host "📡 偵測到未設定 upstream，執行 git push -u origin $branch" -ForegroundColor Cyan
    git push -u origin $branch
    Write-Host "✔ 推送完成並已設定 upstream" -ForegroundColor Green
}

# 5. 建立 PR
Write-Host "`n🔀 準備建立 Pull Request..." -ForegroundColor Yellow

# 檢查是否有 gh CLI
try {
    $ghVersion = gh --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub CLI 未安裝"
    }
    Write-Host "✔ GitHub CLI 已安裝" -ForegroundColor Green
} catch {
    Write-Host "❌ 錯誤: 未安裝 GitHub CLI (gh)" -ForegroundColor Red
    Write-Host "💡 請先安裝 GitHub CLI: https://cli.github.com/" -ForegroundColor Cyan
    exit 1
}

# 檢查是否已登入 GitHub
try {
    $authStatus = gh auth status 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "未登入 GitHub"
    }
} catch {
    Write-Host "❌ 錯誤: 尚未登入 GitHub" -ForegroundColor Red
    Write-Host "💡 請先執行: gh auth login" -ForegroundColor Cyan
    exit 1
}

# 檢查是否已有 PR
$existingPr = gh pr list --head $branch --json title --jq '. | length' 2>$null
if ($existingPr -gt 0) {
    Write-Host "⚠️  分支 $branch 已有開啟的 Pull Request" -ForegroundColor Yellow
    $prUrl = gh pr view --json url --jq '.url'
    Write-Host "🔗 PR 連結: $prUrl" -ForegroundColor Cyan
} else {
    Write-Host "📝 在瀏覽器中開啟以建立 Pull Request..." -ForegroundColor Cyan
    gh pr create --web
    Write-Host "✔ 已在瀏覽器中開啟 PR 頁面" -ForegroundColor Green
}

Write-Host "`n✨ Commit-Push-PR 流程完成！" -ForegroundColor Green
