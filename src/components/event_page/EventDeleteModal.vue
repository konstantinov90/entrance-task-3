<template>
  <modal-window>
    <img class="event_delete_modal__image" src="/assets/emoji1.svg" alt="">
    <p class="event_delete_modal__paragraph font-bold">Встреча будет удалена безвозвратно</p>
    <div class="event_delete_modal__btns">
      <div class="event_delete_modal__btn font-medium" @click="cancel">Отмена</div>
      <div class="event_delete_modal__btn font-medium">Удалить</div>
    </div>
  </modal-window>
</template>

<script>
import ModalWindow from '../common/ModalWindow.vue';

export default {
  name: 'event-delete-modal',
  components: {
    ModalWindow,
  },
  methods: {
    cancel() {
      this.$store.commit('toggleEventDeleteConfirm');
    },
  },
};
</script>

<style>
.event_delete_modal__btns {
  display: flex;
}
.event_delete_modal__paragraph {
  font-size: 20px;
  text-align: center;
}
.event_delete_modal__btn {
  padding: 10px 16px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 0 8px;
  cursor: pointer;
}
.event_delete_modal__btn:hover {
  background: rgba(0, 16, 33, 0.103);
}
.event_delete_modal__btn:active {
  background: rgba(4, 29, 56, 0.14);
}
</style>
