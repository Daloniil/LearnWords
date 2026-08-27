# LearnWords — План разработки

> Дата: 27 августа 2026  
> Статус: черновик, к реализации не приступали

---

## Цели

1. **Режим ES ↔ RU** — пользователь может переключить режим обучения; в Dictionary и на других экранах отображаются колонки «Español» / «Русский» вместо «English» / «Russian».
2. **UI/UX под мобильный телефон** — приложение должно комфортно работать на смартфоне как основной платформе.

Изменения в кодовой базе; правки в Firebase Admin Console не требуются (кроме возможной однократной проверки Security Rules).

---

## Текущее состояние

### Две разные «языковые» настройки

| Концепция | Где хранится | Значения | Назначение |
|-----------|--------------|----------|------------|
| Язык интерфейса | `localStorage` → `app-language` | `english` / `russian` | Подписи кнопок, меню, уведомления |
| Языковая пара обучения | Firebase, жёстко в коде | EN ↔ RU | Словарь, тесты, папки |

Переключатель в **Settings** сейчас меняет только UI (`LanguageProvider`), а не язык обучения.

### Модель данных Firebase

Документ `words/{uid}`:

```json
{
  "englishWords": [{ "id": 0, "word": "hello", "correctTranslation": "привет", "point": 0 }],
  "russianWords": [{ "id": 0, "word": "привет", "correctTranslation": "hello", "point": 0 }],
  "uid": "..."
}
```

Каждая пара слов дублируется в двух массивах (для теста в обе стороны). Аналогичная структура внутри папок (`folders/{uid}`).

### Где зашит английский

- `Interfaces/EnterInterface.ts` — поля `englishWord` / `russianWord`
- `hooks/useWords.ts`, `hooks/useFolders.ts` — CRUD пар слов
- `services/translationService.ts` — только `en` ↔ `ru` (RapidAPI)
- `pages/dictionary`, `pages/enter`, `components/EditWord` — лейблы «English» / «Russian»
- `hooks/useTest.ts` — `StatusFind.EN` / `StatusFind.RU`

---

## Часть 1. Режим Español ↔ Русский

### Поведение для пользователя

В **Settings** появляется **второй переключатель** (отдельно от языка интерфейса):

| Настройка | Значения |
|-----------|----------|
| Язык интерфейса | Русский / English *(без изменений)* |
| **Режим обучения** | **English ↔ Russian** / **Español ↔ Русский** |

При выборе **Español ↔ Русский**:

- **Dictionary** — колонки «Español» | «Русский»
- **Enter** — поля для испанского слова и русского перевода
- **Test** — слова из испанского словаря
- **Folders** — отдельные наборы слов ES ↔ RU
- Данные EN ↔ RU **не смешиваются** с испанскими

### Архитектура

#### Новый контекст: `LearningPairProvider`

```typescript
type LearningPair = "en-ru" | "es-ru";

// localStorage: "app-learning-pair"
// default: "en-ru" — существующие пользователи без изменений
```

#### Конфиг пары (хелпер `getPairConfig()`)

| Режим | Source (Firebase) | Target (Firebase) | sourceLang | targetLang |
|-------|-------------------|-------------------|------------|------------|
| `en-ru` | `englishWords` | `russianWords` | `en` | `ru` |
| `es-ru` | `spanishWords` | `russianWordsEs` | `es` | `ru` |

> **Зачем `russianWordsEs`:** один массив `russianWords` смешает переводы при переключении режимов (`hello` vs `hola`). Отдельный массив для ES-режима сохраняет данные обеих пар у одного аккаунта.

#### Расширенная модель Firebase (создаётся приложением)

```json
{
  "englishWords": [],
  "russianWords": [],
  "spanishWords": [],
  "russianWordsEs": [],
  "uid": "..."
}
```

Те же поля внутри каждой папки в `folders/{uid}`.

### Изменения по файлам

