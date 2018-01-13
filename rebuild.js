const path = require('path');
const nrc = require('node-run-cmd');

const opts = { onData: d => console.log(d), cwd: path.resolve(__dirname, '.') };
nrc.run('rebuild.bat', opts).then(c => console.log(c));
