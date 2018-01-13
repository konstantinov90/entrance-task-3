<template>
  <div :class="btnClass" v-on:click="onClick"></div>
</template>

<script>
export default {
  name: 'calendar-btn',
  props: {
    direction: {
      default: 'right',
      type: String,
      validator(v) {
        return ['left', 'right'].includes(v);
      },
    },
  },
  computed: {
    isLeft() {
      return this.direction === 'left';
    },
    btnClass() {
      return `calendar__btn${this.isLeft ? ' calendar__btn_left' : ''}`;
    },
  },
  methods: {
    onClick() {
      this.$store.commit('incrementDate', this.isLeft ? -1 : 1);
    },
  },
};
</script>

<style>
.calendar__btn {
  min-width: 24px;
  height: 24px;
  background: url(/assets/arrow.svg) rgb(213, 215, 218) no-repeat center;
  border-radius: 100%;
  cursor: pointer;
  opacity: 0.5;
}
.calendar__btn:hover {
  opacity: 1;
  background-color: rgba(213, 215, 218, 0.5);
}
.calendar__btn_left {
  transform: rotate(180deg);
}
</style>
