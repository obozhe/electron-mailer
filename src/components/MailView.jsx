import React from 'react';
import ReactHtmlParser from 'react-html-parser';

export const MailView = ({ mail }) => {
  const setIframeHeight = e => {
    e.target.height = '';
    e.target.height = e.target.contentWindow.document.body.scrollHeight;
  };

  return (
    <div>
      <div className="mail-view">
        <div className="mail-view__header">
          <div className="mail-view__sender__wrapper">
            <span>from: {ReactHtmlParser(mail.from.html)}</span>
            <span>
              <small>{mail.date.toString().slice(0, 21)}</small>
            </span>
          </div>
          <div>to: {ReactHtmlParser(mail.to.html)}</div>
        </div>
        <div className="mail-view__body">
          {mail.html ? (
            <iframe
              width="100%"
              height="100%"
              id="iframe"
              display="initial"
              // className="mail-view__body-html"
              src={'data:text/html,' + encodeURIComponent(mail.html)}
              frameBorder="0"
              onLoad={setIframeHeight}
            ></iframe>
          ) : (
            mail.text
          )}
        </div>
      </div>
    </div>
  );
};
