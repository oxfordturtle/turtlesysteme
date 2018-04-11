/**
 * text for the about tab
 */
const { create } = require('dom');

const aboutText = [
  create('h3', { content: 'The Online Turtle System' }),
  create('p', { content: 'This is an online version of the downloadable <i>Turtle System</i>. The interface is comparatively streamlined, and does not provide the complete functionality of its downloadable counterpart. Advanced features of the <i>Turtle Machine</i> (PCode trace and memory watch) have not been implemented, and the compilers cannot handle arrays. Any program you write using arrays must be compiled in the downloadable system; though if you save it there as an Export/Upload file (TGX), it can still be run here.' }),
  create('p', { content: 'At present, online compilers are available only for <i>Turtle BASIC</i> and <i>Turtle Pascal</i>. This means that <i>Turtle Python</i> files can be run (if they have already been compiled), but cannot be edited.' }),
  create('p', { content: 'The PROGAM area on the left of the Home page contains features for opening and saving Turtle programs and editing program text, as well as tabs showing the usage and PCode compilation data (available in the downloadable <i>Turtle System</i> when Power User Mode is enabled). The MACHINE area on the right contains a tab for setting various runtime options, and the Canvas, Console, and Textual output for your programs. Under the memory tab you can also inspect the machine’s memory (available in the downloadable <i>Turtle System</i>, together with much fuller information, when Power User Mode is enabled). The various tabs in the Help page duplicate the information available in the downloadable system under the two QuickHelp tabs.' }),
  create('p', { content: 'The downloadable <i>Turtle System</i> currently exists in two versions: the stable version 11, and the more powerful but still in development version 12. The underlying virtual machine for these two versions is slightly different (the latter supporting strings as arrays, multi-dimensional arrays, and file handling), and consequently a program compiled in one version will not necessary run as intended (or at all) in the other. In due course version 11 (and its underlying machine) will be phased out, but for the time being the <i>Online Turtle System</i> supports both machines. You can switch between these using the drop-down menu next to the language menu above. Note that the online compilers only compile to the version 12 machine, and consequently that if you edit your program online, it will automatically be converted to the new version.' }),
];

module.exports = create('div', { content: aboutText });
