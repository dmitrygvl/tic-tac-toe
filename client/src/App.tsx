import React, { FC, useEffect, useState } from 'react';
import { UseSelector } from 'react-redux';
import Title from './components/Title/Title';
import StartMenu from './components/StartMenu/StartMenu';
import StartGameForm from './components/StartGameForm/StartGameForm';
import './App.css';

const url = `ws://localhost:3001`;
export const socket = new WebSocket(url);

const App: FC = () => {
  const [rounds, setRounds] = useState([]);
  const [connectionOpen, setConnectionOpen] = useState(true);
  const [showFormStart, setShowFormStart] = useState(false);

  const handleClickPlayer = () => {
    if (!connectionOpen) {
      return;
    }

    setShowFormStart(true);
  };

  const handleClickObserver = () => {
    if (!connectionOpen) {
      return;
    }

    socket.send('getRounds');
  };

  const handleSubmitFormStart = (ev: React.SyntheticEvent) => {
    ev.preventDefault();

    if (!connectionOpen) {
      return;
    }

    const target = ev.target as typeof ev.target & {
      name: { value: string };
    };

    socket.send(JSON.stringify({ status: 'player', name: target.name.value }));
  };

  const handleClickRound = (id: string) => {
    if (!connectionOpen) {
      return;
    }

    socket.send(JSON.stringify({ status: 'observer', roundId: id }));

    setRounds([]);
  };

  const handleSocketEventMessage = (event: MessageEvent) => {
    console.log(event.data);

    const data = JSON.parse(event.data);

    if ('rounds' in data) {
      setRounds(data.rounds);
    }
  };

  const handleSocketEventClose = (event: CloseEvent) => {
    console.log(`Closed ${event.code}`);
    setConnectionOpen(false);
  };

  useEffect(() => {
    socket.addEventListener('message', handleSocketEventMessage);

    socket.addEventListener('close', handleSocketEventClose);

    return () => {
      socket.removeEventListener('message', handleSocketEventMessage);

      socket.removeEventListener('close', handleSocketEventClose);
    };
  }, []);

  return (
    <>
      <Title />
      <StartMenu
        onClickPlayer={handleClickPlayer}
        onClickObserver={handleClickObserver}
      />
      {showFormStart && <StartGameForm onSubmit={handleSubmitFormStart} />}
      <Rounds rounds={rounds} onClickRound={handleClickRound} />
    </>
  );
};

export default App;
