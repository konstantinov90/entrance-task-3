const Op = require('sequelize').Op;
const addDays = require('date-fns').addDays;
const { models } = require('../../models');

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
};
