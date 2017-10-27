let
  net = require('net'),
  fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  config = require('../config');

// Launches a daemon.
let launch = () => {
  // Check if daemon is alreay launched
  let daemon = connect((err) => {
    if (err) {
      return launchDaemon();
    }
    console.log('Daemon was alreay launched');
    daemon.end();
  });
};

let launchDaemon = () => {
  let log = fs.openSync(config.paths.logFile, 'a');
  let child = spawn(process.execPath || 'node', [
    path.join(path.dirname(fs.realpathSync(__filename)), '../daemon/daemon.js')
  ],{
    cwd: process.cwd(),
    detached: true,
    stdio: ['ipc', log, log]
  });

  child.once('message', (msg) => {
    child.disconnect();
    if (msg.error) {
       console.error(
         msg.error.code === 'EADDRINUSE' ?
           'Error: The socket in use. Daemon has probably already launched.' :
           'Unexpected Error'
      );
    }
    else {
      if (msg.listening) {
        console.log('Daemon has been launched.');
      }
      else {
        console.error('Unexpected message.');
      }
    }
  });

  child.unref();
};

let connect = (cb) => {
  let daemon = net.connect(config.port, () => {
    cb();
  });
  daemon.on('error', () => {
    cb('Error');
  });
  return daemon;
};

let request = (signal, once) => {
  let daemon = connect((err) => {
    if (err) {
      console.error('Daemon needs to be launched. Launch it with: crun launch');
      return;
    }
    daemon.on('data', (data) => {
      process.stdout.write(data.toString('utf8'));
    });

    daemon.write(JSON.stringify(signal));
  });
};

module.exports = {
  launch: launch,

  load: (cog) => {
    request({ 'action': 'load', 'cog': cog });
  },

  reload: (cog) => {
    request({ 'action': 'reload', 'cog': cog });
  },

  stop: (id) => {
    request({ 'action': 'stop', 'id': id });
  },

  run: (id) => {
    request({ 'action': 'run', 'id': id });
  },

  unload: (id) => {
    request({ 'action': 'unload', 'id': id });
  },

  status: (id) => {
    request({ 'action': 'status', 'id': id });
  },

  output: (id) => {
    request({ 'action': 'output', 'id': id });
  },

  quit: () => {
   request({ 'action': 'quit' });
  }
};