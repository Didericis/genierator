# Overview

Uses the [mustache](https://mustache.github.io/) templating engine to generate boilerplate. Click [here](http://blog.dideric.is/2017/07/22/Creating-boilerplate-in-vim/) for an article explaining why it was made.

# Installation

`npm install -g genierator`

# Usage

Genierators should be defined within `~/.genierators` or the folder assigned to `GENIERATOR_PATH`

### Define

```
react-component/  <-- Name of your genierator
  vars.js         <-- Exports a function defining variables
  template/       <-- Everything within this folder will be cloned and rendered with mustache
    {{file_name}}/
      index.js
      {{file_name}}.jsx
      {{file_name}}.css
      {{file_name}}.md
      {{file_name}}.spec.js
```

### Generate

`genierate react-component my_awesome_component --var="Some Variable Value"`

```
my_awesome_component/
  index.js
  my_awesome_component.jsx
  my_awesome_component.css
  my_awesome_component.md
  my_awesome_component.spec.js
```

### Vim/Nerdtree

If you want to use this library within Vim/Nerdtree, checkout [nerdtree-generator-plugin](https://github.com/Didericis/nerdtree-genierator-plugin)

# Examples

A sample genierator can be cloned from [here](https://github.com/Didericis/sample-genierators/tree/master)
