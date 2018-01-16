<template>
<div style="position:relative">
<div class="event">
  <app-header></app-header>
  <div class="event__body_vertical_flex">
    <div class="event__header font-bold">
      <p>{{this.id? "Редактирование встречи": "Новая встреча"}}</p>
      <router-link :to="{ name: '/' }" tag="div" class="event__close event__element_hide"></router-link>
    </div>
    <div class="event__body">
      <div class="event__body_horizontal_flex">
        <event-topic-input></event-topic-input>
        <p style="min-width: 32px"></p>
        <event-datetime-input></event-datetime-input>
      </div>
      <div class="event__body_horizontal_flex">
        <event-users-input></event-users-input>
        <p style="min-width: 32px"></p>
        <event-room-input :event="event"></event-room-input>
      </div>
    </div>
    <div class="event__footer__delete event__footer__delete_additional font-medium" v-if="id" @click="confirmDelete">Удалить встречу</div>
  </div>
</div>
<div class="event__footer">
  <div class="event__footer__buttons font-medium">
    <router-link :to="{ name: '/' }" tag="div" class="event__footer__button event__footer__cancel">Отмена</router-link>
    <div class="event__footer__button event__footer__save" :class="eventSaveBtnClass" v-if="!id" @mousedown="createEvent">Создать встречу</div>
    <div class="event__footer__button event__footer__delete event__element_hide" v-if="id" @click="confirmDelete">Удалить встречу</div>
    <div class="event__footer__button event__footer__save" :class="eventSaveBtnClass" v-if="id" @mousedown="updateEvent">Сохранить</div>
  </div>
</div>
<event-delete-modal :deleteFcn="removeEvent" v-if="showEventDeleteModal"></event-delete-modal>
</div>
</template>

<script>
import AppHeader from '../common/AppHeader.vue';
import Datepicker from 'vuejs-datepicker';
import ru from 'date-fns/locale/ru';
import { format, addHours, startOfHour } from 'date-fns';
import gql from 'graphql-tag';
import EventTopicInput from './EventTopicInput.vue';
import EventDatetimeInput from './EventDatetimeInput.vue';
import EventUsersInput from './EventUsersInput.vue';
import EventRoomInput from './EventRoomInput.vue';
import EventDeleteModal from './EventDeleteModal.vue';

// import { events } from '../../store/mock_data.js';

