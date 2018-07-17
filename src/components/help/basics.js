/**
 * text for the basics help tab
 */
const { create } = require('dom');
const state = require('state');

const BASIC = [
  create('h3', { content: 'Programs and Procedures: the Basics' }),
  create('p', { content: 'The simplest BASIC programs take this form:' }),
  create('pre', { content: `<code>${state.highlight('REM myprog  [this is a comment]\nREM [program commands]\nEND', 'BASIC')}</code>` }),
  create('p', { content: `The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings 2&rsquo; program introduces a global variable: it is called <code>${state.highlight('ringsize%', 'BASIC')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; by assigning a value, like this:` }),
  create('pre', { content: `<code>${state.highlight('ringsize% = 130\nREM [other program commands]\nEND', 'BASIC')}</code>` }),
  create('p', { content: 'Complicated programs are usually divided into subroutines, to separate the various tasks and make them easier to understand. BASIC has two types of subroutine, procedures (which are like mini-programs) and functions (which are designed to calculate some value).' }),
  create('p', { content: `The &lsquo;Simple procedure&rsquo; example program has a procedure to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Procedures fit into a BASIC program after the end of the main program, indicated by <code>${state.highlight('END', 'BASIC')}</code>. They look like this:` }),
  create('pre', { content: `<code>${state.highlight('DEF PROCmyprocedure(par1%)\n  LOCAL local1%, local2$\n  REM [procedure commands]\nENDPROC', 'BASIC')}</code>` }),
  create('p', { content: `All procedure names must begin with &lsquo;PROC&rsquo;, e.g. &lsquo;PROCmyprocedure&rsquo;. A procedure can have its own local variables, declared using <code>${state.highlight('LOCAL', 'BASIC')}</code>. A <code>${state.highlight('PRIVATE', 'BASIC')}</code> variable is declared the same way, but unlike a <code>${state.highlight('LOCAL', 'BASIC')}</code> variable, it retains its value between procedure calls. A procedure can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${state.highlight('par1%', 'BASIC')}</code> above).` }),
  create('p', { content: 'A function is similar to a procedure, with the addition that it returns a value. Also a function name must begin with &lsquo;FN&rsquo;, for example:' }),
  create('pre', { content: `<code>${state.highlight('DEF FNmyfunction(par1%)\n  REM [procedure commands]\n  = "output"', 'BASIC')}</code>` }),
  create('p', { content: `The last statement of a function always begins with <code>${state.highlight('=', 'BASIC')}</code> and the <code>${state.highlight('"output"', 'BASIC')}</code> provides the return value for the function.` }),
  create('h4', { content: 'Reserved Words, Declarations, Types, and Variables' }),
  create('p', { content: `The words <code>${state.highlight('REM', 'BASIC')}</code>, <code>${state.highlight('END', 'BASIC')}</code>, <code>${state.highlight('DEF', 'BASIC')}</code>, etc. are all capitalized to emphasise the program structure. BASIC takes notice of capitalization. These three words are also in red here (or gray for comments) – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;END&rsquo;).` }),
  create('p', { content: 'Variables all end with either a &lsquo;%&rsquo; or a &lsquo;$&rsquo; – Turtle will tell you if you forget! Turtle BASIC allows two types of variables:' }),
  create('table', {
    classes: ['tsx-help-table'],
    content: [
      create('tr', { content: '<td>integer</td><td>whole number (name ends in &lsquo;%&rsquo;)</td>' }),
      create('tr', { content: '<td>string</td><td>sequence of characters (name ends in &lsquo;$&rsquo;)</td>' }),
    ]
  }),
  create('p', { content: `Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings 2&rsquo; example program, <code>${state.highlight('ringsize%', 'BASIC')}</code> is declared by assigning the value <code>${state.highlight('130', 'BASIC')}</code> using the command:` }),
  create('pre', { content: `<code>${state.highlight('ringsize% = 130', 'BASIC')}</code>` }),
  create('p', { content: 'Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:' }),
  create('table', {
    classes: ['tsx-help-table'],
    content: [
      create('tr', { content: `<td><code>${state.highlight('TURTX%', 'BASIC')}</code></td><td>The Turtle&rsquo;s x-coordinate</td>` }),
      create('tr', { content: `<td><code>${state.highlight('TURTY%', 'BASIC')}</code></td><td>The Turtle&rsquo;s y-coordinate</td>` }),
      create('tr', { content: `<td><code>${state.highlight('TURTD%', 'BASIC')}</code></td><td>The Turtle&rsquo;s direction</td>` }),
      create('tr', { content: `<td><code>${state.highlight('TURTT%', 'BASIC')}</code></td><td>The Turtle&rsquo;s pen thickness</td>` }),
      create('tr', { content: `<td><code>${state.highlight('TURTC%', 'BASIC')}</code></td><td>The Turtle&rsquo;s colour setting</td>` }),
    ]
  }),
  create('p', { content: 'These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.' }),
  create('p', { content: `For a use of <code>${state.highlight('TURTD%', 'BASIC')}</code>, see the &lsquo;Simple procedure&rsquo; example.` }),
];