| Этап | Задача | Файлы |
|------|--------|-------|
| 1 | `LearningPairProvider` + `getPairConfig()` | `providers/LearningPairProvider.tsx` *(новый)*, `pages/_app.tsx` |
| 2 | Переключатель режима в Settings | `pages/settings/index.tsx`, `translation/Settings/index.ts` |
| 3 | CRUD слов по динамическим ключам | `hooks/useWords.ts`, `hooks/useFolders.ts` |
| 4 | Тест из нужного массива | `hooks/useTestServer.ts`, `pages/test/index.tsx`, `hooks/useTest.ts` |
| 5 | UI: динамические колонки и лейблы | `pages/dictionary/index.tsx`, `pages/folders/[id].tsx`, `pages/enter/index.tsx`, `components/EditWord/index.tsx` |
| 6 | Автоперевод ES ↔ RU | `services/translationService.ts` |
| 7 | Озвучка испанского | `speakWord` в `hooks/useWords.ts` — `lang: "es-ES"` |
| 8 | Строки «Español», «Испанский» | `translation/Dictionary`, `translation/Enter`, `translation/EditWord`, `translation/Settings` |
| 9 | Обобщение интерфейса формы | `Interfaces/EnterInterface.ts`, `utils/lowerText.ts` |

### Логика переключения режима

1. Пользователь в Settings выбирает **Español ↔ Русский**
2. Значение сохраняется в `localStorage` → `app-learning-pair: "es-ru"`
3. Dictionary читает `spanishWords` (если пусто — пустая таблица)
4. Enter добавляет пару в `spanishWords` + `russianWordsEs`
5. Test работает только со словами ES ↔ RU
6. Переключение обратно на EN ↔ RU — снова `englishWords` / `russianWords`, данные не смешиваются

### Риски

| Риск | Митигация |
|------|-----------|
| Security Rules блокируют новые поля | Проверить Rules; при необходимости разрешить запись `spanishWords`, `russianWordsEs` |
| Существующие пользователи | Default `en-ru`, поведение не меняется |
| Опечатка в `translation/Dictionary` — «Англиський» | Исправить при рефакторинге переводов |

### Оценка

~15–20 файлов, **2–3 дня** работы.

---

## Часть 2. UI/UX аудит (mobile-first)

Приложение построено на Next.js + MUI, но **не оптимизировано под телефон**. Ниже — проблемы и рекомендации по приоритету.

### Критичные (мешают пользоваться на телефоне)

| # | Проблема | Где | Рекомендация |
|---|----------|-----|--------------|
| 1 | Нет viewport meta | `pages/_document..tsx` | Добавить `viewport`, `theme-color` для iOS/Android |
| 2 | `Container maxWidth="lg"` + лишние отступы | `layouts/index.tsx` | `maxWidth={false}`, `px: 1`, `mt: 1` на mobile |
| 3 | AppBar `position: absolute` | `components/Bar/index.tsx` | Sticky/fixed header + safe-area для iPhone |
| 4 | Кнопки ответов 150×120px | `Styles/TestStyle.ts` | `width: calc(50% - 8px)`, min-height 56px (touch ≥ 44px) |
| 5 | Dictionary — Table на узком экране | `pages/dictionary/index.tsx` | Card-list (слово + перевод) вместо таблицы |
| 6 | Settings — горизонтальный flex | `pages/settings/index.tsx` | Вертикальный stack, select на всю ширину |
| 7 | Кнопка Add с `float: right` | `Styles/EnterStyle.ts` | Flexbox, full-width кнопка |

### Важные (UX и визуал)

| # | Проблема | Рекомендация |
|---|----------|--------------|
| 8 | Дублирование «Word learning» в AppBar | Убрать или заменить на иконку/аватар |
| 9 | Login — одна кнопка «Authentication» | Экран с лого, «Войти через Google», локализация |
| 10 | Нет bottom navigation | Bottom Nav: Dictionary, Enter, Test, Folders, Settings |
| 11 | Drawer 250px — desktop pattern | Bottom nav или full-screen menu на mobile |
| 12 | `overflow: hidden` на body | Заменить на `overflow-x: hidden` |
| 13 | Хардкод цветов `#1c54b2`, `#3874CB` | Вынести в MUI theme palette |
| 14 | Restart test — кнопка 70×30px | Увеличить touch area, FAB или sticky footer |
| 15 | Нет feedback при tap | `:active` / ripple на карточках теста |
| 16 | Progress bar 75% width | Full-width sticky внизу экрана теста |
| 17 | Modal без safe padding | `maxWidth: 90vw`, отступы от краёв |
| 18 | `windowHeight` без resize listener | Hook `useWindowSize` или CSS `dvh` |

