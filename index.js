const fs = require('fs');
const Mustache = require('mustache'); 
const path = require('path');
const pify = require('pify');

const TEMPLATES_DIR = process.env.GENIERATOR_PATH || path.join(process.env.HOME, '.genierators');

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

      pify(fs.stat)(fileFrom).then(stat => {
        if (stat.isFile()) return renderFile(fileFrom, vars, fileTo);
        if (stat.isDirectory()) {
          return pify(fs.mkdir)(fileTo).then(() => renderDirectory(fileFrom, vars, fileTo));
        }
      });
    })))
};

const renderTemplate =  function renderTemplate(name, vars) {
  if (!name) throw renderTemplate.Error('Must specify a tempate name');

  const dir = path.join(TEMPLATES_DIR, name);
  const templatePath  = path.join(dir, 'template');
  const varsPath = path.join(dir, 'vars.js');

  if (!fs.existsSync(dir)) throw new renderTemplate.Error(`Template "${name}" not found!`);
  if (!fs.existsSync(templatePath)) throw new renderTemplate.Error(`Template "${name}" has no template folder`);
  if (!fs.existsSync(varsPath)) throw new renderTempalte.Error(`Template "${name}" has no vars`);

  renderDirectory(templatePath, require(varsPath)(vars));
};
renderTemplate.Error = function TemplateRenderError(message) { this.message = message; };

module.exports = renderTemplate;
