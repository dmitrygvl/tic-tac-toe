import WebSocket from 'ws';
import { handleEventOpen } from './handleEventOpen.js';

describe('handleEventOpen', () => {
  let mockSend: jest.Mock;
  let mockWS: { send: jest.Mock };

  beforeEach(() => {
    mockSend = jest.fn();
    mockWS = { send: mockSend };
  });

  it('sends a connection message when the connection is opened', () => {
    handleEventOpen(mockWS as unknown as WebSocket);

    expect(mockSend).toHaveBeenCalledWith(
      JSON.stringify({ connectionMessage: 'Hello!' }),
    );
  });

  it('logs an error if sending the message fails', () => {
    const errorMessage = 'Failed to send message';
    mockSend.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    handleEventOpen(mockWS as unknown as WebSocket);

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    consoleSpy.mockRestore();
  });
});
