#!/usr/bin/env bash
# 回報「完成／已上線」之前必跑。任何一項 FAIL 就不能用「完成」「已上線」等字眼。
# 只檢查機器能判定的事；需求本身是否做到，仍須依 CLAUDE.md「回報前檢查表」逐條附證據。
set -u
cd "$(dirname "$0")/.."

fail=0
pass() { printf 'PASS  %s\n' "$1"; }
bad()  { printf 'FAIL  %s\n' "$1"; fail=1; }

if [ -z "$(git status --porcelain)" ]; then
  pass "工作樹沒有未提交的改動"
else
  bad "工作樹有未提交的改動（改了沒 commit 的東西不會上線）："
  git status --short
fi

if git fetch -q origin main 2>/dev/null; then
  if git merge-base --is-ancestor HEAD origin/main; then
    pass "HEAD $(git rev-parse --short HEAD) 已在 origin/main（正式站來源）"
  else
    bad "HEAD $(git rev-parse --short HEAD) 不在 origin/main：只在分支上，正式站看不到"
  fi
else
  bad "無法 fetch origin/main，無法確認是否已上 main"
fi

# 建置輸出是可重現的：重跑 build 後 git 若出現差異，代表原始碼改了卻沒重新建置／沒提交建置結果。
if npm run build >/dev/null 2>&1; then
  stale="$(git status --porcelain -- '*tailwind.css')"
  if [ -z "$stale" ]; then
    pass "npm run build 後 tailwind.css 沒有差異（建置結果已提交）"
  else
    bad "重新 build 後 tailwind.css 有差異，先 commit 建置結果："
    printf '%s\n' "$stale"
  fi
else
  bad "npm run build 失敗"
fi

echo
echo "main 上實際存在的版本資料夾（回報「所有版本」時逐一對照這份清單）："
git ls-tree -d --name-only origin/main 2>/dev/null | grep -E '^v[0-9]' | while read -r v; do
  subs="$(git ls-tree -d --name-only "origin/main:$v" 2>/dev/null | tr '\n' ' ')"
  printf '  %s/  %s\n' "$v" "$subs"
done

echo
if [ "$fail" -eq 0 ]; then
  echo "機器檢查全數通過。仍須在回報中逐條列出：使用者原話 → 證據 → 驗證範圍 → 未驗證項目。"
else
  echo "有 FAIL：回報只能寫「進行中／未上線」，並說明哪一項沒過。"
fi
exit "$fail"
