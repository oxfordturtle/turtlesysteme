/**
 * the file handling component
 */
require('styles/file.scss');
const { create } = require('dom');
const { examples } = require('data');
const state = require('state');

const openFile = (e) => {
  const file = e.currentTarget.files[0];
  const fr = new FileReader();
  fr.onload = () => {
    state.send('set-file', { filename: file.name, content: fr.result });
  };
  fr.readAsText(file);
};

const openExample = (e) => {
  state.send('set-example', e.currentTarget.value);
};

const fileInput = create('input', {
  type: 'file',
  on: [{ type: 'change', callback: openFile }],
});

const option = example =>
  create('option', { value: example, content: examples.names[example] });

const optgroup = exampleGroup =>
  create('optgroup', {
    label: `${exampleGroup.index}. ${exampleGroup.title}`,
    content: exampleGroup.examples.map(option)
  });

const exampleSelect = examples =>
  create('select', {
    content: examples.map(optgroup),
    on: [
      { type: 'change', callback: openExample },
      { type: 'focus', callback: (e) => { e.currentTarget.selectedIndex = -1; } }
    ]
  });

const fileBox = (title, content) =>
  create('div', {
    classes: ['tsx-file-box'],
    content: [create('h2', { content: title }), content],
  });

const div = create('div', {
  content: [
    fileBox('Open Local File', fileInput),
    fileBox('Open Example Program', exampleSelect(examples.help)),
    fileBox('Open CSAC Book Program', exampleSelect(examples.csac))
  ]
});

// expose the HTML element for this component
module.exports = div;
