<template>
  <div class="event_topic_input">
    <p class="font-bold">Тема</p>
    <input type="text" class="font-normal" @input="onInput"
      :value="value" placeholder="О чём будете говорить?">
    <div class="event_topic_input__clear" @click="clear" v-if="value"></div>
  </div>
</template>

<script>
export default {
  name: 'event-topic-input',
  computed: {
    value() {
      return this.$store.getters.getEventEditTitle || '';
    },
  },
  methods: {
    onInput(e) {
      this.$store.commit('eventEditTitle', e.target.value);
    },
    clear() {
      this.$store.commit('eventEditTitle', '');
    },
  },
};
</script>

<style>
.event_topic_input {
  width: 100%;
  max-width: 420px;
  margin-bottom: 24px;
  position: relative;
}
.event_topic_input > input {
  font-size: 13px;
  letter-spacing: 0.47px;
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  border-radius: 4px;
  border: 2px solid #e9ecef;
  padding: 0 10px;
}
.event_topic_input > input:hover,
.event_topic_input > input:focus {
  border: 2px solid #007dff;
}
.event_topic_input > p {
  font-size: 13px;
  margin: 0 0 4px 0;
}
.event_topic_input__clear {
  position: absolute;
  bottom: 6px;
  right: 5px;
  background: url(/assets/close.svg) no-repeat center;
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.event_topic_input__clear:hover {
  opacity: 0.5;
}
@media (max-width: 800px) {
  .event_topic_input {
    padding: 0 20px;
    width: unset;
    max-width: 100%;
  }
  .event_topic_input__clear {
    right: 24px;
  }
}
</style>

