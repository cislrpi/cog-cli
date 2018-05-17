#!/usr/bin/env node
let
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  program = require('commander'),
  bridge = require('./bridge'),
  config = require('../config');

program.version('0.3');

let loadCogFile = (file, next) => {
  let fileName = path.resolve(process.cwd(), file || 'cog.json');

  if (!fs.existsSync(fileName)) {
    return next(`"${(file || 'cog.json')}" - file not found.`);
  }

  try {
    let cog = JSON.parse(fs.readFileSync(fileName));
    cog.path = cog.path || path.dirname(fileName);
    if (cog.port && !cog.host) {
      cog.host = 'http://' + os.hostname();
    }
    next(null, cog);
  }
  catch(err) {
    next('Error loading and parsing cog.json');
  }
};

program.command('launch')
  .description('Launches daemon.')
  .action(bridge.launch);

program.command('load [file]')
  .alias('start')
  .description('Load and run a cog application.')
  .action((file) => {
    loadCogFile(file, (err, cog) => {
      if (err) {
        return console.error(err);
      }
      bridge.load(cog);
    });
  });

program.command('reload [file]')
  .description('Stop, Unload and load cog again.')
  .action((file) => {
    loadCogFile(file, (err, cog) => {
      if (err) {
        return console.error(err);
      }
      bridge.reload(cog);
    });
  });


program.command('stop <cog_id>')
  .description('Stop a running cog.')
  .action(bridge.stop);

program.command('run <cog_id>')
  .description(`Run a stopped cog.`)
  .action(bridge.run);

program.command('unload <cog_id>')
  .alias('remove')
  .description(`Unload a stopped cog.`)
  .action(bridge.unload);

program
  .command('status [cog_id]')
  .description(`Show status of all cogs, or details of specified cog.`)
  .action(bridge.status);

program.command('output [cog_id]')
  .description(`Listen to stdout/stderr output from all cogs or a specified cog.`)
  .action(bridge.output);

program.command('quit')
  .description(`Exit daemon, and terminates all of its cogs.`)
  .action(bridge.quit);

program.command('config')
  .description(`Show configuration. 'crun config --h' to learn more`)
  .option('-u, --username [username]', 'Set or get current username')
  .option('-k, --key [key]', 'Set or get current API key')
  .action((options) => {
    let cfg = config.getCfg();

    if (options.username === true) {
      return console.log(cfg.username || 'username is not set yet.');
    }

    if (options.key === true) {
      return console.log(cfg.key || 'key is not set yet.');
    }

    if (!options.key && !options.username) {
      for (let k in cfg) {
        if (cfg.hasOwnProperty(k)) {
          console.log(`${k}: ${cfg[k]}`);
        }
      }
      return;
    }

    if (options.key) {
      cfg.key = options.key;
    }
    if (options.username) {
      cfg.username = options.username;
    }

    config.saveCfg(cfg, (err) => {
      if (err) console.log('Error saving config.');
      else console.log('Config updated.');
    });
  });

program.action(function() {
  console.log('Invalid option.')
});

program.parse(process.argv);

if (program.args.length === 0) {
  console.log(program.helpInformation());
}