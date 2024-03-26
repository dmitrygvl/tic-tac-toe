import WebSocket from 'ws';

export const handleEventOpen = (ws: WebSocket) => {
  try {
    ws.send(JSON.stringify({ connectionMessage: 'Hello!' }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error((error as unknown as Error).message);
  }
};
