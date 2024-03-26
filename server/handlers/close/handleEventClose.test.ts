import WebSocket from 'ws';
import { handleEventClose } from './handleEventClose.js';
import {
  selectUserByWS,
  selectUsersByIds,
} from '../../store/slices/usersSlice.js';
import { selectRoom, unlockRoom } from '../../store/slices/roomsSlice.js';

jest.mock('ws');
jest.mock('../../store/store', () => ({
  dispatch: jest.fn(),
  getState: jest.fn(),
}));
jest.mock('../../store/slices/usersSlice', () => ({
  selectUserByWS: jest.fn(),
  selectUsersByIds: jest.fn(),
}));
jest.mock('../../store/slices/roomsSlice', () => ({
  selectRoom: jest.fn(),
  unlockRoom: jest.fn(),
}));

describe('handleEventClose', () => {
  beforeEach(() => {
    WebSocket.prototype.send = jest.fn();
  });

  it('should unlock room and notify members when a non-observer user leaves', () => {
    const mockWS = new WebSocket('ws://localhost');
    const roomId = 'roomId1';
    const mockUser = { name: 'John', status: 'player', roomId, ws: mockWS };
    const mockRoom = { roomId, players: ['John'], observerIds: [] };
    const mockMembers = [{ ...mockUser, ws: mockWS }];

    (selectUserByWS as jest.Mock).mockReturnValue(mockUser);
    (selectRoom as jest.Mock).mockReturnValue(mockRoom);
    (selectUsersByIds as jest.Mock).mockReturnValue(mockMembers);

    handleEventClose(mockWS);

    expect(unlockRoom).toHaveBeenCalledWith(roomId);
    expect(WebSocket.prototype.send).toHaveBeenCalledWith(
      JSON.stringify({ leaverName: 'John' }),
    );
  });
  it('does nothing special when an observer leaves the room', () => {
    const mockWS = new WebSocket('ws://localhost');
    const observerId = 'observer-id';
    const mockObserver = {
      id: observerId,
      name: 'Observer',
      status: 'observer',
      roomId: 'roomId1',
      ws: mockWS,
    };

    (selectUserByWS as jest.Mock).mockReturnValue(mockObserver);
    (selectRoom as jest.Mock).mockReturnValue(undefined);

    handleEventClose(mockWS);

    expect(unlockRoom).not.toHaveBeenCalled();
    expect(WebSocket.prototype.send).not.toHaveBeenCalled();
  });

  it('unlocks the room when the last active player leaves', () => {
    const mockWS = new WebSocket('ws://localhost');
    const playerId = 'player-id';
    const mockPlayer = {
      id: playerId,
      name: 'Player',
      status: 'player',
      roomId: 'roomId1',
      ws: mockWS,
    };
    const mockRoom = {
      roomId: 'roomId1',
      players: [mockPlayer],
      observerIds: [],
      available: false,
    };

    (selectUserByWS as jest.Mock).mockReturnValue(mockPlayer);
    (selectRoom as jest.Mock).mockReturnValue(mockRoom);
    (selectUsersByIds as jest.Mock).mockReturnValue([mockPlayer]);

    handleEventClose(mockWS);

    expect(unlockRoom).toHaveBeenCalledWith('roomId1');
  });
});
