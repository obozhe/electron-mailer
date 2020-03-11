import React from 'react';

export const MailBlock = ({ currentMail, mail, setMail }) => {
  const date = `${mail.date.getDate()}.${
    mail.date.getMonth() + 1 < 10 ? '0' + (mail.date.getMonth() + 1) : mail.date.getMonth() + 1
  }`;
  return (
    <li
      className={currentMail && currentMail.messageId === mail.messageId ? 'mailblock active' : 'mailblock'}
      onClick={() => setMail(mail)}
    >
      <div className="mailblock__header">
        <span className="mailblock__sender">{mail.from.text.replace(/ <.+>/, '')}</span>
        <span className="mailblock__date">{date}</span>
      </div>
      <div className="mailblock__body">
        <div className="mailblock__subject">{mail.subject.slice(0, 40) + '...'}</div>
        <div className="mailblock__text">{mail.text ? mail.text.slice(0, 80) + '...' : ''}</div>
      </div>
    </li>
  );
};
