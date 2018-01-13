<template>
<div class="header">
    <router-link :to="{ name: '/' }" tag="div" class="header__logo"></router-link>
    <router-link :to="{ name: 'event' }" tag='div' class="header__btn font-medium" v-if="$route.name === '/'">Создать встречу</router-link>
</div>
</template>

<script>
export default {
  name: 'app-header',
};
</script>

<style>
.font-normal {
  font-family: HelveticaNeue, 'Open Sans', Helvetica, Arial, sans-serif;
  font-weight: 400;
}
.font-medium {
  font-family: HelveticaNeue, 'Open Sans', Helvetica, Arial, sans-serif;
  font-weight: 600;
}
.font-bold {
  font-family: HelveticaNeue, 'Open Sans', Helvetica, Arial, sans-serif;
  font-weight: 700;
}
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
}
body {
  margin: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  height: 71px;
}
.header__logo {
  margin-left: 25px;
  height: 71px;
  width: 175px;
  background: url(/assets/logo.svg) no-repeat center;
  cursor: pointer;
}
.header__btn {
  font-size: 13px;
  background: #007dff;
  margin: 18px 24px 17px 0px;
  width: 140px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  text-align: center;
  color: #ffffff;
}
.header__btn:hover {
  background: #0059ff;
  cursor: pointer;
}
.header__btn:active {
  background: rgba(11, 0, 255, 0.8);
}
@media (max-width: 800px) {
  .header__btn {
    display: none;
  }
  .header__logo {
    background-size: 149px 21px;
    height: 21px;
    width: 149px;
    margin-left: 20px;
  }
  .header {
    height: 48px;
  }
}
</style>
