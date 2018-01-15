const { Op } = require('sequelize');
const { addDays, startOfDay } = require('date-fns');
const { models } = require('../../models');
const { getRecommendationWithDataTransform } = require('../../utils');

module.exports = {
  event(root, { id }) {
    return models.Event.findById(id);
  },
  events(root, args, context) {
    return models.Event.findAll({}, context);
  },
  user(root, { id }) {
    return models.User.findById(id);
  },
  users(root, args, context) {
    return models.User.findAll({}, context);
  },
  room(root, { id }) {
    return models.Room.findById(id);
  },
  rooms(root, args, context) {
    return models.Room.findAll({}, context);
  },
  eventsByRoomAndDate(root, { roomId, date }) {
    return models.Event.findAll({
      where: {
        roomId,
        dateStart: {
          [Op.gt]: date,
        },
        dateEnd: {
          [Op.lt]: addDays(date, 1),
        },
      },
    });
  },
  recommendations(root, { dateStart, dateEnd, userIds, selectedEventId }) {
    const date = startOfDay(dateStart);
    return Promise.all([
      models.Event.findAll({
        include: ['Room', 'Users'],
        where: {
          dateStart: {
            [Op.gt]: date,
          },
          dateEnd: {
            [Op.lt]: addDays(date, 1),
          },
          id: {
            [Op.ne]: selectedEventId || -1,
          },
        },
      }),
      models.Room.findAll({}),
      models.User.findAll({}),
    ]).then(([events, rooms, allUsers]) => {
      const users = allUsers.filter(u => userIds.includes(u.id));
      return getRecommendationWithDataTransform(dateStart, dateEnd, users, events, rooms, allUsers);
    });
  },
};
