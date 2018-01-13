<template>
<div class="event_users_input">
  <p class="font-bold">Участники</p>
  <input type="text" class="font-normal" v-model="usersQuery" placeholder="Например, Тор Одинович"
    @focus="toggleShowUserList" @blur="toggleShowUserList">
  <div class="event_users_input__user_list" v-if="showUserList">
    <div v-for="user in usersFiltered" :key="user.id" class="event_users_input__user_list__item font-normal"
      @mousedown="selectUser(user)">
      <img :src="user.avatarUrl" :alt="user.login" height="24px">
      <span>{{user.login}} <font color="#A3A2A4">· {{user.homeFloor}} этаж</font></span>
      </div>
  </div>
  <div class="event_users_input__selected_user_list">
    <div v-for="user in selectedUsers" :key="user.id" class="event_users_input__selected_user_list__item">
      <img :src="user.avatarUrl" :alt="user.login">
      <div class="event_users_input__selected_user_list__item_name font-normal">{{user.login}}</div>
      <div class="event_users_input__selected_user_list__item_remove" @click="removeUser(user)"></div>
    </div>
  </div>
  <div class="event_users_input__clear" :class="clearClass" @click="clear" v-if="usersQuery || showUserList"></div>
</div>  
</template>

<script>
import gql from 'graphql-tag';
// import { users } from '../../store/mock_data.js';

export default {
  name: 'event-users-input',
  data() {
    return {
      showUserList: false,
      usersQuery: '',
      // users,
    };
  },
  apollo: {
    users: gql`
      {
        users {
          id
          login
          avatarUrl
          homeFloor
        }
      }
    `,
  },
  computed: {
    selectedUsers() {
      return (this.users || []).filter(u => this.$store.getters.getEventEditSelectedUsers.includes(u.id));
    },
    usersFiltered() {
      return (this.users || []).filter(
        u => u.login.toLowerCase().includes(this.usersQuery.toLowerCase()) && !this.selectedUsers.includes(u)
      );
    },
    clearClass() {
      return {
        event_users_input__arrow: this.showUserList && !this.usersQuery,
      };
    },
  },
  methods: {
    clear() {
      this.usersQuery = '';
    },
    removeUser({ id }) {
      this.$store.commit('eventEditRemoveUser', id);
    },
    selectUser(user) {
      this.$store.commit('eventEditAddUser', user);
    },
    toggleShowUserList() {
      this.showUserList = !this.showUserList;
    },
  },
};
</script>

<style>
.event_users_input {
  width: 100%;
  max-width: 420px;
  margin-bottom: 24px;
  position: relative;
}
.event_users_input > input {
  font-size: 13px;
  letter-spacing: 0.47px;
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  border-radius: 4px;
  border: 2px solid #e9ecef;
  padding: 0 10px;
}
.event_users_input > input:hover,
.event_users_input > input:focus {
  border: 2px solid #007dff;
}
.event_users_input > p {
  font-size: 13px;
  margin: 0 0 4px 0;
}
.event_users_input__user_list {
  max-height: 20vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 1px 10px 0 rgba(0, 44, 92, 0.28);
  position: absolute;
  width: calc(100% - 2px);
  background: white;
  z-index: 2;
}
.event_users_input__user_list__item {
  display: flex;
  padding: 5px 16px;
  font-size: 13px;
  line-height: 20px;
}
.event_users_input__user_list__item:hover {
  font-weight: bold;
  background: #f6f7f9;
  cursor: pointer;
}
.event_users_input__user_list__item img {
  border-radius: 100%;
}
.event_users_input__user_list__item span {
  margin: 0 8px;
}
.event_users_input__selected_user_list {
  display: flex;
  flex-wrap: wrap;
  margin: 12px 0;
  position: relative;
  z-index: 1;
}
.event_users_input__selected_user_list__item {
  border-radius: 16px;
  background: #e9ecef;
  display: flex;
  margin: 0 8px 8px 0;
}
.event_users_input__selected_user_list__item img {
  border-radius: 100%;
  height: 24px;
}
.event_users_input__selected_user_list__item_name {
  font-size: 13px;
  line-height: 22px;
  margin: 0 8px;
}
.event_users_input__selected_user_list__item_remove {
  background: url(/assets/close.svg) no-repeat center;
  width: 16px;
  height: 16px;
  margin: auto 8px;
  cursor: pointer;
}
.event_users_input__arrow {
  background: url(/assets/arrow.svg) no-repeat center !important;
  transform: rotate(-90deg);
}
.event_users_input__clear {
  position: absolute;
  top: 29px;
  right: 5px;
  background: url(/assets/close.svg) no-repeat center;
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.event_users_input__clear:hover {
  opacity: 0.5;
}
@media (max-width: 800px) {
  .event_users_input {
    padding: 16px 20px 0;
    max-width: unset;
    width: unset;
    border-top: 8px solid #e9ecef;
    margin-bottom: 20px;
  }
  .event_users_input__user_list {
    width: 95%;
    overflow-x: hidden;
  }
  .event_users_input__user_list__item {
    width: 100%;
  }
  .event_users_input__selected_user_list__item {
    width: 100%;
    justify-content: space-between;
    margin: 0 0 8px 0;
  }
  .event_users_input__selected_user_list__item img {
    height: 32px;
  }
  .event_users_input__selected_user_list__item_name {
    width: 100%;
    line-height: 30px;
  }
  .event_users_input__clear {
    top: 45px;
    right: 24px;
  }
}
</style>
