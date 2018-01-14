const { areRangesOverlapping, getTime, startOfDay, addDays } = require('date-fns');

function eventsIntersect(event1date, event2date) {
  return areRangesOverlapping(event1date.start, event1date.end, event2date.start, event2date.end);
}

function getSortCriterion(roomFloor, members) {
  return members.reduce((total, { floor }) => total + Math.abs(roomFloor - floor), 0);
}

function getRecommendationSortCriterion(r1) {}

function sortRoomsFn(members) {
  return function sortRooms(r1, r2) {
    // комнаты идут тем раньше, чем меньше суммарное количество этажей,
    // которые нужно пройти участникам
    return getSortCriterion(r1.floor, members) - getSortCriterion(r2.floor, members);
  };
}

function getFreeRooms(date, members, { events, rooms: _rooms }) {
  // требуемая емкость комнаты равна количеству участников
  const requiredCapacity = members.length;
  // интересуют только комнаты подходящей емкости
  const rooms = _rooms.filter(r => r.capacity >= requiredCapacity);

  // найдем переговорки, занятые в указанное время
  // для этого надо понять, какие события пересекаются с указанным
  // NOTE: не следует передавать события, не лежащие в указанном дне
  // это возможные кандидаты на перенос, если не будет свободных комнат
  const overlappingEvents = events.filter(e => eventsIntersect(e.date, date));

  // id занятых комнат
  const occupiedRoomsIds = new Set(overlappingEvents.map(e => e.room));
  // свободные комнаты, упорядоченные по критерию пройденных этажей
  const freeRooms = rooms.filter(r => !occupiedRoomsIds.has(r.id)).sort(sortRoomsFn(members));
  return { overlappingEvents, freeRooms };
}

function getRecommendationWithDataTransform(dateStart, dateEnd, users, events, rooms) {
  // приведем данные к виду, который заявлен в описании интерфейса
  // на случай если в Яндексе заготовили тесты для этой функции
  const recommendations = getRecommendation(
    { start: getTime(dateStart), end: getTime(dateEnd) },
    users.map(({ login, avatarUrl: avatar, homeFloor: floor }) => {
      return {
        login,
        avatar,
        floor,
      };
    }),
    {
      events: events.map(({ id, title, Users: users, dateStart: start, dateEnd: end, Room: room }) => {
        return {
          id,
          title,
          members: users.map(({ login, homeFloor: floor }) => {
            return { login, floor };
          }),
          date: { start: getTime(start), end: getTime(end) },
          room: room.id,
        };
      }),
      rooms: rooms.map(({ id, title, capacity, floor }) => {
        return { id, title, capacity, floor };
      }),
    }
  );
  return recommendations.map(({ date, room, swap }) => {
    return {
      dateStart: new Date(date.start),
      dateEnd: new Date(date.end),
      roomId: room,
      swaps: swap.map(({ event, room }) => {
        return {
          eventId: event,
          roomId: room,
        };
      }),
    };
  });
}

function getRecommendation(date, members, { events, rooms }) {
  const { overlappingEvents, freeRooms } = getFreeRooms(date, members, { events, rooms });
  // если нашлись свободные комнаты
  if (freeRooms.length)
    return freeRooms.map(r => {
      return { date, room: r.id, swap: [] };
    });

  function sortRecomendations(r1, r2) {
    return r1.totalCriterion - r2.totalCriterion;
  }

  // иначе попробуем освободить комнаты
  const recomendations = rooms
    .map(room => {
      // комнаты малой вместимости не интересуют
      if (room.capacity < members.length) return;
      // для каждого из пересекающихся событий из энной комнаты
      // найдем свободную комнату-кандидата на перенос, первую по критерию
      const possibleSwaps = overlappingEvents.filter(e => e.room === room.id).map(e => {
        const { freeRooms } = getFreeRooms(e.date, e.members, { events, rooms: rooms.filter(r => r.id !== e.room) });
        if (freeRooms.length)
          return {
            event: e.id,
            room: freeRooms[0].id,
            criterion: getSortCriterion(freeRooms[0].floor, e.members),
          };
      });
      // если вариант переноса нашелся для всех событий - сформируем рекомендацию
      if (possibleSwaps.every(s => s))
        return {
          date,
          room: room.id,
          swap: possibleSwaps,
          totalCriterion: possibleSwaps.reduce(
            (total, { criterion }) => total + criterion,
            getSortCriterion(room.floor, members)
          ),
        };
    })
    .filter(r => r)
    .sort(sortRecomendations); // оставим непустые рекомендации и отсортируем по суммарному критерию всех переносов и новой встречи
  // если есть переносы - вернем их
  if (recomendations.length) return recomendations;
  // в ином случае попытаемся подобрать более позднее время

  const requiredDuration = date.end - date.start;
  const timeChangeRecommendations = rooms
    .map(room => {
      if (room.capacity < members.length) return;
      // инетерсуют события в данной комнате, заканчивающиеся после предполагаемого начала
      const roomsEvents = events
        .filter(e => e.room === room.id && e.date.end > date.start)
        .sort((e1, e2) => e1.date.start - e2.date.start);
      // в роли последнего события добавим начало следующих суток
      roomsEvents.push({ date: { start: getTime(addDays(startOfDay(date.start), 1)) } });
      // рассмотрим промежутки между этими событиями - туда будем пробовать вписать нашу встречу
      for (let i = 1; i < roomsEvents.length; i += 1) {
        const [leftHandEvent, rightHandEvent] = roomsEvents.slice(i - 1, i + 1);
        const freeSpace = rightHandEvent.date.start - leftHandEvent.date.end;
        if (freeSpace >= requiredDuration) {
          // нашли свободное место!
          return {
            date: { start: leftHandEvent.date.end, end: leftHandEvent.date.end + requiredDuration },
            room: room.id,
            swap: [],
          };
        }
      }
    })
    .filter(r => r)
    .sort((r1, r2) => r1.date.start - r2.date.start); // отсортируем по времени начала встречи

  return timeChangeRecommendations;
}

module.exports = {
  getRecommendationWithDataTransform,
  getRecommendation,
};
