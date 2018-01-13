const faker = require('faker');
const { addHours, addMinutes, isWithinRange } = require('date-fns');
const seedrandom = require('seedrandom');

faker.locale = 'ru';
faker.seed(124);
const random = seedrandom(faker.name.firstName());

function getRandomInt(min, max) {
  return Math.floor(random() * (max - min)) + min;
}

const rooms = [];
for (let i = 0; i < 10; i += 1) {
  rooms.push(
    Object.freeze({
      id: i.toString(),
      title: faker.commerce.productName(),
      capacity: getRandomInt(3, 20),
      floor: getRandomInt(1, 15),
    })
  );
}

const users = [];
for (let i = 0; i < 100; i += 1) {
  users.push(
    Object.freeze({
      id: i.toString(),
      login: faker.name.findName(),
      homeFloor: getRandomInt(1, 15),
      avatarUrl: faker.image.avatar(),
    })
  );
}

const events = [];

function isEventsIntersect(e1, e2) {
  return isWithinRange(e1.dateStart, e2.dateStart, e2.dateEnd) || isWithinRange(e1.dateEnd, e2.dateStart, e2.dateEnd);
}

function filterEvents(floor) {
  return events.filter(e => e.room.floor === floor);
}

for (let i = 0; i < 600; i += 1) {
  const obj = {
    id: i.toString(),
    title: faker.company.catchPhrase(),
    users: [],
  };
  obj.dateStart = faker.date.between('2018-01-01', '2018-01-31');
  obj.dateEnd = addMinutes(addHours(obj.dateStart, getRandomInt(1, 3)), getRandomInt(0, 59));
  obj.room = faker.random.arrayElement(rooms);

  while (filterEvents(obj.room.floor).some(e => isEventsIntersect(obj, e) || isEventsIntersect(e, obj))) {
    obj.dateStart = faker.date.between('2018-01-01', '2018-01-31');
    obj.dateEnd = addMinutes(addHours(obj.dateStart, getRandomInt(1, 3)), getRandomInt(0, 59));
    obj.room = faker.random.arrayElement(rooms);
  }
  for (let j = 0; j < getRandomInt(3, obj.room.capacity); j += 1) {
    obj.users.push(faker.random.arrayElement(users));
  }
  obj.users = Array.from(new Set(obj.users));

  events.push(Object.freeze(obj));
}

module.exports = { rooms, users, events };
