@echo off
chcp 65001 > nul
cd /d "%~dp0"

python crawler.py

git add jobs_data.js
git commit -m "daily update %date%"
git push
