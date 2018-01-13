<template>
  <div class="event_room_input">
    <p class="font-bold">{{ selectedRoomId? "Ваша переговорка": "Рекомендованные переговорки" }}</p>
    <div v-for="room in rooms || []" :key="room.id"
      class="event_room_input__room"
      :class="{event_room_input__room_selected: selectedRoomId}"
      @click="selectRoom(room)"
      v-if="!selectedRoomId || selectedRoomId===room.id"
    >
      <div class="event_room_input__room__label font-normal">
        <span class="font-bold" style="margin-right: 12px">{{ selectedTime }}</span> {{ room.title }} · {{ room.floor }} этаж
      </div>
      <div class="event_room_input__room__close" @click.stop="deselectRoom" v-if="selectedRoomId">+</div>
    </div>
    <div class="event_room_input__reminder font-bold" v-if="!selectedRoomId">Выберите переговорку</div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import gql from 'graphql-tag';
import { rooms } from '../../store/mock_data.js';

export default {
  name: 'event-room-input',
  // data() {
  //   return {
  //     rooms,
  //   };
  // },
  apollo: {
    rooms: gql`
      {
        rooms {
          id
          title
          capacity
          floor
        }
      }
    `,
  },
  computed: {
    selectedRoomId() {
      return this.$store.getters.getEventEditRoomId;
    },
    selectedTime() {
      const dateStart = this.$store.getters.getEventEditDateStart;
      const dateEnd = this.$store.getters.getEventEditDateEnd;
      if (dateStart && dateEnd) return `${format(dateStart, 'HH:mm')}—${format(dateEnd, 'HH:mm')}`;
      return '';
    },
  },
  created() {
    if (this.$route.query.roomId) {
      this.selectRoom({ id: this.$route.query.roomId });
    }
  },
  methods: {
    selectRoom({ id }) {
      this.$store.commit('eventEditRoom', id);
    },
    deselectRoom() {
      this.$store.commit('eventEditRoom', null);
    },
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