const Pascal = [
  create('h3', { content: 'Programs and Procedures: the Basics' }),
  create('p', { content: 'The simplest Pascal programs take this form:' }),
  create('pre', { content: `<code>${state.highlight('PROGRAM myprog;\nBEGIN\n  {program commands}\nEND.', 'Pascal')}</code>` }),
  create('p', { content: `The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings 2&rsquo; program introduces a global variable: it is called <code>${state.highlight('ringsize', 'Pascal')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; at the beginning of the program, like this:` }),
  create('pre', { content: `<code>${state.highlight('PROGRAM myprog;\nVAR global1: integer;\n    global2, global3: integer;\nBEGIN\n  {program commands}\nEND.', 'Pascal')}</code>` } ),
  create('p', { content: `Complicated programs are usually divided into subroutines, to separate the various tasks and make them easier to understand. Pascal has two types of subroutine, procedures (which are like mini-programs) and functions (which are designed to calculate some value). The &lsquo;Simple procedure&rsquo; example program has a procedure to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Procedures fit into a Pascal program after the global variables and before the <code>${state.highlight('BEGIN', 'Pascal')}</code> of the main program; they look like this:` }),
  create('pre', { content: `<code>${state.highlight('Procedure myprocedure(par1: integer);\nVar local1, local2: integer;\nBegin\n  {procedure commands}\nEnd;', 'Pascal')}</code>` }),
  create('p', { content: `A procedure can have its own local variables, declared much like global variables. But it can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${state.highlight('par1', 'Pascal')}</code> above).` }),
  create('h4', { content: 'Reserved Words, Declarations, Types, and Variables' }),
  create('p', { content: `The words <code>${state.highlight('PROGRAM', 'Pascal')}</code>, <code>${state.highlight('BEGIN', 'Pascal')}</code> and <code>${state.highlight('END', 'Pascal')}</code> are often capitalized to emphasise the program structure, but Pascal actually takes no notice of capitalization (so you could write <code>${state.highlight('program', 'Pascal')}</code>, <code>${state.highlight('Program', 'Pascal')}</code> or even <code>${state.highlight('PrOgRaM', 'Pascal')}</code>!). These three words are also in red here – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;begin&rsquo;). As well as variables, a program can use constants to give a convenient name to a particular value. Any constants must be &lsquo;declared&rsquo; even before the variables, like this:` }),
  create('pre', { content: `<code>${state.highlight('PROGRAM myprog;\nCONST limit = 4;\nVAR global1: integer;\n{and so on}', 'Pascal')}</code>` }),
  create('p', { content: `Notice that variable and constant declarations must all end with a semicolon – Turtle will tell you if you forget! Notice also that while constants are given a value when declared (e.g. <code>${state.highlight('limit', 'Pascal')}</code> is given the value <code>${state.highlight('4', 'Pascal')}</code> above), variables are given a <em>type</em>, to indicate the sort of data that they can store. Turtle Pascal allows four main types of variables:` }),
  create('table', {
    classes: ['tsx-help-table'],
    content: [
      create('tr', { content: '<td>integer</td><td>whole number</td>' }),
      create('tr', { content: '<td>boolean</td><td>true or false</td>' }),
      create('tr', { content: '<td>char</td><td>single character</td>' }),
      create('tr', { content: '<td>string</td><td>sequence of character(s)</td>' }),
    ]
  }),
  create('p', { content: 'Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value, e.g.' }),
  create('pre', { content: `<code>${state.highlight('VAR ringsize: integer;', 'Pascal')}</code>` }),
  create('p', { content: `is declared in the &lsquo;Olympic rings 2&rsquo; example program, and <code>${state.highlight('ringsize', 'Pascal')}</code> is later assigned the value <code>${state.highlight('130', 'Pascal')}</code> using the command:` }),
  create('pre', { content: `<code>${state.highlight('ringsize := 130;', 'Pascal')}</code>` }),
  create('p', { content: 'Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:' }),
  create('table', {
    classes: ['tsx-help-table'],
    content: [
      create('tr', { content: `<td><code>${state.highlight('turtx', 'Pascal')}</code></td><td>The Turtle’s x-coordinate</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turty', 'Pascal')}</code></td><td>The Turtle’s y-coordinate</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turtd', 'Pascal')}</code></td><td>The Turtle’s direction</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turtt', 'Pascal')}</code></td><td>The Turtle’s pen thickness</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turtc', 'Pascal')}</code></td><td>The Turtle’s colour setting</td>` }),
    ]
  }),
  create('p', { content: 'These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.' }),
  create('p', { content: `For a use of <code>${state.highlight('turtd', 'Pascal')}</code>, see the &lsquo;Simple procedure&rsquo; example.` }),
];

