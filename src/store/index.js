import Vue from 'vue';
import Vuex from 'vuex';

import { addHours, addDays, startOfDay } from 'date-fns';

function makeSlots(startDate, roomId) {
  const HOUR = 60 * 60 * 1000;
  const slots = [];
  for (let i = 0, date = startDate; i < 24; i += 1, date = addHours(date, 1)) {
    slots.push({
      dateStart: date,
      dateEnd: addHours(date, 1),
      duration: HOUR,
      type: 'slot',
      roomId,
    });
  }
  return slots;
}

const createStore = () =>
  new Vuex.Store({
    state: {
      date: startOfDay(new Date()),
      orderedRooms: [],
      eventEditData: {},
      modalWindowFlag: null,
      eventDeleteConfirm: false,
      tooltipBaseCoord: null,
      tooltipEventId: null,
      highlightedRoomId: null,
    },
    mutations: {
      incrementDate(state, inc) {
        Vue.set(state, 'date', addDays(state.date, inc));
      },
      setDate(state, date) {
        Vue.set(state, 'date', startOfDay(date));
      },
      eventEdit(state, event) {
        Vue.set(state, 'eventEditData', { ...(event || {}) });
      },
      eventEditTitle(state, title) {
        Vue.set(state.eventEditData, 'title', title);
      },
      eventEditDates(state, { dateStart, dateEnd }) {
        Vue.set(state.eventEditData, 'dateStart', dateStart);
        Vue.set(state.eventEditData, 'dateEnd', dateEnd);
      },
      eventEditRoom(state, roomId) {
        Vue.set(state.eventEditData, 'room', { id: roomId });
      },
      eventEditAddUser(state, user) {
        const users = [...(state.eventEditData.users || [])];
        users.push(user);
        Vue.set(state.eventEditData, 'users', users);
      },
      eventEditRemoveUser(state, userId) {
        const users = [...state.eventEditData.users];
        Vue.set(state.eventEditData, 'users', users.filter(u => u.id !== userId));
      },
      toggleModalWindowFlag(state, value) {
        Vue.set(state, 'modalWindowFlag', value);
      },
      toggleEventDeleteConfirm(state) {
        Vue.set(state, 'eventDeleteConfirm', !state.eventDeleteConfirm);
      },
      setTooltipInfo(state, { tooltipBaseCoord, eventId }) {
        Vue.set(state, 'tooltipEventId', eventId);
        if (tooltipBaseCoord) {
          const { pageX, pageY } = tooltipBaseCoord;
          Vue.set(state, 'tooltipBaseCoord', { x: pageX, y: pageY });
        } else {
          Vue.set(state, 'tooltipBaseCoord', null);
        }
      },
      setHighlightedRoomId(state, roomId) {
        Vue.set(state, 'highlightedRoomId', roomId);
      },
    },
    actions: {},
    getters: {
      getModalWindowFlag(state) {
        return state.modalWindowFlag;
      },
      getEventDeleteConfirm(state) {
        return state.eventDeleteConfirm;
      },
      getEventEditData(state) {
        return state.eventEditData;
      },
      getHighlightedRoomId(state) {
        return state.highlightedRoomId;
      },
      getTooltipEventId(state) {
        return state.tooltipEventId;
      },
      getTooltipBaseCoord(state) {
        return state.tooltipBaseCoord;
      },
      getDate(state) {
        return state.date;
      },
      getEventEditTitle(state) {
        return state.eventEditData.title;
      },
      getEventEditDateStart(state) {
        return state.eventEditData.dateStart;
      },
      getEventEditDateEnd(state) {
        return state.eventEditData.dateEnd;
      },
      getEventEditSelectedUsers(state) {
        if (state.eventEditData.users) {
          return state.eventEditData.users.map(u => u.id);
        }
        return [];
      },
      getEventEditRoomId(state) {
        if (state.eventEditData.room) {
          return state.eventEditData.room.id;
        }
        return null;
      },
      getMakeSlots() {
        return makeSlots;
      },
    },
  });

export default createStore;
