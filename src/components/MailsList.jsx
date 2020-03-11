import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import MailIcon from '@material-ui/icons/Mail';
import { MailBlock } from './MailBlock';
import { MailView } from './MailView';

export default class MailsList extends Component {
  constructor() {
    super();
    this.state = {
      currentMail: null,
      sendMail: false
    };
  }

  setCurrentMail(currentMail) {
    console.log(currentMail);
    this.setState({ currentMail });
  }

  render() {
    const { mails, sendMail } = this.props;
    const { currentMail } = this.state;
    return (
      <div className="mails-list__wrapper">
        <div className="mails-list__overflow">
          <div className="write">
            <Button variant="contained" color="primary" onClick={sendMail} startIcon={<MailIcon />}>
              Send new mail
            </Button>
          </div>
          <ul className="mails-list">
            {mails
              .sort((a, b) => b.date - a.date)
              .map(mail => (
                <MailBlock
                  key={mail.messageId}
                  currentMail={currentMail}
                  mail={mail}
                  setMail={mail => this.setCurrentMail(mail)}
                />
              ))}
          </ul>
        </div>

        <div className="mails-list__overflow">
          {currentMail ? (
            <MailView mail={currentMail} />
          ) : (
            <div className="mails-list-placeholder">
              <MailIcon style={{fontSize: '100px'}}/> 
              <div>Choose mail from mails list</div>             
            </div>
          )}
        </div>
      </div>
    );
  }
}
