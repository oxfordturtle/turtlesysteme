/**
 * the file handling component
 */
const { element } = require('dom');
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

const fileInput = element('input', {
  type: 'file',
  on: [{ type: 'change', callback: openFile }],
});

const option = example =>
  element('option', { value: example, content: examples.names[example] });

const optgroup = exampleGroup =>
  element('optgroup', {
    label: `${exampleGroup.index}. ${exampleGroup.title}`,
    content: exampleGroup.examples.map(option)
  });

const exampleSelect = examples =>
  element('select', {
    content: examples.map(optgroup),
    on: [
      { type: 'change', callback: openExample },
      { type: 'focus', callback: (e) => { e.currentTarget.selectedIndex = -1; } }
    ]
  });

const fileBox = (title, content) =>
  element('div', {
    classes: ['tsx-file-box'],
    content: [element('h2', { content: title }), content],
  });

const div = element('div', {
  content: [
    fileBox('Open Local File', fileInput),
    fileBox('Open Example Program', exampleSelect(examples.help)),
    fileBox('Open CSAC Book Program', exampleSelect(examples.csac))
  ]
});

// expose the HTML element for this component
module.exports = div;
