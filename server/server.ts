import http from 'http';
import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import store from './store/store';
import { addMessage } from './store/slices/messagesSlice';

const app = express();

const server = http.createServer(app);

const webSocketServer = new WebSocketServer({ server });

const dispatchEvent = (message: WebSocket.Data) => {
  if (typeof message !== 'string') {
    return;
  }

  store.dispatch(addMessage(message));

  webSocketServer.clients.forEach((client) =>
    client.send(JSON.stringify(store.getState().messages)),
  );
};

webSocketServer.on('connection', (ws) => {
  ws.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
  ws.on('message', (msg, isBinary) => {
    const message = isBinary ? msg : msg.toString();
    dispatchEvent(message);
  });
});

server.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://localhost:3001`);
});
