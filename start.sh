#!/bin/bash

echo "========================================"
echo "  Iniciando Portfolio de 20 SaaS Apps"
echo "========================================"
echo ""

echo "[1/2] Iniciando AI Gateway (porta 8787)..."
cd /mnt/c/Users/edenpc/Desktop/node
npm run dev:gateway > /tmp/gateway.log 2>&1 &
GATEWAY_PID=$!
echo "AI Gateway iniciado (PID: $GATEWAY_PID)"

echo ""
echo "[2/2] Aguardando 3 segundos..."
sleep 3

echo "[2/2] Iniciando App Hub (porta 8790)..."
npm run dev:hub > /tmp/app-hub.log 2>&1 &
HUB_PID=$!
echo "App Hub iniciado (PID: $HUB_PID)"

echo ""
echo "========================================"
echo "  Serviços iniciados!"
echo "========================================"
echo ""
echo "  Dashboard:  http://localhost:8790"
echo "  API Hub:    http://localhost:8790/api/apps"
echo "  AI Gateway: http://localhost:8787"
echo ""
echo "  Logs:"
echo "    Gateway: tail -f /tmp/gateway.log"
echo "    Hub:     tail -f /tmp/app-hub.log"
echo ""
echo "  Para parar:"
echo "    kill $GATEWAY_PID $HUB_PID"
echo ""
echo "========================================"