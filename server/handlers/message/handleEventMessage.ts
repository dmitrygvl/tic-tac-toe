import WebSocket from 'ws';
import store from '../../store/store.js';
import { handleCreateRoom } from './utils/handleCreateRoom.js';
import { handleStartGame } from './utils/handleStartGame.js';
import { handleAddObserver } from './utils/handleAddObserver.js';
import { handleStepGame } from './utils/handleStepGame.js';
import { handleNewGame } from './utils/handleNewGame.js';
import { handleAgreement } from './utils/handleAgreement.js';
import {
  selectAllRoomsIds,
  selectAvailableRoomsIds,
} from '../../store/slices/roomsSlice.js';

export interface IReceivedData {
  getAllRooms?: boolean;
  status?: 'player' | 'observer';
  name?: string;
  createRoom?: true;
  roomId?: string;
  index?: number;
  value?: 1 | 2;
  activeUserId?: string;
  passiveUserId?: string;
  newGame?: boolean;
  roomCreator?: string;
  agreement?: boolean;
}

export const handleEventMessage = (message: WebSocket.Data, ws: WebSocket) => {
  try {
    if (typeof message !== 'string') {
      throw new Error(
        'Error receiving data in dispatchEvent. Data is not a string',
      );
    }

    const data: IReceivedData = JSON.parse(message);

    if ('getAllRooms' in data) {
      if (data.getAllRooms) {
        ws.send(JSON.stringify({ rooms: selectAllRoomsIds(store.getState()) }));
      } else {
        ws.send(
          JSON.stringify({ rooms: selectAvailableRoomsIds(store.getState()) }),
        );
      }
    } else if (data.status === 'player') {
      if ('createRoom' in data) {
        handleCreateRoom(data, ws);
      } else {
        handleStartGame(data, ws);
      }
    } else if (data.status === 'observer') {
      handleAddObserver(data, ws);
    } else if ('index' in data) {
      handleStepGame(data);
    } else if ('newGame' in data) {
      handleNewGame(data);
    } else if ('agreement' in data) {
      handleAgreement(data);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error((error as unknown as Error).message);
  }
};
