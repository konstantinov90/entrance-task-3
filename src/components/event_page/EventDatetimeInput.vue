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
        <input type="text" class="font-normal" :class="warnInputClass('start')" :value="startHour" @input="onInputStartTime">
      </div>
      <p class="event_datetime_input__date_divider font-bold">—</p>
      <div class="event_datetime_input_partial">
        <p class="font-bold event_datetime_input__element_hide">Конец</p>
        <input type="text" class="font-normal" :class="warnInputClass('end')" :value="endHour"  @input="onInputEndTime">
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
  parse,
} from 'date-fns';

const HOUR_STR_PTRN = /^(\d{2}):(\d{2})$/;

export default {
  name: 'event-datetime-input',
  components: {
    Datepicker,
  },
  data() {
    return {
      fallBackDate: new Date(),
      fallBackStartHour: '',
      fallBackEndHour: '',
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
          this.fallBackStartHour = this.fallBackStartHour || this.getTimeFmt(event.dateStart);
          this.fallBackEndHour = this.fallBackEndHour || this.getTimeFmt(event.dateEnd);
        }
        return event;
      },
    },
  },
  methods: {
    formatter(date) {
      return format(date, `DD MMMM[,] YYYY`, { locale: ru });
    },
    getTimeFmt(date) {
      return format(date, 'HH[:]mm');
    },
    parseDateTimeStrictly(date, hourStr) {
      if (!HOUR_STR_PTRN.test(hourStr)) return;
      const [hours, minutes] = hourStr
        .match(HOUR_STR_PTRN)
        .slice(1)
        .map(v => parseInt(v));
      if (isNaN(hours) || hours > 23 || hours < 0) return;
      if (isNaN(minutes) || minutes > 59 || minutes < 0) return;
      const dateStr = `${format(date, 'YYYY[-]MM[-]DD')}T${hours}:${minutes}`;
      return new Date(dateStr);
    },
    onChangeDate(date) {
      this.clearData();
      this.fallBackDate = date;
      this.commitData();
    },
    commitData() {
      this.$store.commit('eventEditDates', this);
    },
    clearData() {
      this.$store.commit('eventEditDates', { dateStart: null, dateEnd: null });
      this.$store.commit('eventEditRoom', null);
    },
    onInputStartTime({ target }) {
      this.clearData();
      this.fallBackStartHour = target.value;
      this.commitData();
    },
    onInputEndTime({ target }) {
      this.clearData();
      this.fallBackEndHour = target.value;
      this.commitData();
    },
  },
  computed: {
    date() {
      return startOfDay(this.$store.getters.getEventEditDateStart || this.fallBackDate);
    },
    startHour() {
      const date = this.$store.getters.getEventEditDateStart;
      return date ? this.getTimeFmt(date) : this.fallBackStartHour;
    },
    endHour() {
      const date = this.$store.getters.getEventEditDateEnd;
      return date ? this.getTimeFmt(date) : this.fallBackEndHour;
    },
    _dateStart() {
      return this.parseDateTimeStrictly(this.date, this.startHour);
    },
    _dateEnd() {
      return this.parseDateTimeStrictly(this.date, this.endHour);
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
