const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const config = require('../config');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: __dirname + '/preload.js'
    }
  });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });
  mainWindow.loadURL(startUrl);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const mailSender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken
    }
  });

  ipc.on('sendMail', (event, mail) => {
    const senMailOptions = {
      from: config.user,
      to: mail.to,
      subject: mail.subject,
      text: mail.text
    };
    console.log(senMailOptions);

    mailSender.sendMail(senMailOptions, (e, r) => {
      if (e) {
        event.sender.send('sendResult', false);
        console.log(e);
      } else {
        event.sender.send('sendResult', true);
        console.log(r);
      }
      mailSender.close();
    });
  });

  const mailGetter = {
    imap: {
      user: config.user,
      password: config.password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        servername: 'imap.gmail.com'
      }
    },
    onmail: function(newMail) {
      mainWindow.webContents.send('newMail', newMail);
    }
  };

  imaps.connect(mailGetter).then(connection =>
    connection.openBox('INBOX').then(() => {
      const yesterday = new Date();
      yesterday.setTime(Date.now() - 245600000);
      const searchCriteria = [['SINCE', yesterday.toISOString()]];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', '']
      };

      ipc.on('getMails', async event => {
        const messages = await connection.search(searchCriteria, fetchOptions);
        event.sender.send('messages', messages);
      });
    })
  );

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});