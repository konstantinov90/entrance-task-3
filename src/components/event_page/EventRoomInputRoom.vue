<template>
  <div class="event_room_input__room" 
      :class="{event_room_input__room_selected: selectedRoomId}"
      @click="select" v-if="show">
      <div class="event_room_input__room__label font-normal">
        <span class="font-bold" style="margin-right: 12px">{{ eventTime }}</span> {{ (room || {}).title }} · {{ (room || {}).floor }} этаж
      </div>
      <div class="event_room_input__room__close" @click.stop="deselect" v-if="selectedRoomId">+</div>
      
</div>
</template>

<script>
import gql from 'graphql-tag';
import { format } from 'date-fns';

export default {
  name: 'event-room-input-recommendation',
  props: {
    recommendation: {
      type: Object,
      required: true,
    },
  },
  apollo: {
    room: {
      query: gql`
        query room($id: ID!) {
          room(id: $id) {
            id
            capacity
            title
            floor
          }
        }
      `,
      variables() {
        return {
          id: this.recommendation.roomId,
        };
      },
    },
  },
  methods: {
    select() {
      this.$store.commit('eventEditRoom', this.recommendation.roomId);
      this.$store.commit('eventEditRecommendedDates', this.recommendation);
      this.$store.commit('eventEditSwap', this.recommendation.swaps);
      this.$store.commit('setShowSwaps', true);
    },
    deselect() {
      this.$store.commit('eventEditRoom', null);
      this.$store.commit('eventEditRecommendedDates', { dateStart: null, dateEnd: null });
    },
  },
  computed: {
    show() {
      return this.recommendation && (!this.selectedRoomId || this.selectedRoomId === (this.room || {}).id);
    },
    eventTime() {
      const { dateStart, dateEnd } = this.recommendation;
      return `${format(dateStart, 'HH:mm')}—${format(dateEnd, 'HH:mm')}`;
    },
    selectedRoomId() {
      return this.$store.getters.getEventEditRoomId;
    },
  },
};
</script>

<style>

</style>
