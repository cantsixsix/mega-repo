$job = Start-Job -ScriptBlock {
    wsl bash -lc "cd /mnt/c/Users/edenpc/Desktop/node ; npm run dev:hub"
}
Start-Sleep -Seconds 3
Write-Output "Job ID: $($job.Id)"
