import React, { FC } from 'react';
import './SelectRoom.css';
import Button from '../Button/Button';

interface ISelectRoomProps {
  onClickCreateRoom: () => void;
  onClickChooseRoom: () => void;
}

const SelectRoom: FC<ISelectRoomProps> = ({
  onClickCreateRoom,
  onClickChooseRoom,
}) => (
  <div className="room-menu">
    <div className="room-menu__buttons">
      <Button
        title="Create room"
        onClick={onClickCreateRoom}
        testId="btnCreateRoom"
      />
      <Button
        title="Choose room"
        onClick={onClickChooseRoom}
        testId="btnChooseRoom"
      />
    </div>
  </div>
);

export default SelectRoom;
