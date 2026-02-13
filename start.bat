@echo off
echo ========================================
echo   Iniciando Portfolio de 20 SaaS Apps
echo ========================================
echo.

echo [1/2] Iniciando AI Gateway (porta 8787)...
start "AI Gateway" wsl bash -lc "cd /mnt/c/Users/edenpc/Desktop/node ; npm run dev:gateway"

echo [2/2] Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo [2/2] Iniciando App Hub (porta 8790)...
start "App Hub" wsl bash -lc "cd /mnt/c/Users/edenpc/Desktop/node ; npm run dev:hub"

echo.
echo ========================================
echo   Servicos iniciados!
echo ========================================
echo.
echo   Dashboard: http://localhost:8790
echo   API Hub:   http://localhost:8790/api/apps
echo   AI Gateway: http://localhost:8787
echo.
echo Aguardando 5 segundos antes de abrir o navegador...
timeout /t 5 /nobreak >nul

start http://localhost:8790

echo.
echo Pressione qualquer tecla para fechar...
pause >nul