### Желательные (полировка)

| # | Улучшение |
|---|-----------|
| 19 | Единая типографическая шкала (h1 24px mobile, body 16px) |
| 20 | Empty states: пустой словарь → «Добавьте первое слово» |
| 21 | Skeleton loading вместо CircularProgress |
| 22 | Haptic feedback (Vibration API) при ответе в тесте |
| 23 | PWA: manifest + icon для «Add to Home Screen» |
| 24 | Safe area insets (`env(safe-area-inset-bottom)`) для iPhone |

---

## Объединённый план работ

### Фаза A — Фундамент (1–2 дня)

- [ ] Viewport meta + mobile layout (`Layout`, safe areas)
- [ ] `LearningPairProvider` + хелпер `getPairConfig()`
- [ ] Переключатель режима в Settings
- [ ] Абстракция Firebase-ключей в `useWords` / `useFolders`

### Фаза B — ES ↔ RU функционал (1–2 дня)

- [ ] Dictionary / Enter / EditWord — динамические колонки и лейблы
- [ ] Folders — поддержка ES-пары
- [ ] Test + TestServer под ES-режим
- [ ] `TranslationService` ES ↔ RU
- [ ] TTS с `lang: "es-ES"`
- [ ] Переводы UI (`translation/*`)

### Фаза C — Mobile UX (2–3 дня)

- [ ] Test page — адаптивные карточки ответов
- [ ] Dictionary — card-list вместо table
- [ ] Settings + Enter — вертикальные формы, full-width кнопки
- [ ] Bottom navigation *(решение — см. «Открытые вопросы»)*

### Фаза D — Полировка (1 день)

- [ ] Login screen
- [ ] Theme tokens (palette)
- [ ] Empty states
- [ ] Loading skeletons

---

## Открытые вопросы (решить перед стартом)

| # | Вопрос | Варианты |
|---|--------|----------|
| 1 | Bottom navigation | Делать сразу (рекомендуется) / оставить burger-menu |
| 2 | Dictionary на mobile | Card-list (рекомендуется) / компактная таблица |
| 3 | Security Rules Firebase | Проверить, разрешают ли запись новых полей в `words/{uid}` |

---

## Чеклист тестирования

### ES ↔ RU

- [ ] Переключение режима сохраняется после перезагрузки
- [ ] EN-словарь не виден в ES-режиме и наоборот
- [ ] Добавление слова в ES-режиме → появляется в Dictionary с колонками Español / Русский
- [ ] Тест работает с испанскими словами
- [ ] Папки: добавление/удаление слов в ES-режиме
- [ ] Автоперевод ES → RU и RU → ES
- [ ] Озвучка испанских слов
- [ ] Редактирование и удаление слова в ES-режиме

### Mobile UX

- [ ] Корректный масштаб на iPhone и Android (viewport)
- [ ] Test: все 4 варианта ответа видны без горизонтального скролла
- [ ] Dictionary: читаемость на экране 375px
- [ ] Settings: переключатели не обрезаются
- [ ] Safe area на iPhone с notch
- [ ] Dark / light theme на всех экранах

---

## Связанные файлы (справочник)

```
providers/
  LanguageProvider.tsx      ← язык UI (существует)
  LearningPairProvider.tsx  ← режим обучения (новый)

hooks/
  useWords.ts
  useFolders.ts
  useTest.ts
  useTestServer.ts

pages/
  settings/index.tsx
  dictionary/index.tsx
  enter/index.tsx
  test/index.tsx
  folders/[id].tsx

services/
  translationService.ts
  localKey.ts

layouts/index.tsx
components/Bar/index.tsx
Styles/TestStyle.ts
Styles/EnterStyle.ts
Styles/DictionaryStyle.ts
```
