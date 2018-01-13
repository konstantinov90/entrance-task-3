<template>
<modal-window class="event_created_modal" v-if="modalWindowFlag">
  <img class="event_created_modal__image"  src="/assets/emoji2.svg" alt="">
  <p class="event_created_modal__title font-bold">{{ message }}</p>
  <p class="event_created_modal__paragraph font-normal">{{ eventTime }}</p>
  <p class="event_created_modal__paragraph font-normal">{{ (room || {}).title }} · {{ (room || {}).floor }} этаж</p>
  <div class="font-medium event_created_modal__ok_btn" @click="drop">Хорошо</div>
</modal-window>
</template>

<script>
import ru from 'date-fns/locale/ru';
import { format } from 'date-fns';
import gql from 'graphql-tag';
import ModalWindow from '../common/ModalWindow.vue';
// import { rooms } from '../../store/mock_data.js';

export default {
  name: 'event-created-modal',
  components: {
    ModalWindow,
  },
  apollo: {
    room: {
      query: gql`
        query Room($id: ID!) {
          room(id: $id) {
            id
            title
            floor
          }
        }
      `,
      variables() {
        return {
          id: this.event.room ? this.event.room.id : '',
        };
      },
    },
  },
  methods: {
    drop() {
      this.$store.commit('toggleModalWindowFlag', null);
    },
  },
  computed: {
    message() {
      switch (this.modalWindowFlag) {
        case 'created':
          return 'Встреча создана!';
        case 'updated':
          return 'Встреча обновлена!';
      }
    },
    modalWindowFlag() {
      return this.$store.getters.getModalWindowFlag;
    },
    eventTime() {
      return `${format(this.event.dateStart, 'DD MMMM[,] HH[:]mm', {
        locale: ru,
      })}—${format(this.event.dateEnd, 'HH[:]mm', { locale: ru })}`;
    },
    event() {
      return this.$store.getters.getEventEditData;
    },
    // room() {
    //   return this.event.room ? rooms.filter(r => r.id === this.event.room.id)[0] : null;
    // },
  },
};
</script>

<style>
.event_created_modal__ok_btn {
  font-size: 13px;
  background: #007dff;
  border-radius: 4px;
  padding: 10px 16px;
  margin: 19px 0 0 0;
  color: white;
  cursor: pointer;
}
.event_created_modal__title {
  font-size: 20px;
  margin: 8px;
}
.event_created_modal p:not(.event_created_modal__title) {
  margin: 0 0 5px 0;
}
.event_created_modal__paragraph {
  font-size: 15px;
}
.event_created_modal__image {
  margin-bottom: 8px;
}
@media (max-width: 800px) {
  .event_created_modal p {
    margin: 0 0 6px 0;
  }
  .event_created_modal__ok_btn {
    padding: 13px 30px;
    font-size: 15px;
  }
}
</style>
