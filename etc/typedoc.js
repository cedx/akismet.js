const {join} = require('path');

module.exports = {
  excludePrivate: true,
  gaID: process.env.GOOGLE_ANALYTICS_ID,
  gitRevision: 'master',
  mode: 'modules',
  name: 'Akismet for JS',
  out: join(__dirname, '../doc/api')
};
