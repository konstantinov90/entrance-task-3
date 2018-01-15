Приложение написано на фреймворке Vue.js с использованием GraphQL клиента vue-apollo и state менеджера Vuex.

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
