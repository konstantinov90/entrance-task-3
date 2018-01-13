<template>
<div class="tooltip__wrapper" @click="dropTooltip" v-if="!hide && show">
<div class="tooltip" :style="tooltipStyle">
  <p class="tooltip__event__title font-bold">{{event.title}}</p>
  <p class="tooltip__event__time font-normal">{{eventTime}} · {{event.room.title}}</p>
  <div v-if="event.users.length === 1">
    <p class="tooltip__event__users font-normal"><tooltip-user :user="event.users[0]"></tooltip-user></p>
  </div>
  <div v-if="event.users.length === 2">
    <p class="tooltip__event__users font-normal"><tooltip-user :user="event.users[0]"></tooltip-user> и <tooltip-user :user="event.users[1]"></tooltip-user></p>
  </div>
  <div v-if="event.users.length > 2">
    <p class="tooltip__event__users font-normal">
      <tooltip-user :user="event.users[0]"></tooltip-user>
      <span style="color:#a5a5a5">{{ restUsers }}</span>
    </p>
  </div>
  <router-link :to="linkURL" tag="div" class="tooltip__edit_event" ></router-link>
  <div class="tooltip__tail" :style="tailStyle"></div>
</div>  
</div>
</template>

<script>
import gql from 'graphql-tag';
import ru from 'date-fns/locale/ru';
import { format } from 'date-fns';
// import { events } from '../../store/mock_data.js';

const TooltipUser = {
  name: 'tooltip-user',
  template: `<span><img :src="user.avatarUrl" style="margin-right: 8px">{{user.login}}</span>`,
  props: {
    user: {
      type: Object,
    },
  },
};

export default {
  name: 'tooltip',
  components: {
    TooltipUser,
  },
  apollo: {
    event: {
      query: gql`
        query Event($id: ID!) {
          event(id: $id) {
            id
            title
            dateEnd
            dateStart
            room {
              id
              title
            }
            users {
              id
              login
              avatarUrl
            }
          }
        }
      `,
      variables() {
        return {
          id: this.clickedEventId || '',
        };
      },
    },
  },
  created() {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize() {
      if (this.tooltipBaseCoord) this.dropTooltip();
    },
    dropTooltip() {
      this.$store.commit('setTooltipInfo', {});
    },
    getUsersInflection(number) {
      if (number % 100 > 10 && number % 100 < 15) return 'ов';
      switch (number % 10) {
        case 1:
          return '';
        case 2:
        case 3:
        case 4:
          return 'а';
        default:
          return 'ов';
      }
    },
  },
  computed: {
    // event() {
    //   return this.clickedEventId ? events.filter(e => e.id === this.clickedEventId)[0] : null;
    // },
    clickedEventId() {
      return this.$store.getters.getTooltipEventId;
    },
    tooltipBaseCoord() {
      return this.$store.getters.getTooltipBaseCoord;
    },
    hide() {
      return !this.tooltipBaseCoord;
    },
    show() {
      return this.event && this.event.id === this.clickedEventId;
    },
    tooltipStyle() {
      const { x, y } = this.tooltipBaseCoord;
      if (window.innerWidth > 800) {
        return {
          top: `${y + 10}px`,
          left: `${x - 183}px`,
        };
      } else {
        return {
          top: `${y + 10}px`,
          width: '100%',
          left: '0px',
        };
      }
    },
    eventTime() {
      return `${format(this.event.dateStart, 'DD MMMM[,] HH[:]mm', {
        locale: ru,
      })}—${format(this.event.dateEnd, 'HH[:]mm', { locale: ru })}`;
    },
    restUsers() {
      const users = this.event.users.slice(1);
      return ` и ${users.length} участник${this.getUsersInflection(users.length)}`;
    },
    linkURL() {
      return { name: 'event', query: { id: this.event.id } };
      // return `/event/?id=${this.event.id}`;
    },
    tailStyle() {
      const { x } = this.tooltipBaseCoord;
      if (window.innerWidth > 800) {
        return {
          left: 'calc(50% - 10px)',
        };
      } else {
        return {
          left: `${x}px`,
        };
      }
    },
  },
};
</script>

<style>
.tooltip {
  background: white;
  box-shadow: 0 1px 16px 0 rgba(0, 44, 92, 0.28);
  border-radius: 8px;
  /* height: 120px; */
  width: 338px;
  position: absolute;
  z-index: 20;
  padding: 14px 16px;
  box-sizing: border-box;
}
.tooltip__tail {
  position: absolute;
  width: 0;
  height: 0;
  top: -10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}
.tooltip img {
  height: 24px;
  width: 24px;
  border-radius: 100%;
  vertical-align: middle;
}
.tooltip p {
  padding: 2px 0;
}
.tooltip__event__title {
  font-size: 15px;
  margin: 0;
}
.tooltip__event__time {
  font-size: 13px;
  margin-bottom: 16px;
}
.tooltip__event__users {
  font-size: 13px;
  margin: 0;
}
.tooltip__edit_event {
  background: url(/assets/edit.svg) rgb(213, 215, 218) no-repeat center;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  opacity: 0.5;
}
.tooltip__edit_event:hover {
  opacity: 1;
  background-color: rgba(213, 215, 218, 0.5);
}
.tooltip__wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}

@media (max-width: 800px) {
  .tooltip__event__title {
    font-size: 20px;
  }
}
</style>
