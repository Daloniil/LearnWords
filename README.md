# LearnWords

Приложение для изучения слов (EN↔RU / ES↔RU) с тестами и голосовым диалогом.

## Локальный AI (для вкладки «Диалог»)

Нужны **три** сервиса:

1. **LM Studio** — LLM (`qwen2.5-14b-instruct-mlx`) на `http://127.0.0.1:1234`
2. **Whisper + Silero API** — STT и TTS на `http://127.0.0.1:8000`
3. **Next.js** — само приложение на `http://localhost:3000`

Код API лежит отдельно: `~/whisper-api`  
(Whisper STT + Silero TTS в одном сервере).

Фронтенд (и локальный, и на Vercel) ходит на `127.0.0.1` **в браузере на твоём компьютере**. AI не крутится на Vercel — он должен быть запущен у тебя локально.

---

### Whisper + Silero — установка (один раз)

```bash
cd ~/whisper-api
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Нужен также `ffmpeg`:

```bash
brew install ffmpeg
```

Модель Whisper по умолчанию:

```text
~/.lmstudio/models/mlx-community/whisper-large-v3-turbo
```

---

### Whisper + Silero — запуск

```bash
cd ~/whisper-api
./start.sh
```

Или вручную:

```bash
cd ~/whisper-api
source .venv/bin/activate
export WHISPER_MODEL_PATH="$HOME/.lmstudio/models/mlx-community/whisper-large-v3-turbo"
python server.py
```

Сервер поднимется на:

- Health: `http://127.0.0.1:8000/health`
- Whisper STT: `POST http://127.0.0.1:8000/v1/audio/transcriptions`
- Silero TTS: `POST http://127.0.0.1:8000/v1/audio/speech`  
  Языки: `ru`, `en`, `es`

### Проверка

```bash
curl http://127.0.0.1:8000/health
```

Распознавание:

```bash
curl http://127.0.0.1:8000/v1/audio/transcriptions \
  -F "file=@/path/to/audio.wav" \
  -F "model=whisper-1"
```

Озвучка (Silero):

```bash
curl http://127.0.0.1:8000/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input":"Привет! Я твой репетитор.","language":"ru"}' \
  --output speech_ru.mp3

curl http://127.0.0.1:8000/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello, how are you?","language":"en"}' \
  --output speech_en.mp3

curl http://127.0.0.1:8000/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input":"Hola, ¿cómo estás?","language":"es"}' \
  --output speech_es.mp3
```

### Остановка

В терминале, где запущен сервер: `Ctrl+C`.

---

## Деплой фронтенда + локальный AI (телефон / Vercel)

Схема: **телефон → HTTPS ngrok → твой Mac `:8000` → Whisper/Silero + LM Studio**.

1. LM Studio Local Server + `cd ~/whisper-api && ./start.sh`
2. Туннель: `ngrok http 8000` (сейчас: `https://percental-quinn-wizardly.ngrok-free.dev`)
3. В `next.config.js` / `NEXT_PUBLIC_AI_BASE_URL` должен быть этот HTTPS URL
4. Задеплой фронт на Vercel заново
5. Пока Mac + API + ngrok запущены — диалог работает с телефона

Если перезапустил ngrok — URL сменится: обнови `NEXT_PUBLIC_AI_BASE_URL` и задеплой снова.

Проверка туннеля:

```bash
curl -H "ngrok-skip-browser-warning: 1" https://percental-quinn-wizardly.ngrok-free.dev/health
```

Одной командой (API + ngrok; LM Studio уже должен быть запущен):

```bash
cd ~/Desktop/LearnWords && ./scripts/start-ai.sh
```

---

## Приложение LearnWords

```bash
cd ~/Desktop/LearnWords
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

Перед голосовым диалогом:

1. Запусти LM Studio Local Server (`http://127.0.0.1:1234`) с моделью `qwen2.5-14b-instruct-mlx`
2. Запусти Whisper + Silero (`./start.sh` в `~/whisper-api`) — фронт ходит только на `:8000`
3. Для локальной разработки CORS уже открыт; LM Studio нужен как upstream для прокси
