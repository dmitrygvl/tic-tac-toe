import React, { FC, useEffect, useState, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';

import Title from './components/Title/Title';
import StartMenu from './components/StartMenu/StartMenu';
import Rooms from './components/Rooms/Rooms';
import SelectRoom from './components/SelectRoom/SelectRoom';
import Message from './components/Message/Message';
import Game from './components/Game/Game';
import EndGameModal from './components/Modals/EndGameModal/EndGameModal';
import PlayerLeftGameModal from './components/Modals/PlayerLeftGameModal/PlayerLeftGameModal';
import ServerWentDownModal from './components/Modals/ServerWentDownModal/ServerWentDownModal';

import { socketManager } from './WebSocket/socketManager';
import { IPlayer, selectRoom } from './store/slices/roomSlice';
import { selectConnection } from './store/slices/connectionSlice';
import { selectUser } from './store/slices/userSlice';
import { selectRooms } from './store/slices/roomsSlice';
import { selectEndGame } from './store/slices/endGameSlice';
import { selectLeaverName } from './store/slices/leaverNameSlice';
import { selectOfferAndAgreement } from './store/slices/offerAndAgreementSlice';
import './App.css';

interface IState {
  start: boolean;
  newGame: boolean;
  showStatusSelection: boolean;
  showRoomSelection: boolean;
  showRooms: boolean;
  showInput: boolean;
  showMessage: boolean;
  endGame: boolean;
}

const initState: IState = {
  start: false,
  newGame: false,
  showStatusSelection: true,
  showRoomSelection: false,
  showRooms: false,
  showInput: false,
  showMessage: false,
  endGame: false,
};

const App: FC = () => {
  const [state, setState] = useState<IState>(initState);
  const [status, setStatus] = useState<'player' | 'observer' | undefined>(
    undefined,
  );
  const [name, setName] = useState<string>('');

  const connection = useSelector(selectConnection);
  const user = useSelector(selectUser);
  const room = useSelector(selectRoom);
  const rooms = useSelector(selectRooms);
  const endGame = useSelector(selectEndGame);
  const offerAndAgreement = useSelector(selectOfferAndAgreement);
  const leaverName = useSelector(selectLeaverName);

  const handleClickPlayer = () => {
    if (!connection.state) {
      return;
    }

    setState({
      ...state,
      showInput: true,
      showStatusSelection: false,
      showRooms: false,
    });
    setStatus('player');
  };

  const handleClickObserver = () => {
    if (!connection.state) {
      return;
    }

    if (!state.showRooms) {
      setState({ ...state, showRooms: true });
      setStatus('observer');
      socketManager.send({ getAllRooms: true });
    }
  };

  const handleChangeInput = (ev: SyntheticEvent) => {
    if (!connection.state) {
      return;
    }

    if (!(ev.target as HTMLInputElement).value) {
      setState({ ...state, showRooms: false, showRoomSelection: false });
    } else {
      setState({ ...state, showRoomSelection: true });
    }

    setName((ev.target as HTMLInputElement).value);
  };

  const handleClickCreateRoom = () => {
    if (!connection.state) {
      return;
    }

    setState({
      ...state,
      showRoomSelection: false,
      showInput: false,
      showRooms: false,
    });
    socketManager.send({ status, name, createRoom: true });
  };

  const handleClickChooseRoom = () => {
    if (!connection.state) {
      return;
    }

    if (!state.showRooms) {
      setState({ ...state, showInput: false, showRooms: true });
      socketManager.send({ getAllRooms: false });
    }
  };

  const handleClickRoom = (id: string) => {
    if (!connection.state) {
      return;
    }

    setState({ ...state, showRooms: false, showStatusSelection: false });
    socketManager.send({ status, name, roomId: id });
  };

  const handleClickSquare = (index: number) => {
    if (!connection.state) {
      return;
    }
    if (endGame.mix) {
      return;
    }

    if (user.status === 'observer') {
      return;
    }

    if (!user.active) {
      return;
    }

    if (room.field && room.field[index] !== 0) {
      return;
    }

    if (room.players) {
      const passiveUserId = (
        room.players.find((item) => !item.active) as IPlayer
      ).id;

      socketManager.send({
        roomId: room.roomId,
        activeUserId: user.id,
        passiveUserId,
        index,
        value: room.players[0].active ? 1 : 2,
      });
    }
  };

  const handleClickNewGame = () => {
    if (!connection.state) {
      return;
    }
    setState({ ...state, newGame: true, start: false });

    const passiveUserId = room.players?.filter((item) => item.id !== user.id)[0]
      .id;

    socketManager.send({
      newGame: true,
      activeUserId: user.id,
      passiveUserId,
      roomId: room.roomId,
    });
  };

  const handleClickOffer = () => {
    if (!connection.state) {
      return;
    }
    setState({ ...state, newGame: true, start: false });

    const passiveUserId = room.players?.filter((item) => item.id !== user.id)[0]
      .id;

    socketManager.send({
      agreement: true,
      activeUserId: user.id,
      passiveUserId,
      roomId: room.roomId,
    });
  };

  useEffect(() => {
    if ('players' in room && room.players) {
      if (room.players.length === 1) {
        setState({ ...state, showMessage: true, showStatusSelection: false });
      } else if (room.players.length === 2) {
        setState({
          ...state,
          start: true,
          showStatusSelection: false,
          showMessage: false,
          showRoomSelection: false,
        });
      }
    }
  }, [room]);

  useEffect(() => {
    if (endGame.mix) {
      setState({ ...state, endGame: true });
    }
  }, [endGame]);

  useEffect(() => {
    if (offerAndAgreement.agreement) {
      setState({
        ...state,
        endGame: false,
        showMessage: false,
        start: true,
        newGame: false,
      });
    }
  }, [offerAndAgreement]);

  return (
    <main className="_container">
      <Title />
      {state.showStatusSelection && (
        <StartMenu
          onClickPlayer={handleClickPlayer}
          onClickObserver={handleClickObserver}
        />
      )}
      {state.showInput && (
        <input
          data-testid="input"
          type="text"
          className="input-name"
          required
          maxLength={15}
          placeholder="Enter you name"
          value={name}
          onChange={handleChangeInput}
        />
      )}
      {state.showRoomSelection && (
        <SelectRoom
          onClickCreateRoom={handleClickCreateRoom}
          onClickChooseRoom={handleClickChooseRoom}
        />
      )}
      {state.showRooms && (
        <Rooms status={status} rooms={rooms} onClickRoom={handleClickRoom} />
      )}
      {state.showMessage && (
        <Message status={status} roomId={room.roomId ?? ''} />
      )}
      {state.start && <Game onClickSquare={handleClickSquare} />}
      {!leaverName && connection.state && state.endGame && (
        <EndGameModal
          newGame={state.newGame}
          onClickNewGame={handleClickNewGame}
          onClickOffer={handleClickOffer}
          offer={offerAndAgreement.offer}
        />
      )}
      {leaverName && connection.state && (
        <PlayerLeftGameModal leaverName={leaverName} />
      )}
      {!connection.state && connection.message === 'Server went down' && (
        <ServerWentDownModal />
      )}
    </main>
  );
};

export default App;
