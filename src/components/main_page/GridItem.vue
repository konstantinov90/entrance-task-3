<template>
  <div class="grid__item" :class="this.isOccupied? 'grid__item_event': 'grid__item_slot'"
    :style="gridItemStyle" @click.stop="onClick" @mouseover="onMouseOver" @mouseout="onMouseOut">
      <router-link :to="linkURL" class="grid__item__link font-medium"
        v-if="!this.isOccupied">+</router-link>
  </div>
</template>

<script>
import { getTime } from 'date-fns';

const DAY = 24 * 60 * 60 * 1000;

export default {
  name: 'grid-item',
  props: {
    event: {
      type: Object,
      required: true,
    },
    // duration: {
    //   type: Number,
    //   required: true,
    // },
    roomId: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick(e) {
      if (!this.isOccupied) return;
      this.$store.commit('setTooltipInfo', {
        tooltipBaseCoord: e,
        eventId: this.event.id,
      });
    },
    onMouseOver() {
      if (this.isOccupied) return;
      this.$emit('gridItemOver');
    },
    onMouseOut() {
      if (this.isOccupied) return;
      this.$emit('gridItemOut');
    },
  },
  computed: {
    isOccupied() {
      return this.event.type === 'event';
    },
    linkURL() {
      return {
        name: 'event',
        query: { dateStart: getTime(this.event.dateStart), dateEnd: getTime(this.event.dateEnd), roomId: this.roomId },
      };
    },
    duration() {
      return getTime(this.event.dateEnd) - getTime(this.event.dateStart);
    },
    gridItemStyle() {
      const value = `${(this.duration * 100 / DAY).toFixed(4)}%`;
      return {
        width: value,
        'flex-basis': value,
        'max-width': value,
        'user-select': 'none',
      };
    },
  },
};
</script>

<style>
.grid__item {
  height: 28px;
  position: relative;
  text-align: center;
  cursor: pointer;
}
.grid__item__link {
  color: white;
  text-decoration: none;
  font-size: 23px;
  line-height: 25px;
  display: block;
  height: 100%;
}
.grid__item_event {
  background: #d5dfe9;
}
.grid__item_event:hover {
  background: #98a9b9;
}
.grid__item_event:active {
  background: rgba(0, 0, 0, 0.12);
}
.grid__item_slot {
  background: white;
}
.grid__item_slot:hover {
  background: #2b50fd;
  border-radius: 2px;
}
.grid__item_slot:active {
  background: #1d00fe;
}
@media (max-width: 800px) {
  .grid__item {
    height: 58px;
  }
  .grid__item__link {
    line-height: 56px;
    font-size: 30px;
  }
}
</style>
