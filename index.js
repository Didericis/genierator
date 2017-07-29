const fs = require('fs');
const Mustache = require('mustache'); 
const path = require('path');
const pify = require('pify');

const renderFile = function renderFile(from, vars, to = process.cwd()) {
  return pify(fs.readFile)(from, 'utf8')
    .then(data => pify(fs.writeFile)(to, Mustache.render(data, vars)))
};

const renderDirectory = function renderDirectory(from, vars, to = process.cwd()) {
  return pify(fs.readdir)(from)
    .then(files => Promise.all(files.map(file => {
      const fileFrom = path.join(from, file);
      const fileName = Mustache.render(file, vars);
      const fileTo = path.join(to, fileName);

      return pify(fs.stat)(fileFrom).then(stat => {
        if (stat.isFile()) return renderFile(fileFrom, vars, fileTo);
        if (stat.isDirectory()) {
          return pify(fs.mkdir)(fileTo).then(() => renderDirectory(fileFrom, vars, fileTo));
        }
      });
    })))
};

const renderTemplate =  function renderTemplate(name, vars) {
  const TEMPLATES_DIR = process.env.GENIERATOR_PATH || path.join(process.env.HOME, '.genierators');
  if (!name) throw renderTemplate.Error('Must specify a tempate name');

  const dir = path.join(TEMPLATES_DIR, name);
  const templatePath  = path.join(dir, 'template');
  const varsPath = path.join(dir, 'vars.js');

  if (!fs.existsSync(dir)) {
    throw new renderTemplate.Error(`Genierator "${name}" not found in ${TEMPLATES_DIR}`);
  } if (!fs.existsSync(templatePath)) {
    throw new renderTemplate.Error(`Could not find "template/" for genierator "${name}"`);
  } if (!fs.existsSync(varsPath)) {
    throw new renderTemplate.Error(`Could not find "vars.js" for genierator "${name}"`);
  } if (!vars.file_name) {
    throw new renderTemplate.Error('Must specify a filename!');
  }

  return renderDirectory(templatePath, require(varsPath)(vars));
};
renderTemplate.Error = function TemplateRenderError(message) { this.message = message; };

module.exports = renderTemplate;
