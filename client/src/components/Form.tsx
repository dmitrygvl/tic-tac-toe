import React, { FC, FormEvent } from 'react';

interface IProps {
  onSubmit: (ev: FormEvent) => void;
}

const Form: FC<IProps> = ({ onSubmit }) => (
  <form className="publish" onSubmit={onSubmit}>
    <input type="text" name="message" max="50" required />
    <input type="submit" value="Send" />
  </form>
);

export default Form;