export default {
  name: 'event',
  components: {
    AppHeader,
    Datepicker,
    EventTopicInput,
    EventDatetimeInput,
    EventUsersInput,
    EventRoomInput,
    EventDeleteModal,
  },
  apollo: {
    event: {
      query: gql`
        query event($id: ID!) {
          event(id: $id) {
            id
            title
            dateEnd
            dateStart
            room {
              id
            }
            users {
              id
            }
          }
        }
      `,
      variables() {
        return {
          id: this.id || '',
        };
      },
      update({ event }) {
        this.$store.commit('eventEdit', event || { dateStart: this.dateStart, dateEnd: this.dateEnd, room: this.room });
        return event;
      },
    },
  },
  // created() {
  //   this.$store.commit('eventEdit', this.event);
  // },
  methods: {
    createEventAtDB() {
      const { recommendedDateStart, recommendedDateEnd, title, room, users } = this.$store.getters.getEventEditData;

      return this.$apollo.mutate({
        mutation: gql`
          mutation createEvent($input: EventInput!, $usersIds: [ID], $roomId: ID!) {
            createEvent(input: $input, usersIds: $usersIds, roomId: $roomId) {
              id
            }
          }
        `,
        variables: {
          input: {
            dateEnd: recommendedDateEnd,
            dateStart: recommendedDateStart,
            title,
          },
          roomId: room.id,
          usersIds: users.map(u => u.id),
        },
      });
    },
    createEvent() {
      if (this.isReady) {
        Promise.all([
          this.createEventAtDB(),
          ...(this.$store.getters.getEventEditSwap || []).map(s => this.changeEventRoom(s.eventId, s.roomId)),
        ])
          .then(() => {
            this.$store.commit('toggleModalWindowFlag', 'created');
            this.$router.push({ name: '/' });
          })
          .catch(error => console.error(error));
      }
    },
    updateEventAtDB() {
      const { recommendedDateStart, recommendedDateEnd, title } = this.$store.getters.getEventEditData;

      return this.$apollo.mutate({
        mutation: gql`
          mutation updateEvent($id: ID!, $input: EventInput!) {
            updateEvent(id: $id, input: $input) {
              id
            }
          }
        `,
        variables: {
          id: this.event.id,
          input: {
            dateEnd: recommendedDateEnd,
            dateStart: recommendedDateStart,
            title,
          },
        },
      });
    },
    addUserToEvent() {
      const currentUsers = this.event.users.map(u => u.id);
      return Promise.all(
        this.$store.getters.getEventEditSelectedUsers.filter(userId => !currentUsers.includes(userId)).map(userId => {
          return this.$apollo.mutate({
            mutation: gql`
              mutation addUserToEvent($id: ID!, $userId: ID!) {
                addUserToEvent(id: $id, userId: $userId) {
                  id
                }
              }
            `,
            variables: {
              id: this.event.id,
              userId,
            },
          });
        })
      );
    },
    removeUserFromEvent() {
      const users = this.$store.getters.getEventEditSelectedUsers;
      return Promise.all(
        this.event.users.filter(u => !users.includes(u.id)).map(u => {
          return this.$apollo.mutate({
            mutation: gql`
              mutation removeUserFromEvent($id: ID!, $userId: ID!) {
                removeUserFromEvent(id: $id, userId: $userId) {
                  id
                }
              }
            `,
            variables: {
              id: this.event.id,
              userId: u.id,
            },
          });
        })
      );
    },
    changeEventRoom(id, roomId) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation changeEventRoom($id: ID!, $roomId: ID!) {
            changeEventRoom(id: $id, roomId: $roomId) {
              id
            }
          }
        `,
        variables: {
          id,
          roomId,
        },
      });
    },
    updateEvent() {
      if (this.isReady) {
        Promise.all([
          this.updateEventAtDB(),
          this.addUserToEvent(),
          this.removeUserFromEvent(),
          this.changeEventRoom(this.event.id, this.$store.getters.getEventEditRoomId),
          ...(this.$store.getters.getEventEditSwap || []).map(s => this.changeEventRoom(s.eventId, s.roomId)),
        ])
          .then(() => {
            this.$store.commit('toggleModalWindowFlag', 'updated');
            this.$router.push({ name: '/' });
          })
          .catch(error => console.error(error));
      }
    },
    removeEventAtDB() {
      return this.$apollo.mutate({
        mutation: gql`
          mutation removeEvent($id: ID!) {
            removeEvent(id: $id) {
              id
            }
          }
        `,
        variables: {
          id: this.event.id,
        },
      });
    },
    removeEvent() {
      this.removeEventAtDB()
        .then(() => {
          this.$store.commit('toggleModalWindowFlag', 'removed');
          this.$router.push({ name: '/' });
        })
        .catch(error => console.error(error));
    },
    confirmDelete() {
      this.$store.commit('toggleEventDeleteConfirm');
    },
    parseQueryDate(queryDate) {
      if (!queryDate) return;
      const timestamp = parseInt(queryDate) || null;
      if (!timestamp) return;
      return new Date(timestamp);
    },
  },
  computed: {
    // event() {
    //   return this.id ? events.filter(e => e.id === this.id)[0] : null;
    // },
    dateStart() {
      return this.parseQueryDate(this.$route.query.dateStart) || startOfHour(addHours(new Date(), 1));
    },
    dateEnd() {
      return this.parseQueryDate(this.$route.query.dateEnd) || startOfHour(addHours(new Date(), 2));
    },
    room() {
      return {
        id: this.$route.query.roomId,
      };
    },
    showEventDeleteModal() {
      return this.$store.getters.getEventDeleteConfirm;
    },
    id() {
      return this.$route.query.id;
    },
    eventSaveBtnClass() {
      return {
        event__footer__save_disabled: !this.isReady,
      };
    },
    isReady() {
      const gtrs = this.$store.getters;
      return (
        gtrs.getEventEditTitle &&
        gtrs.getEventEditRecommendedDateStart &&
        gtrs.getEventEditRecommendedDateEnd &&
        gtrs.getEventEditRoomId &&
        gtrs.getEventEditSelectedUsers.length
      );
    },
  },
};
</script>

<style>
.event {
  position: relative;
  height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.event__body_vertical_flex {
  max-width: 872px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.event__body_horizontal_flex {
  display: flex;
  justify-content: space-between;
}
.event__header {
  padding: 0 20px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}
.event__body {
  padding: 0 20px;
  font-size: 13px;
}
.event__close {
  width: 24px;
  height: 24px;
  background: url(/assets/close.svg) #e9ecef no-repeat center;
  border-radius: 100px;
  margin: auto 0;
  cursor: pointer;
}
.event__close:hover {
  background-color: #d5dfe9;
}
.event__footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background: white;
  box-shadow: 0 -1px 0 0 #e9ecef;
  width: 100%;
  height: 76px;
  display: flex;
  justify-content: center;
}
.event__footer__buttons {
  display: flex;
  justify-content: center;
}
.event__footer__button {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 13px;
  margin: auto 8px;
  background: #e9ecef;
  border-radius: 4px;
}
.event__footer__button:active {
  background: #dde0e4;
}
.event__footer__save {
  background: #007dff;
  color: white;
}
.event__footer__save:hover {
  background: #0059ff;
}
.event__footer__save:active {
  background: rgba(11, 0, 255, 0.8);
}
.event__footer__delete_additional {
  display: none;
  cursor: pointer;
}
.event__footer__save_disabled {
  background: #e9ecef;
  color: rgba(0, 0, 0, 0.2);
  cursor: default;
}
.event__footer__save_disabled:hover {
  background: #e9ecef;
}
.event__footer__save_disabled:active {
  background: #e9ecef;
}
@media (max-width: 800px) {
  .event__body {
    padding: 0;
  }
  .event__element_hide {
    display: none;
  }
  .event__body_horizontal_flex {
    display: block;
  }
  .event__footer {
    height: 80px;
    bottom: 0;
    position: -webpack-sticky;
    position: sticky;
    z-index: 999;
  }
  .event__footer__button {
    font-size: 15px;
  }
  .event__footer__delete {
    font-size: 15px;
    border-top: 8px solid #e9ecef;
    border-bottom: 8px solid #e9ecef;
    padding: 16px 0 20px;
    text-align: center;
    color: #ff3333;
  }
  .event__footer__delete_additional {
    display: block;
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  /* webkit specific CSS */
  /* фикс для iphone (в частности iphone5), ибо тулбар safari входит в vh */
  .event {
    height: calc(100vh - 150px);
  }
}
</style>
