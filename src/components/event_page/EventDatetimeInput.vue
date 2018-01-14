<template>
  <div class="event_datetime_input">
    <div style="flex-basis: 238px;" class="event_datetime_input_partial event_datetime_input_calendar">
      <p class="font-bold event_datetime_input__element_hide">Дата</p>
      <p class="font-bold event_datetime_input__element_show">Дата и время</p>
      <datepicker :value="date" class="font-normal"
      calendar-class="calendar__select" :monday-first="true"
      :format="formatter" language="ru" @selected="onChangeDate"></datepicker>
    </div>
    <div style="display: flex; flex-basis: 168px;">
      <div class="event_datetime_input_partial">
        <p class="font-bold event_datetime_input__element_hide">Начало</p>
        <input type="text" class="font-normal" :class="warnInputClass('start')" v-model="startHour" @input="onInput($event, 'start')">
      </div>
      <p class="event_datetime_input__date_divider font-bold">—</p>
      <div class="event_datetime_input_partial">
        <p class="font-bold event_datetime_input__element_hide">Конец</p>
        <input type="text" class="font-normal" :class="warnInputClass('end')" v-model="endHour" @input="onInput($event, 'end')">
      </div>
    </div>
  </div>  
</template>

<script>
import gql from 'graphql-tag';
import Datepicker from 'vuejs-datepicker';
import ru from 'date-fns/locale/ru';
import {
  compareAsc,
  format,
  addHours,
  addMinutes,
  startOfHour,
  startOfDay,
  getTime,
  getHours,
  getMinutes,
} from 'date-fns';

export default {
  name: 'event-datetime-input',
  components: {
    Datepicker,
  },
  data() {
    return {
      date: this.initialDate(),
      startHour: this.getTimeFmt(this.startTime()),
      endHour: this.getTimeFmt(this.endTime()),
      warnings: [],
    };
  },
  apollo: {
    event: {
      query: gql`
        query event($id: ID!) {
          event(id: $id) {
            id
            dateStart
            dateEnd
          }
        }
      `,
      variables() {
        return {
          id: this.$route.query.id || '',
        };
      },
      update({ event }) {
        if (event) {
          this.startHour = this.getTimeFmt(event.dateStart);
          this.endHour = this.getTimeFmt(event.dateEnd);
        }
        return event;
      },
    },
  },
  methods: {
    formatter(date) {
      return format(date, `DD MMMM[,] YYYY`, { locale: ru });
    },
    parseQueryDate(queryDate) {
      if (!queryDate) return;
      const timestamp = parseInt(queryDate) || null;
      if (!timestamp) return;
      return new Date(timestamp);
    },
    parseTime(inputTime) {
      const input = inputTime.split(':');
      const hours = parseInt(input[0]);
      if (isNaN(hours) || hours > 23 || hours < 0) return;
      const minutes = parseInt(input[1]);
      if (isNaN(minutes) || minutes > 59 || minutes < 0) return;
      return addMinutes(addHours(this.date, hours), minutes);
    },
    getTimeFmt(date) {
      return format(date, 'HH[:]mm');
    },
    startTime() {
      if (this.$route.query.dateStart) return this.parseQueryDate(this.$route.query.dateStart);
      if (!this.$route.query.id) return startOfHour(addHours(new Date(), 1));
      return this.$store.getters.getEventEditDateStart;
    },
    endTime() {
      if (this.$route.query.dateEnd) return this.parseQueryDate(this.$route.query.dateEnd);
      if (!this.$route.query.id) return startOfHour(addHours(new Date(), 2));
      return this.$store.getters.getEventEditDateEnd;
    },
    initialDate() {
      return startOfDay(this.$store.getters.getEventEditDateStart || this.$store.getters.getDate);
    },
    onChangeDate(newDate) {
      this.date = newDate;
      this.commitData();
    },
    onInput(e) {
      this.commitData();
    },
    commitData() {
      this.$store.commit('eventEditDates', this);
      this.$store.commit('eventEditRoom', null);
    },
  },
  computed: {
    _dateStart() {
      return this.parseTime(this.startHour);
    },
    _dateEnd() {
      return this.parseTime(this.endHour);
    },
    dateStart() {
      if (!this._dateStart || compareAsc(this._dateStart, this._dateEnd) >= 0) return null;
      return this._dateStart;
    },
    dateEnd() {
      if (!this._dateEnd || compareAsc(this._dateEnd, this._dateStart) <= 0) return null;
      return this._dateEnd;
    },
    warnInputClass() {
      return type => {
        return {
          event_datetime_input_warn: (type === 'start' ? this.dateStart : this.dateEnd) ? false : true,
        };
      };
    },
  },
  created() {
    this.$store.commit('eventEditDates', this);
    this.$store.commit('eventEditRecommendedDates', this);
  },
};
</script>

<style src="../common/calendar/calendar__select.css">

</style>

<style>
.event_datetime_input {
  width: 100%;
  max-width: 420px;
  margin-bottom: 24px;
  display: flex;
}
.event_datetime_input input {
  font-size: 13px;
  letter-spacing: 0.47px;
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  border-radius: 4px;
  border: 2px solid #e9ecef;
  padding: 0 10px;
}
.event_datetime_input input:hover,
.event_datetime_input input:focus {
  border: 2px solid #007dff;
}
.event_datetime_input p:not(.event_datetime_input__date_divider) {
  font-size: 13px;
  margin: 0 0 4px 0;
}
.event_datetime_input__date_divider {
  margin: 30px 4px 12px;
  font-size: 13px;
}
.event_datetime_input_partial {
  margin: 0;
  width: 100%;
}
.event_datetime_input__element_show {
  display: none;
}
.event_datetime_input_calendar {
  position: relative;
  margin-right: 8px;
}
.event_datetime_input_calendar::after {
  content: '';
  width: 12px;
  background: url(/assets/calendar.svg) no-repeat;
  position: absolute;
  height: 12px;
  top: 60%;
  right: 5%;
  opacity: 0.3;
  pointer-events: none;
}
.event_datetime_input_calendar > input {
  font-family: inherit;
  cursor: pointer;
}
.event_datetime_input_warn {
  color: #ff3333;
}
@media (max-width: 800px) {
  .event_datetime_input {
    max-width: 100%;
    width: unset;
    padding: 0 20px;
    display: block;
    margin-bottom: 20px;
  }
  .vdp-datepicker__calendar {
    width: unset;
  }
  .event_datetime_input_calendar {
    margin: 0 0 8px 0;
  }
  .event_datetime_input_calendar::after {
    top: 55%;
    right: 12px;
  }
  .event_datetime_input__element_hide {
    display: none;
  }
  .event_datetime_input__element_show {
    display: unset;
  }
  .event_datetime_input__date_divider {
    margin: 10px 4px 12px;
  }
  .calendar__select {
    top: 48px;
  }
}
</style>
