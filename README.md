# Разработка информационной системы медицинского центра «ИнфоМед»

Проект состоит из двух приложений:

- `backend` — NestJS + Prisma + PostgreSQL + JWT + Swagger
- `frontend` — React + TypeScript + Tailwind CSS + React Router + Axios

## Возможности

- регистрация и вход пациентов;
- разделение интерфейса и доступа по ролям `ADMIN`, `REGISTRAR`, `DOCTOR`, `PATIENT`;
- раздел «Показатели» для администратора, регистратора, врача и пациента;
- CRUD пользователей, врачей, пациентов, специальностей и услуг;
- запись на приём с расчётом доступных слотов;
- просмотр расписания врачей;
- ведение медицинских записей после приёма;
- история посещений пациента;
- отчёты по выручке, популярным услугам и загрузке врачей;
- карточки врачей с фотографиями и отдельными страницами профилей.

## Структура

```text
frontend/
backend/
```

## Запуск backend

1. Перейдите в папку `backend`.
2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env`:

```bash
cp .env.example .env
```

Для PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Подготовьте PostgreSQL и обновите в `.env` переменные `DATABASE_URL` и `DIRECT_DATABASE_URL`.

5. Примените схему к базе:

```bash
npm run db:push
```

6. Заполните базу тестовыми данными:

```bash
npm run db:seed
```

7. Запустите backend:

```bash
npm run start:dev
```

API будет доступен на `http://localhost:3000`, Swagger — на `http://localhost:3000/api/docs`.

## Запуск frontend

1. Перейдите в папку `frontend`.
2. Установите зависимости:

```bash
npm install
```

3. Запустите frontend:

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## Тестовые аккаунты

- Администратор: `admin@infomed.local` / `Admin123!`
- Регистратор: `registrar@infomed.local` / `Registrar123!`
- Врач: `doctor.terap@infomed.local` / `Doctor123!`
- Пациент: `patient1@infomed.local` / `Patient123!`

## Основные команды backend

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
npm run db:reset
npm run build
```

## Основные команды frontend

```bash
npm run dev
npm run build
```

## Примечания

- Для локального запуска нужен PostgreSQL. Подойдёт локальный сервер, Docker-контейнер или облачный Neon.
- Все защищённые маршруты backend работают через JWT.
- Пациент видит только собственные данные, врач — свои приёмы и связанные медицинские записи, администратор имеет полный доступ.
- После обновления тестовых логинов и добавления фотографий врачей рекомендуется выполнить `npm run db:reset` в папке `backend`.

## Deploy: Render + Neon

Практичный бесплатный вариант для этой монорепы:

- `frontend` как `Static Site` на Render
- `backend` как `Web Service` на Render
- PostgreSQL в Neon Free

Что уже подготовлено в репозитории:

- корневой `render.yaml` для двух сервисов из одной монорепы;
- backend переведён на PostgreSQL;
- `VITE_API_URL` и `CORS_ORIGINS` прокидываются между сервисами автоматически;
- seed больше не очищает базу на каждом redeploy и отрабатывает только на пустой БД.

Порядок запуска:

1. Залейте проект в GitHub.
2. Создайте бесплатную базу в Neon.
3. Скопируйте две строки подключения:
   - pooled URL в `DATABASE_URL`
   - direct URL в `DIRECT_DATABASE_URL`
4. В Render выберите `New +` -> `Blueprint` и подключите репозиторий.
5. Render прочитает `render.yaml` и создаст:
   - `infomed-api`
   - `infomed-web`
6. При первом создании сервисов заполните секреты:
   - `DATABASE_URL`
   - `DIRECT_DATABASE_URL`
7. Дождитесь первого deploy.

Ограничения бесплатного режима по состоянию на 14 мая 2026:

- Render Free Web Service засыпает после 15 минут без трафика и просыпается около минуты.
- Локальная файловая система Render эфемерная, поэтому загруженные в админке новые фото врачей могут пропасть после redeploy/restart.
- Бесплатный Neon подходит для демо и диплома, но это всё равно не production SLA.
