import React, { FC, FormEvent, useEffect, useState } from 'react';
import Form from './components/Form';
import Messages from './components/Messages';

const url = `ws://localhost:3001`;
export const socket = new WebSocket(url);

const App: FC = () => {
  const [messages, setMessages] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!connectionOpen) {
      return;
    }

    const target = e.target as HTMLFormElement;
    // eslint-disable-next-line no-console
    console.log((target.message as HTMLInputElement).value);
    socket.send((target.message as HTMLInputElement).value);
  };

  useEffect(() => {
    socket.addEventListener('message', (event) => {
      // eslint-disable-next-line no-console
      console.log(event.data);
      setMessages(JSON.parse(event.data));
    });

    socket.onclose = (event) => {
      // eslint-disable-next-line no-console
      console.log(`Closed ${event.code}`);
      setConnectionOpen(false);
    };
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit} />
      <Messages messages={messages} />
    </>
  );
};

export default App;
