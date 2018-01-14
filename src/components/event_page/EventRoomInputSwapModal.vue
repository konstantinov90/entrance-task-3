<template>
  <modal-window v-if="show">
    <img class="event_room_input__swap" src="/assets/emoji2.svg" alt="">
    <p class="font-bold">Потребуется перенос {{ swaps.length }} встреч:</p>
    <swap-paragraph v-for="swap in swaps" :key="swap.eventId" :swap="swap">
    </swap-paragraph>
    <div class="event_room_input__swap__btn font-medium" @click="ok">ОК</div>
  </modal-window>
</template>

<script>
import gql from 'graphql-tag';
import ModalWindow from '../common/ModalWindow.vue';

const SwapParagraph = {
  name: 'swap-paragraph',
  template: `<p class="font-medium">{{ message }}</p>`,
  props: {
    swap: {
      type: Object,
    },
  },
  apollo: {
    room: {
      query: gql`
        query room($id: ID!) {
          room(id: $id) {
            id
            title
            floor
          }
        }
      `,
      variables() {
        return {
          id: this.swap.roomId || '',
        };
      },
    },
    event: {
      query: gql`
        query event($id: ID!) {
          event(id: $id) {
            id
            title
            room {
              title
              floor
            }
            dateStart
            dateEnd
          }
        }
      `,
      variables() {
        return {
          id: this.swap.eventId || '',
        };
      },
    },
  },
  computed: {
    message() {
      return (
        (this.event
          ? `${this.event.title} из комнаты ${this.event.room.title} на ${this.event.room.floor} этаже `
          : '') + (this.room ? `в ${this.room.title} на ${this.room.floor} этаже` : '')
      );
    },
  },
};

export default {
  name: 'event-room-input-swap-modal',
  components: {
    ModalWindow,
    SwapParagraph,
  },
  methods: {
    ok() {
      this.$store.commit('setShowSwaps', false);
    },
  },
  computed: {
    show() {
      return this.$store.getters.getShowSwaps && this.swaps.length;
    },
    swaps() {
      return this.$store.getters.getEventEditSwap;
    },
  },
};
</script>

<style>
.event_room_input__swap > p {
  font-size: 20px;
  text-align: center;
}
.event_room_input__swap__btn {
  padding: 10px 16px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 0 8px;
  cursor: pointer;
}
.event_room_input__swap__btn:hover {
  background: rgba(0, 16, 33, 0.103);
}
.event_room_input__swap__btn:active {
  background: rgba(4, 29, 56, 0.14);
}
</style>
