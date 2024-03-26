import WebSocket from 'ws';
import {
  selectUserByWS,
  selectUsersByIds,
} from '../../store/slices/usersSlice.js';
import store from '../../store/store.js';
import { selectRoom, unlockRoom } from '../../store/slices/roomsSlice.js';

export const handleEventClose = (ws: WebSocket) => {
  try {
    const user = selectUserByWS(store.getState(), ws);

    if (!user) {
      throw new Error(
        "When closing WS connection on user's initiative - user not found",
      );
    }

    if (user.status === 'observer' || !user.roomId) {
      return;
    }

    const room = selectRoom(store.getState(), user.roomId);

    if (!room) {
      throw new Error(
        "When closing WS connection on user's initiative - room not found",
      );
    }

    store.dispatch(unlockRoom(room.roomId));

    const members = selectUsersByIds(
      store.getState(),
      room.players,
      room.observerIds,
    );

    for (const member of members) {
      member.ws.send(JSON.stringify({ leaverName: user.name }));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error((error as unknown as Error).message);
  }
};
