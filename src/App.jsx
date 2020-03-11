import React from 'react';
import MailDialog from './components/MailDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import _ from 'lodash';
const simpleParser = require('mailparser').simpleParser;

import MailsList from './components/MailsList';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      mails: [],
      openSendMail: false,
      snackBar: null
    };

    this.openSendMailDialog = this.openSendMailDialog.bind(this);
    this.closeSendMailDialog = this.closeSendMailDialog.bind(this);
    this.closeSnackBar = this.closeSnackBar.bind(this);
  }

  componentDidMount() {
    window.ipcRenderer.send('getMails');

    window.ipcRenderer.on('messages', (event, messages) => {
      this.setState({ mails: [] });
      messages.forEach(item => {
        const all = _.find(item.parts, { which: '' });
        const id = item.attributes.uid;
        const idHeader = `Imap-Id: ${id}\r\n`;

        simpleParser(idHeader + all.body, (err, mail) => {
          this.setState({ mails: [...this.state.mails, mail] });
        });
      });
    });

    window.ipcRenderer.on('newMail', () => {
      this.setState({
        snackBar: { type: 'info', message: 'New mail received!' }
      });
      window.ipcRenderer.send('getMails');
    });
  }

  componentDidUpdate() {
    console.log(this.state.mails);
  }

  openSendMailDialog() {
    this.setState({ openSendMail: true });
  }

  closeSendMailDialog() {
    this.setState({ openSendMail: false });
  }

  openSnackBar(snackBar) {
    this.setState({ snackBar });
  }

  closeSnackBar() {
    this.setState({ snackBar: null });
  }

  render() {
    const { mails, openSendMail, snackBar } = this.state;

    return (
      <div className="App">
        <MailsList mails={mails} sendMail={this.openSendMailDialog} />
        {openSendMail && (
          <MailDialog
            open={openSendMail}
            openSnackBar={result => this.openSnackBar(result)}
            close={this.closeSendMailDialog}
          />
        )}
        {snackBar && (
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={snackBar ? true : false}
            autoHideDuration={3000}
            onClose={this.closeSnackBar}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={this.closeSnackBar}
              severity={snackBar.type}
            >
              {snackBar.message}
            </MuiAlert>
          </Snackbar>
        )}
      </div>
    );
  }
}

export default App;