const Python = [
  create('h3', { content: 'Programs and Procedures: the Basics' }),
  create('p', { content: 'The simplest Python programs take this form:' }),
  create('pre', { content: `<code>${state.highlight('# myprog  [this is a comment]\ndef main():\n  # program commands', 'Python')}</code>` }),
  create('p', { content: `The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings 2&rsquo; program introduces a variable: it is called <code>${state.highlight('ringsize', 'Python')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; by assigning a value, like this:` }),
  create('pre', { content: `<code>${state.highlight('ringsize = 130\n# other program commands', 'Python')}</code>` }),
  create('p', { content: `Complicated programs are usually divided into functions, to separate the various tasks and make them easier to understand. The &lsquo;Simple procedure&rsquo; example program has a function to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Functions fit into a Python program before the <code>${state.highlight('main()', 'Python')}</code> function and may be nested; they look like this:` }),
  create('pre', { content: `<code>${state.highlight('def outsidefunction(par1):\n  global global1, global2        # optional\n  nonlocal nonlocal1, nonlocal2  # optional\n\n  def insidefunction():\n    # insidefunction&rsquo;s commands\n\n  # outsidefunction&rsquo;s commands', 'Python')}` }),
  create('p', { content: `Nested functions must occur after any <code>${state.highlight('global', 'Python')}</code> or <code>${state.highlight('nonlocal', 'Python')}</code> declarations and before the function&rsquo;s commands. Functions may return a value like this:` }),
  create('pre', { content: `<code>${state.highlight('def fname(par1):\n  # function commands\n  return somevalue', 'Python')}</code>` }),
  create('p', { content: 'If there is no return statement then the function behaves like a procedure in Pascal or BASIC.' }),
  create('p', { content: `A function can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${state.highlight('par1', 'Python')}</code> above).` }),
  create('h4', { content: 'Reserved Words, Declarations, Types, and Variables' }),
  create('p', { content: `The words <code>${state.highlight('def', 'Python')}</code>, <code>${state.highlight('return', 'Python')}</code>, <code>${state.highlight('global', 'Python')}</code>, etc. must all be in lower case; Python takes notice of capitalisation! These three words are also in red here – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;return&rsquo;). Variables are of two types, depending on the sort of data that they can store. Turtle Python allows two main types of variables:` }),
  create('table', {
    classes: ['tsx-help-table'],
    content: [
      create('tr', { content: '<td>integer</td><td>whole number</td>' }),
      create('tr', { content: '<td>string</td><td>sequence of character(s)</td>' }),
    ]
  }),
  create('p', { content: `Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings 2&rsquo; example program, <code>${state.highlight('ringsize', 'Python')}</code> is declared by assigning the value <span>${state.highlight('130', 'Python')}</span> using the command:` }),
  create('pre', { content: `<code>${state.highlight('ringsize = 130', 'Python')}</code>` }),
  create('p', { content: `Note that sometimes Python cannot automatically determine what type a variable is meant to be. If this occurs an error message will be generated. To solve these cases the type of the variable can be forced into an integer by adding zero, e.g. <code>${state.highlight('varname + 0', 'Python')}</code>, or forced into a string by adding the null string, e.g. <code>${state.highlight('varname + \'\'', 'Python')}</code>.` }),
  create('p', { content: 'Five special global integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:' }),
  create('table', {
    classes: ['tsx-help-table'],
    content: [
      create('tr', { content: `<td><code>${state.highlight('turtx', 'Python')}</code></td><td>The Turtle&rsquo;s x-coordinate</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turty', 'Python')}</code></td><td>The Turtle&rsquo;s y-coordinate</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turtd', 'Python')}</code></td><td>The Turtle&rsquo;s direction</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turtt', 'Python')}</code></td><td>The Turtle&rsquo;s pen thickness</td>` }),
      create('tr', { content: `<td><code>${state.highlight('turtc', 'Python')}</code></td><td>The Turtle&rsquo;s colour setting</td>` }),
    ]
  }),
  create('p', { content: 'These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.' }),
  create('p', { content: `For a use of <code>${state.highlight('turtd', 'Python')}</code>, see the &lsquo;Simple procedure&rsquo; example.` })
];

const text = { BASIC, Pascal, Python };

const basics = create('div');

const refresh = (language) => {
  basics.innerHTML = '';
  text[language].forEach(x => basics.appendChild(x));
};

refresh(state.getLanguage());
state.on('language-changed', refresh);

module.exports = basics;
