Серверная часть приложения взята из первого задания, с добавлением нескольких запросов в GraphQL (события, отфильтрованные по комнате и дате, а также рекомендации комнат - через функцию `getRecommendation`, описанную в задании). Функция `getRecommendation` живет в пакете `utils`.

Клиентская часть приложения написана на фреймворке Vue.js с использованием GraphQL клиента vue-apollo и state менеджера Vuex.

Сборка проекта производится с помощью WebPack + Babel с деградацией синтаксиса ES2015 и полифиллами babel-polyfill

Модельные данные заполняются с помощью библиотеки faker.js (скрипт `npm run reset-db`, возможно потребуются мелкие исправления для UNIX систем). 

## Запуск
Сборка проекта проводилась под windows (используется `rebuild.bat`)
```
npm i
npm run reset-db
npm run dev
```

Для сброса данных в базе:

(будет сформировано большое количество данных, скрипт может занять пару минут)
```
npm run reset-db
```
