const _ = require('lodash');

module.exports = ({ file_name }) => ({
  name: _.chain(file_name).camelCase().upperFirst().value(),
  file_name,
});
