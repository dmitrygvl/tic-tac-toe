import React, { FC } from 'react';

interface IProps {
  messages: string[];
}

const Messages: FC<IProps> = ({ messages }) => (
  <section className="messages">
    {messages.map((item, i) => (
      <div key={i}>{item}</div>
    ))}
  </section>
);

export default Messages;
