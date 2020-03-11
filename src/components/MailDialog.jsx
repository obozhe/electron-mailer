import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default class MailDialog extends Component {
  constructor() {
    super();
    this.state = {
      to: null,
      subject: null,
      text: null,
      sending: false,
      result: '',
      openSnackBar: false
    };

    this.onChangeTo = this.onChangeTo.bind(this);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSendClick = this.onSendClick.bind(this);
  }
  componentDidMount() {
    window.ipcRenderer.on('sendResult', (event, result) => {
      this.setState({
        sending: false,
        result
      });
      result
        ? this.props.openSnackBar({ type: 'success', message: 'Mail is successfuly sent.' })
        : this.props.openSnackBar({
            type: 'error',
            message: 'Something went wrong. Check forms or try again&'
          });
      if (result) this.props.close();
    });
  }

  onChangeTo(e) {
    this.setState({ to: e.target.value });
  }

  onChangeSubject(e) {
    this.setState({ subject: e.target.value });
  }

  onChangeText(e) {
    this.setState({ text: e.target.value });
  }

  onSendClick() {
    this.setState({ sending: true });
    const { to, subject, text } = this.state;
    window.ipcRenderer.send('sendMail', { to, subject, text });
  }

  formValidate() {
    const { to, subject, text } = this.state;
    return (
      !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(to) ||
      !subject ||
      !text
    );
  }

  render() {
    const { close, open } = this.props;
    const { to, subject, text, sending } = this.state;
    return (
      <div className="send-mail">
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={close}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-slide-title">Send mail</DialogTitle>
          <DialogContent>
            <form className="send-mail-form" noValidate>
              <TextField
                type="email"
                error={
                  to !== null &&
                  !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(to)
                }
                onChange={this.onChangeTo}
                label="Send to"
                helperText={
                  to !== null &&
                  !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(to)
                    ? 'Incorrect email.'
                    : ''
                }
                variant="outlined"
                fullWidth={true}
              />
              <TextField
                error={subject !== null && !subject}
                onChange={this.onChangeSubject}
                label="Subject"
                helperText={subject !== null && !subject ? 'Subject is required.' : ''}
                variant="outlined"
                fullWidth={true}
              />
              <TextField
                error={text !== null && !text}
                onChange={this.onChangeText}
                label="Message"
                helperText={text !== null && !text ? 'Message is required.' : ''}
                variant="outlined"
                fullWidth={true}
                multiline={true}
                rows={15}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button disabled={sending} onClick={close}>
              cancel
            </Button>
            <Button disabled={sending || this.formValidate()} onClick={this.onSendClick}>
              send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
