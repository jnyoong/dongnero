# dongnero telegram bot watchdog
$PYTHON   = "C:\Users\User\AppData\Local\Python\pythoncore-3.14-64\python.exe"
$WORK_DIR = $PSScriptRoot
$SCRIPT   = Join-Path $PSScriptRoot "telegram_bot.py"
$ENV_FILE = Join-Path $PSScriptRoot ".env.local"

function SendTelegram([string]$text) {
    $token = ""; $chatId = ""
    if (Test-Path $ENV_FILE) {
        foreach ($line in (Get-Content $ENV_FILE -Encoding UTF8)) {
            if ($line -match "^TELEGRAM_BOT_TOKEN=(.+)") { $token = $matches[1].Trim() }
            if ($line -match "^TELEGRAM_CHAT_ID=(.+)")   { $chatId = $matches[1].Trim() }
        }
    }
    if ($token -and $chatId) {
        try {
            $body = ConvertTo-Json @{chat_id=$chatId; text=$text; parse_mode="Markdown"}
            Invoke-RestMethod -Uri "https://api.telegram.org/bot${token}/sendMessage" `
                -Method Post -ContentType "application/json" -Body $body | Out-Null
        } catch {}
    }
}

$restartCount = 0
$fastRestarts = 0

while ($true) {
    $start = Get-Date
    Write-Output "[$($start.ToString('HH:mm:ss'))] bot start (restarts: $restartCount)"

    $exitCode = 1
    try {
        $proc     = Start-Process -FilePath $PYTHON -ArgumentList "`"$SCRIPT`"" `
            -WorkingDirectory $WORK_DIR -WindowStyle Hidden -Wait -PassThru
        $exitCode = if ($proc) { $proc.ExitCode } else { 1 }
    } catch {
        Write-Output "Start-Process error: $_"
    }

    $elapsed = [int]((Get-Date) - $start).TotalSeconds
    Write-Output "[$((Get-Date).ToString('HH:mm:ss'))] bot exit (code=$exitCode elapsed=${elapsed}s)"

    if ($exitCode -ne 0 -or $elapsed -lt 10) {
        $restartCount++
        $fastRestarts++
        if ($fastRestarts -ge 5) {
            SendTelegram "bot auto-restart stopped (5 fast exits) | check .env.local or python path"
            exit 1
        }
        SendTelegram "bot restarted #${restartCount} | exit:${exitCode} | uptime:${elapsed}s"
    } else {
        $fastRestarts = 0
    }

    Start-Sleep -Seconds 10
}