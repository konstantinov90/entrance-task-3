<template>
<div class="events_head">
  <div class="events_head__clock_face">
    <div class="events_head__clock_hand font-bold" :style="clockStyle">{{ stringTime }}</div>
  </div>
  <div class="events_head__hour font-bold" v-for="(hour, index) in hourSlots" :key="index" :style="{ flex: hour.duration }">
      <span :style="{'margin-left': index > 9? '-7px': '-3px'}">{{ index }}</span>
      <span v-if="index === hourSlots.length - 1" style="margin-right: -6px">24</span>
  </div>
</div>
</template>

<script>
import { getHours, getMinutes } from 'date-fns';
const MINUTES = 60;

export default {
  name: 'events-head',
  data() {
    return {
      time: new Date(),
      interval: null,
    };
  },
  computed: {
    hourSlots() {
      return this.$store.getters.getMakeSlots(this.$store.getters.getDate);
    },
    hours() {
      return getHours(this.time);
    },
    minutes() {
      return getMinutes(this.time);
    },
    floatTime() {
      return this.hours + this.minutes / MINUTES;
    },
    stringTime() {
      return `${this.hours}:${this.minutes < 10 ? '0' : ''}${this.minutes}`;
    },
    clockLeftShift() {
      return this.floatTime > 9 ? 25 : 21;
    },
    clockStyle() {
      return {
        left: `calc(${this.floatTime / 24 * 100}% - ${this.clockLeftShift}px)`,
      };
    },
  },
  created() {
    this.interval = setInterval(() => {
      this.time = new Date();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style>
.events_head {
  display: flex;
  width: 100%;
  height: 47px;
  align-items: center;
  position: relative;
  padding: 0 24px 0 10px;
  border-bottom: 1px solid #e9ecef;
  background: white;
  box-sizing: border-box;
}
.events_head__hour {
  font-size: 11px;
  position: relative;
  display: flex;
  justify-content: space-between;
}
.events_head__hour::before {
  content: '';
  position: absolute;
  top: 31px;
  bottom: -99999px;
  background-color: rgba(19, 100, 205, 0.1);
  width: 1px;
  margin-left: 0;
  z-index: 10;
}
.events_head__clock_face {
  position: absolute;
  height: 100%;
  left: 10px;
  right: 24px;
  top: 0;
  z-index: 5;
}
.events_head__clock_hand {
  position: absolute;
  top: 11px;
  background: #007dff;
  border-radius: 100px;
  padding: 4px 10px;
  font-size: 11px;
  color: white;
  z-index: 1;
}
.events_head__clock_hand::after {
  content: '';
  position: absolute;
  top: 20px;
  bottom: -99999px;
  background-color: #007dff;
  width: 1px;
  margin-left: 0;
  left: 50%;
}
@media (max-width: 800px) {
  .events_head {
    height: 33px;
    width: 1584px;
  }
  .events_head__clock_face {
    width: 100%;
  }
  .events_head__hour {
    min-width: 66px;
  }
  .events_head__hour::before {
    top: 24px;
  }
  .events_head__clock_hand {
    top: 4px;
  }
}
</style>
