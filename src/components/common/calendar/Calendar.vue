<template>
<div class="calendar">
    <calendar-btn direction="left"></calendar-btn>
    <datepicker :value="date" @input="setDate" :format="formatter"
      calendar-class="calendar__select font-normal" :monday-first="true"
      class="calendar__input font-medium" language="ru"></datepicker>
    <calendar-btn></calendar-btn>
</div>  
</template>

<script>
import { addDays, format, isToday, isYesterday, isTomorrow } from 'date-fns';
import ru from 'date-fns/locale/ru';
import Datepicker from 'vuejs-datepicker';
import CalendarBtn from './CalendarBtn.vue';

export default {
  name: 'calendar',
  components: { Datepicker, CalendarBtn },
  computed: {
    date() {
      return this.$store.state.date;
    },
  },
  methods: {
    formatter(date) {
      let suffix;
      if (isToday(date)) suffix = '[⋅ Сегодня]';
      else if (isTomorrow(date)) suffix = '[⋅ Завтра]';
      else if (isYesterday(date)) suffix = '[⋅ Вчера]';
      return format(date, `DD MMM ${suffix || 'YYYY'}`, { locale: ru }).replace('.', '');
    },
    setDate(date) {
      this.$store.commit('setDate', date);
    },
  },
};
</script>

<style src="./calendar.css">

</style>

<style src="./calendar__select.css">

</style>
