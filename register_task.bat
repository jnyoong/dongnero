@echo off
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════════════╗
echo ║   시니어 취업정보 자동 업데이트 등록         ║
echo ║   매일 오전 9시 자동 실행                    ║
echo ╚══════════════════════════════════════════════╝
echo.

:: 현재 폴더 경로
set TASK_DIR=%~dp0
set TASK_DIR=%TASK_DIR:~0,-1%

:: Python 경로 자동 탐색
for /f "delims=" %%i in ('where python 2^>nul') do (
    set PYTHON_PATH=%%i
    goto :found_python
)
echo [오류] Python을 찾을 수 없습니다.
echo        python.org 에서 Python을 먼저 설치해 주세요.
pause
exit /b 1

:found_python
echo [확인] Python 경로: %PYTHON_PATH%
echo [확인] 스크립트 경로: %TASK_DIR%\crawler.py
echo.

:: 기존 작업 삭제 (있으면)
schtasks /delete /tn "시니어취업정보업데이트" /f > nul 2>&1

:: 작업 스케줄러 등록 — 매일 09:00
schtasks /create ^
  /tn "시니어취업정보업데이트" ^
  /tr "\"%PYTHON_PATH%\" \"%TASK_DIR%\crawler.py\"" ^
  /sc DAILY ^
  /st 09:00 ^
  /ru "%USERNAME%" ^
  /rl HIGHEST ^
  /f

if %errorlevel% equ 0 (
    echo.
    echo ✔ 등록 완료! 매일 오전 9시에 자동으로 업데이트됩니다.
    echo.
    echo   작업 이름 : 시니어취업정보업데이트
    echo   실행 시각 : 매일 오전 9:00
    echo   실행 파일 : %TASK_DIR%\crawler.py
    echo.
    echo   [작업 스케줄러]에서 확인: Win+R → taskschd.msc
) else (
    echo.
    echo [오류] 등록에 실패했습니다.
    echo        이 파일을 마우스 우클릭 → '관리자 권한으로 실행' 해주세요.
)

echo.
pause
