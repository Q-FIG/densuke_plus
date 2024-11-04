const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    list: path.join(__dirname, "content-scripts/list.js"),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
};