#!/usr/bin/env bash
# Starts Whisper/Silero API + ngrok tunnel for LearnWords dialogue.
# Prerequisite: LM Studio Local Server on :1234 with qwen2.5-14b-instruct-mlx.
set -euo pipefail

API_DIR="${WHISPER_API_DIR:-$HOME/whisper-api}"

if [[ ! -x "$API_DIR/start.sh" ]]; then
  echo "Не найден $API_DIR/start.sh"
  echo "Задай путь: WHISPER_API_DIR=/path/to/whisper-api $0"
  exit 1
fi

if ! curl -sf http://127.0.0.1:1234/v1/models >/dev/null; then
  echo "LM Studio Local Server не отвечает на :1234"
  echo "Открой LM Studio → модель qwen2.5-14b-instruct-mlx → Start Server"
  exit 1
fi

if ! curl -sf http://127.0.0.1:8000/health >/dev/null; then
  echo "▶ Starting Whisper + Silero on :8000…"
  (cd "$API_DIR" && ./start.sh) &
  API_PID=$!
  for _ in $(seq 1 90); do
    if curl -sf http://127.0.0.1:8000/health >/dev/null; then
      break
    fi
    sleep 1
  done
  if ! curl -sf http://127.0.0.1:8000/health >/dev/null; then
    echo "API не поднялся"
    kill "$API_PID" 2>/dev/null || true
    exit 1
  fi
else
  echo "✓ Whisper + Silero уже на :8000"
  API_PID=""
fi

cleanup() {
  echo
  echo "Stopping ngrok…"
  kill "${NGROK_PID:-}" 2>/dev/null || true
  if [[ -n "${API_PID}" ]]; then
    echo "Stopping Whisper API…"
    kill "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "▶ Starting ngrok http 8000…"
ngrok http 8000 --log=stdout >/tmp/learnwords-ngrok.log 2>&1 &
NGROK_PID=$!

PUBLIC_URL=""
for _ in $(seq 1 40); do
  PUBLIC_URL="$(
    curl -sf http://127.0.0.1:4040/api/tunnels 2>/dev/null \
      | python3 -c "import sys,json; t=json.load(sys.stdin).get('tunnels') or []; print(next((x['public_url'] for x in t if x['public_url'].startswith('https')), ''), end='')" \
      2>/dev/null || true
  )"
  if [[ -n "$PUBLIC_URL" ]]; then
    break
  fi
  sleep 0.5
done

if [[ -z "$PUBLIC_URL" ]]; then
  echo "ngrok URL не получен. Лог: /tmp/learnwords-ngrok.log"
  exit 1
fi

echo
echo "Готово. Держи этот терминал открытым."
echo "  Local:  http://127.0.0.1:8000/health"
echo "  Public: $PUBLIC_URL"
echo
echo "Если URL изменился — обнови NEXT_PUBLIC_AI_BASE_URL в next.config.js и задеплой."
echo
wait "$NGROK_PID"
