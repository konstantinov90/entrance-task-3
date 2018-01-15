<template>
  <div class="event_room_input">
    <p class="font-bold">{{ selectedRoomId? "Ваша переговорка": "Рекомендованные переговорки" }}</p>
    <event-room-input-room v-for="recommendation in freshRecommendations" :key="recommendation.roomId" :recommendation="recommendation">
    </event-room-input-room>
    <div class="event_room_input__reminder font-bold" v-if="!selectedRoomId">Выберите переговорку</div>
    <event-room-input-swap-modal></event-room-input-swap-modal>
  </div>
</template>

<script>
import { format } from 'date-fns';
import gql from 'graphql-tag';
import EventRoomInputRoom from './EventRoomInputRoom.vue';
import EventRoomInputSwapModal from './EventRoomInputSwapModal.vue';
// import { rooms } from '../../store/mock_data.js';

export default {
  name: 'event-room-input',
  // data() {
  //   return {
  //     rooms,
  //   };
  // },
  components: {
    EventRoomInputRoom,
    EventRoomInputSwapModal,
  },
  props: {
    event: {
      type: Object,
    },
  },
  apollo: {
    recommendations: {
      query: gql`
        query recommendations($dateStart: Date!, $dateEnd: Date!, $userIds: [ID], $selectedEventId: ID) {
          recommendations(
            dateStart: $dateStart
            dateEnd: $dateEnd
            userIds: $userIds
            selectedEventId: $selectedEventId
          ) {
            roomId
            dateStart
            dateEnd
            swaps {
              eventId
              roomId
            }
          }
        }
      `,
      variables() {
        return {
          dateStart: this.$store.getters.getEventEditDateStart || new Date(1970, 0, 0),
          dateEnd: this.$store.getters.getEventEditDateEnd || new Date(1970, 0, 0),
          userIds: this.$store.getters.getEventEditSelectedUsers,
          selectedEventId: this.$route.query.id,
        };
      },
    },
  },
  computed: {
    selectedRoomId() {
      return this.$store.getters.getEventEditRoomId;
    },
    thisEvent() {
      return { ...this.event, roomId: this.event ? this.event.room.id : '' };
    },
    freshRecommendations() {
      this.$apollo.queries.recommendations.refetch();
      return this.recommendations;
    },
  },
  created() {
    if (!this.$route.query.id) this.$store.commit('eventEditRoom', this.$route.query.roomId);
  },
};
</script>

<style>
.event_room_input {
  width: 100%;
  max-width: 420px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}
.event_room_input > p {
  font-size: 13px;
  margin: 0 0 4px 0;
}
.event_room_input__room {
  height: 37px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 0 0 8px 0;
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.event_room_input__room:active {
  background: #dde0e4;
}
.event_room_input__room_selected {
  background: #007dff;
  color: white;
  cursor: default;
}
.event_room_input__room_selected:active {
  background: #007dff;
}
.event_room_input__room__label {
  font-size: 13px;
  margin: auto 0;
}
.event_room_input__room__close {
  font-weight: bold;
  margin: auto 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(45deg);
}
.event_room_input__reminder {
  display: none;
  position: sticky;
  position: -webkit-sticky;
  bottom: 0;
  height: 43px;
  opacity: 0.93;
  background: rgba(0, 16, 33, 0.8);
  color: white;
  font-size: 15px;
  margin: -20px;
  padding: 0 20px;
  line-height: 40px;
}
@media (max-width: 800px) {
  .event_room_input {
    padding: 16px 20px;
    border-top: 8px solid #e9ecef;
    margin-top: 16px;
    max-width: unset;
    width: unset;
    margin-bottom: 20px;
    position: relative;
  }
  .event_room_input__room {
    height: 44px;
  }
  .event_room_input__room__label {
    font-size: 15px;
  }
  .event_room_input__room__close {
    font-size: 30px;
  }
  .event_room_input__reminder {
    display: unset;
  }
}
</style>
