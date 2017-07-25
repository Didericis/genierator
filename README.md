# Installation

`npm install -g genierator`

# Overview

Geniators should be defined within `~/.genierators` or the folder assigned to `GENIERATOR_PATH`

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
