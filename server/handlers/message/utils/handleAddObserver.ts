import WebSocket from 'ws';
import {
  addUser,
  createUser,
  selectUsersByIds,
  updataUserRoomId,
} from '../../../store/slices/usersSlice.js';
import { IReceivedData } from '../handleEventMessage.js';
import store from '../../../store/store.js';
import {
  addObserverToTheRoom,
  selectRoom,
} from '../../../store/slices/roomsSlice.js';
import { transformUserToSend } from '../../../util.js';

export const handleAddObserver = (data: IReceivedData, ws: WebSocket) => {
  const observer = createUser(
    data.status!,
    'observer',
    ws as unknown as WebSocket,
  );
  store.dispatch(addUser(observer));

  store.dispatch(
    updataUserRoomId({ userId: observer.id, roomId: data.roomId! }),
  );

  store.dispatch(
    addObserverToTheRoom({ roomId: data.roomId!, observerId: observer.id }),
  );

  const room = selectRoom(store.getState(), data.roomId!);

  if (!room) {
    throw new Error('No room found when creating an observer!');
  }

  const userToSend = transformUserToSend(observer);

  const members = selectUsersByIds(
    store.getState(),
    room.players,
    room.observerIds,
  );

  for (const member of members) {
    if (member.id === observer.id) {
      member.ws.send(JSON.stringify({ user: userToSend, room }));
    } else {
      member.ws.send(JSON.stringify({ room }));
    }
  }
};
