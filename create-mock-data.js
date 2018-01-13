const { models, sequelize } = require('./models');
const { users, events, rooms } = require('./src/store/mock_data.js');

function createData() {
  let usersPromise = models.User.bulkCreate(
    users.map(u => {
      u.id = null;
      return u;
    })
  );

  let roomsPromise = models.Room.bulkCreate(
    rooms.map(r => {
      r.id = null;
      return r;
    })
  );

  const HOUR = 60 * 60 * 1000;
  let now = new Date();
  let oneHourLater = new Date(now.getTime() + HOUR);
  let twoHoursLater = new Date(oneHourLater.getTime() + HOUR);
  let threeHoursLater = new Date(twoHoursLater.getTime() + HOUR);

  let eventsPromise = models.Event.bulkCreate(
    events.map(e => {
      e.id = null;
      return e;
    })
  );

  Promise.all([usersPromise, roomsPromise, eventsPromise])
    .then(() => Promise.all([models.User.findAll(), models.Room.findAll(), models.Event.findAll()]))
    .then(function([newUsers, newRooms, newEvents]) {
      let promises = [];
      for (let i = 0; i < newEvents.length; i += 1) {
        promises.push(newEvents[i].setRoom(events[i].room.id));
        promises.push(newEvents[i].setUsers(events[i].users.map(u => u.id)));
      }

      return Promise.all(promises);
    });
}

sequelize.sync().then(createData);
