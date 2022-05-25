# ndse-10-book-library
приложение «библиотека»  
## Установка и запуск
Скачайте проект и перейдите в папку проекта:  
```js
git clone --depth=1 --branch=ts https://github.com/rpu6HuK87/ndse-10-book-library.git
cd ndse-10-book-library
```
Создайте копию файла env, внесите в него переменные окружения:  
```js
cp .env.example .env
```
Запустите приложение:  
```js
docker-compose up -d --build
```
API будет доступен на порте 8080 хоста
