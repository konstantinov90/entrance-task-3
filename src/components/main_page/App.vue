<template>
  <div class="app">
    <app-header></app-header>
    <div class="timetable">
      <calendar></calendar>
      <div class="rooms" :class="roomsClass">
        <room v-for="room in orderedRooms" :key="room.id" :hide="isScrolled"
          :room="room" :firstOfFloor="firstOfFloor(room)" :theVeryFirst="theVeryFirst(room)"
          ></room>
      </div>
      <div class="events" :class="eventsClass" @scroll="onScroll">
        <events-head></events-head>
        <div class="grid__wrapper">
          <grid v-for="room in orderedRooms" :key="room.id"
            :room="room" :firstOfFloor="firstOfFloor(room)" :theVeryFirst="theVeryFirst(room)"
          ></grid>
        </div>
      </div>
    </div>
    <tooltip></tooltip>
    <event-created-modal></event-created-modal>
  </div>
</template>
 
<script>
import gql from 'graphql-tag';
import AppHeader from '../common/AppHeader.vue';
import Calendar from '../common/calendar/Calendar.vue';
import Room from './Room.vue';
import EventsHead from './EventsHead.vue';
import Grid from './Grid.vue';
import Tooltip from './Tooltip.vue';
import EventCreatedModal from './EventCreatedModal.vue';
// import { rooms } from '../../store/mock_data.js';

function sortRooms(a, b) {
  if (a.floor === b.floor) return a.title > b.title;
  return a.floor > b.floor;
}

export default {
  name: 'app',
  components: {
    AppHeader,
    Calendar,
    Room,
    EventsHead,
    Grid,
    Tooltip,
    EventCreatedModal,
  },
  data() {
    return {
      isScrolled: false,
      // rooms,
    };
  },
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
  methods: {
    onScroll(e) {
      this.isScrolled = e.target.scrollLeft > 0;
    },
    firstOfFloor({ id, floor }) {
      return this.orderedRooms.filter(o => o.floor === floor)[0].id === id;
    },
    theVeryFirst({ id, floor }) {
      return this.orderedRooms[0].id === id;
    },
  },
  computed: {
    orderedRooms() {
      if (!this.rooms) return [];
      const rooms = [...this.rooms].sort(sortRooms);
      return rooms;
    },
    eventsClass() {
      if (!this.isScrolled) return 'events_stick';
    },
    roomsClass() {
      return {
        rooms_minified: this.isScrolled,
      };
    },
  },
};
</script>
 
<style>
.app {
  overflow: hidden;
  position: relative;
}
.events {
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
  flex-basis: 100%;
  flex: 1;
  min-width: 650px;
}
.events__head__wrapper {
  padding: 0 12px;
  border-bottom: 1px solid #e9ecef;
  width: 100%;
  background: white;
  box-sizing: border-box;
}
.grid__wrapper {
  margin: 0 24px 0 10px;
  padding: 6px 0;
  background: #f6f7f9;
  border-right: 1px solid #e9ecef;
}
.timetable {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  position: relative;
}
.rooms {
  pointer-events: none;
  position: absolute;
  top: 46px;
  left: 0px;
  z-index: 5;
}
@media (max-width: 800px) {
  .timetable {
    flex-wrap: wrap;
  }
  .events_stick {
    margin-left: 161px;
  }
  .events {
    transition: margin-left 0.5s;
    -webkit-transition: margin-left 0.5s;
    -moz-transition: margin-left 0.5s;
    -o-transition: margin-left 0.5s;
    -ms-transition: margin-left 0.5s;
    overflow-x: visible;
    -webkit-overflow-scrolling: touch;
    min-width: calc(100% - 161px);
  }
  .events__head__wrapper,
  .events__head {
    width: 1604px;
  }
  .grid__wrapper {
    width: 1584px;
  }
  .rooms {
    top: 89px;
    width: 170px;
    border-top: 1px solid #e9ecef;
    background: #f6f7f9;
  }
  .rooms_minified {
    pointer-events: none;
    background: none;
    width: unset !important;
  }
}
</style>