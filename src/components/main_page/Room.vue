<template>
<div :class="roomClass">
  <div class="room__floor font-bold" v-if="firstOfFloor">{{room.floor}} ЭТАЖ</div>
  <div class="room__wrapper" :class="roomWrapperClass">
    <div class="room__title" :class="roomTitleClass">{{room.title}}</div>
    <div class="room__capacity font-normal" :class="roomCapacityClass">до {{room.capacity}} человек</div>
  </div>
  <div class="font-bold" :class="minifiedTitleClass">{{room.title}}</div>
</div>
</template>

<script>
export default {
  name: 'room',
  props: {
    room: {
      type: Object,
      required: true,
    },
    firstOfFloor: {
      type: Boolean,
      default: false,
    },
    theVeryFirst: {
      type: Boolean,
      default: false,
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isHighlighted() {
      return this.$store.getters.getHighlightedRoomId === this.room.id;
    },
    roomClass() {
      if (this.theVeryFirst) return 'room_the_very_first';
      return {
        room: !this.firstOfFloor,
        room_first_of_floor: this.firstOfFloor,
      };
    },
    roomTitleClass() {
      return {
        room__title_maximized: !this.hide,
        room__title_minified: this.hide,
        room__title_highlighted: this.isHighlighted,
        'font-bold': this.isHighlighted,
        'font-medium': !this.isHighlighted,
      };
    },
    roomCapacityClass() {
      return {
        room__capacity_hide: this.hide,
      };
    },
    roomWrapperClass() {
      return {
        room__wrapper_hidden: this.hide,
      };
    },
    minifiedTitleClass() {
      return {
        room__minified_title_hide: !this.hide,
        room__minified_title_show: this.hide,
      };
    },
  },
};
</script>

<style>
.room {
  margin: 8px 25px;
}
.room_the_very_first {
  margin: 21px 25px 8px 25px;
}
.room_first_of_floor {
  margin: 20px 25px 8px 25px;
}
.room__floor {
  height: 13px;
  font-size: 11px;
  letter-spacing: 0.4px;
  font-weight: bold;
  color: #858e98;
  padding: 0 0 4px 0;
}
.room__title {
  height: 17px;
}
.room__title__trunc {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.room__wrapper {
  position: relative;
  max-width: 210px;
}
.room__title_maximized {
  font-size: 15px;
  padding: 4px 0 2px 0;
  max-height: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 12px;
}
.room__title_minified {
  font-size: 15px;
  padding: 4px 0 2px 0;
}
.room__title_highlighted {
  color: #0070e0;
  overflow: unset !important;
  text-overflow: unset !important;
}
.room__capacity {
  font-size: 13px;
  height: 17px;
  padding: 0 0 4px 0;
}
.room__minified_title_hide,
.room__minified_title_show {
  display: none;
}
@media (max-width: 800px) {
  .room {
    margin: 4px 0px;
  }
  .room_the_very_first {
    margin: 16px 0px 4px 0px;
  }
  .room_first_of_floor {
    margin: 24px 0px 4px 0px;
  }
  .room__floor {
    padding: 0 0 8px 16px;
  }
  .room__title_maximized {
    padding: 11px 0 2px 0;
  }
  .room__title_minified {
    box-shadow: 0 1px 8px 0 rgba(0, 44, 92, 0.28);
    border-radius: 4px;
    display: inline-block;
    font-size: 11px;
    padding: 3px 8px 3px;
  }
  .room__capacity {
    padding: 0 0 11px 0;
  }
  .room__capacity_hide {
    padding: 0 0 17px 0;
    opacity: 0;
  }
  .room__wrapper {
    background: white;
    padding: 0 16px;
    height: 58px;
  }
  .room__wrapper_hidden {
    display: none;
  }
  .room__minified_title_show {
    font-size: 11px;
    color: #262626;
    display: inline-block;
    margin: 0 0 33px 16px;
    padding: 5px 8px 6px;
    box-shadow: 0 1px 8px 0 rgba(0, 44, 92, 0.28);
    border-radius: 4px;
    background: rgba(254, 254, 254, 0.5);
  }
}
</style>
