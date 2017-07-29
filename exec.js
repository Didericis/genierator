const renderTemplate = require('./index');
const minimist = require('minimist');
const _ = require('lodash');

module.exports = function exec() {
  try {
    return renderTemplate(arguments[0], Object.assign(
      minimist(Array.apply(arguments).slice(2)), 
      { file_name: _.snakeCase(arguments[1]) }
    ));
  } catch (e) {
    if (e instanceof renderTemplate.Error) {
      console.error(e.message);
      return Promise.resolve(false);
    }
    throw e;
  }
}
