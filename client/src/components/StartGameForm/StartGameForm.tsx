import React, { FC, FormEvent } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './StartGameForm.css';

interface IStartGameFormProps {
  onSubmit: (e: FormEvent) => void;
}

const StartGameForm: FC<IStartGameFormProps> = ({ onSubmit }) => (
  <div className="formStart _container">
    <form onSubmit={onSubmit} className="formStart__form">
      <Input
        requared={true}
        placeholder="Enter your name..."
        name="name"
        modify="formStart"
      />
      <Button title="Start Game" type="submit" />
    </form>
  </div>
);

export default StartGameForm;
