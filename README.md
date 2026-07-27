# FILM

Онлайн-сервис бронирования билетов в кинотеатр. Бэкенд на Nest.js + TypeORM + PostgreSQL, фронтенд на React.

## Установка

### PostgreSQL

Установите PostgreSQL или запустите через Docker:

docker compose up -d database

### Инициализация БД

Выполните SQL-файлы из backend/test/ для создания таблиц и заполнения тестовыми данными:

docker exec -i database_container psql -U postgres -d films < backend/test/prac.init.sql
docker exec -i database_container psql -U postgres -d films < backend/test/prac.films.sql
docker exec -i database_container psql -U postgres -d films < backend/test/prac.shedules.sql

### Бэкенд

Перейдите в папку с исходным кодом бэкенда:

cd backend

Установите зависимости:

npm ci

Создайте .env файл из примера .env.example, в нём укажите:

- DATABASE_DRIVER - postgres
- DATABASE_HOST - хост PostgreSQL, по умолчанию localhost
- DATABASE_PORT - порт PostgreSQL, по умолчанию 5432
- DATABASE_USERNAME - пользователь БД
- DATABASE_PASSWORD - пароль пользователя БД
- DATABASE_NAME - имя базы данных, по умолчанию films
- LOG_TYPE - тип логгера, dev, json или tskv
- PORT - порт сервера, по умолчанию 3000

Запустите бэкенд:

npm start:dev

### Фронтенд

cd frontend
npm ci
npm run dev

### Docker Compose, полный стек

Создайте .env файл в корне проекта из примера .env.example и запустите:

docker compose up -d

## Деплой

Приложение развёрнуто на Яндекс Облаке:

- Фронтенд: https://film.udarilisvtantcy.com
- API: https://film.udarilisvtantcy.com/api/afisha/films/