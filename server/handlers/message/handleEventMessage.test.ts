import WebSocket from 'ws';
import { handleEventMessage } from './handleEventMessage.js';
import { handleCreateRoom } from './utils/handleCreateRoom.js';
import { handleStartGame } from './utils/handleStartGame.js';
import { handleAddObserver } from './utils/handleAddObserver.js';
import {
  selectAllRoomsIds,
  selectAvailableRoomsIds,
} from '../../store/slices/roomsSlice.js';

jest.mock('ws');
jest.mock('../../store/store.js', () => ({
  getState: jest.fn(),
}));
jest.mock('./utils/handleCreateRoom.js', () => ({
  handleCreateRoom: jest.fn(),
}));
jest.mock('./utils/handleStartGame.js', () => ({
  handleStartGame: jest.fn(),
}));
jest.mock('./utils/handleAddObserver.js', () => ({
  handleAddObserver: jest.fn(),
}));
jest.mock('./utils/handleStepGame.js', () => jest.fn());
jest.mock('./utils/handleNewGame.js', () => jest.fn());
jest.mock('./utils/handleAgreement.js', () => jest.fn());
jest.mock('../../store/slices/roomsSlice.js', () => ({
  selectAllRoomsIds: jest.fn(),
  selectAvailableRoomsIds: jest.fn(),
}));

describe('handleEventMessage', () => {
  let mockWS: WebSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWS = new WebSocket('ws://localhost');
    mockWS.send = jest.fn();
  });

  it('sends all rooms ids if getAllRooms is true', () => {
    const message = JSON.stringify({ getAllRooms: true });
    const mockRoomsIds = ['room1', 'room2'];
    (selectAllRoomsIds as jest.Mock).mockReturnValue(mockRoomsIds);

    handleEventMessage(message, mockWS);

    expect(mockWS.send).toHaveBeenCalledWith(
      JSON.stringify({ rooms: mockRoomsIds }),
    );
    expect(selectAllRoomsIds).toHaveBeenCalled();
  });

  it('sends available rooms ids if getAllRooms is false', () => {
    const message = JSON.stringify({ getAllRooms: false });
    const mockAvailableRoomsIds = ['room1'];
    (selectAvailableRoomsIds as jest.Mock).mockReturnValue(
      mockAvailableRoomsIds,
    );

    handleEventMessage(message, mockWS);

    expect(mockWS.send).toHaveBeenCalledWith(
      JSON.stringify({ rooms: mockAvailableRoomsIds }),
    );
    expect(selectAvailableRoomsIds).toHaveBeenCalled();
  });

  it('calls handleCreateRoom if status is player and createRoom is true', () => {
    const message = JSON.stringify({
      status: 'player',
      createRoom: true,
      name: 'John',
    });

    handleEventMessage(message, mockWS);

    expect(handleCreateRoom).toHaveBeenCalledWith(JSON.parse(message), mockWS);
  });

  it('calls handleStartGame if status is player but createRoom is not provided', () => {
    const message = JSON.stringify({ status: 'player', name: 'John' });

    handleEventMessage(message, mockWS);

    expect(handleStartGame).toHaveBeenCalledWith(JSON.parse(message), mockWS);
  });

  it('calls handleAddObserver if status is observer', () => {
    const message = JSON.stringify({ status: 'observer', roomId: 'room123' });

    handleEventMessage(message, mockWS);

    expect(handleAddObserver).toHaveBeenCalledWith(expect.anything(), mockWS);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
