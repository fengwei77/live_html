# Git & GitHub 自動化腳本 (PowerShell)
# 功能：環境檢查、暫存提交、推送、建立 PR

Write-Host "=== Git & GitHub 自動化流程 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 環境檢查 - 是否為 Git 儲存庫
Write-Host "[1/4] 檢查 Git 環境..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    Write-Host "  尚未初始化 Git 儲存庫，執行 git init..." -ForegroundColor Gray
    git init
} else {
    Write-Host "  Git 儲存庫已存在" -ForegroundColor Green
}

# 檢查 Remote 設定
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Warning "  未發現 origin remote"
    Write-Warning "  請稍後手動執行: git remote add origin <你的repository URL>"
} else {
    Write-Host "  Origin remote: $remote" -ForegroundColor Green
}
Write-Host ""

# 2. 暫存與提交
Write-Host "[2/4] 暫存變更..." -ForegroundColor Yellow
git add -A
Write-Host "  已執行 git add -A" -ForegroundColor Green

# 智慧 Commit 判斷
$hasHistory = git rev-parse --verify HEAD 2>$null
if (-not $hasHistory) {
    Write-Host "  偵測到全新專案，使用 'Initial commit'" -ForegroundColor Green
    git commit -m "Initial commit"
} else {
    $msg = Read-Host "  請輸入 Commit 訊息"
    if ([string]::IsNullOrWhiteSpace($msg)) {
        Write-Warning "  未輸入訊息，使用預設訊息"
        $msg = "Update changes"
    }
    git commit -m $msg
}
Write-Host ""

# 3. 推送
Write-Host "[3/4] 推送至遠端..." -ForegroundColor Yellow
$branch = git branch --show-current
Write-Host "  當前分支: $branch" -ForegroundColor Green

if ($remote) {
    git push -u origin $branch
    Write-Host "  推送完成！" -ForegroundColor Green
} else {
    Write-Warning "  跳過推送（未設定 origin remote）"
}
Write-Host ""

# 4. 建立 PR
Write-Host "[4/4] 建立Pull Request..." -ForegroundColor Yellow
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if ($ghInstalled) {
    Write-Host "  偵測到 GitHub CLI，開啟瀏覽器建立 PR..." -ForegroundColor Green
    gh pr create --web
} else {
    Write-Warning "  未安裝 GitHub CLI (gh)"
    Write-Host "  請手動前往以下連結建立 PR：" -ForegroundColor Cyan

    if ($remote -and $remote -match 'github\.com[/:]([^/]+)/([^/]+?)(\.git)?$') {
        $user = $matches[1]
        $repo = $matches[2]
        $prUrl = "https://github.com/$user/$repo/pull/new/$branch"
        Write-Host "  $prUrl" -ForegroundColor White
    } else {
        Write-Host "  https://github.com/<使用者>/<儲存庫>/pull/new/$branch" -ForegroundColor White
    }

    Write-Host ""
    Write-Host "  提示：安裝 GitHub CLI 可自動化此步驟：" -ForegroundColor Gray
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== 流程完成 ===" -ForegroundColor Cyan
