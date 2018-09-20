/*
Text for the basics help tab.
*/

// create the HTML element first
const { element } = require('dom')
const basics = element('div')

// export the HTML element
module.exports = basics

// function to load the DIV with help text for the current language
const refresh = (language) => {
  const text = { BASIC, Pascal, Python }
  basics.innerHTML = ''
  text[language].forEach(x => basics.appendChild(x))
}

// dependencies
const { highlight } = require('compiler')
const state = require('state')

// help text for Turtle BASIC
const BASIC = [
  element('h3', { content: 'Programs and Procedures: the Basics' }),
  element('p', { content: 'The simplest BASIC programs take this form:' }),
  element('pre', { content: `<code>${highlight('REM myprog  [this is a comment]\nREM [program commands]\nEND', 'BASIC')}</code>` }),
  element('p', { content: `The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings 2&rsquo; program introduces a global variable: it is called <code>${highlight('ringsize%', 'BASIC')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; by assigning a value, like this:` }),
  element('pre', { content: `<code>${highlight('ringsize% = 130\nREM [other program commands]\nEND', 'BASIC')}</code>` }),
  element('p', { content: 'Complicated programs are usually divided into subroutines, to separate the various tasks and make them easier to understand. BASIC has two types of subroutine, procedures (which are like mini-programs) and functions (which are designed to calculate some value).' }),
  element('p', { content: `The &lsquo;Simple procedure&rsquo; example program has a procedure to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Procedures fit into a BASIC program after the end of the main program, indicated by <code>${highlight('END', 'BASIC')}</code>. They look like this:` }),
  element('pre', { content: `<code>${highlight('DEF PROCmyprocedure(par1%)\n  LOCAL local1%, local2$\n  REM [procedure commands]\nENDPROC', 'BASIC')}</code>` }),
  element('p', { content: `All procedure names must begin with &lsquo;PROC&rsquo;, e.g. &lsquo;PROCmyprocedure&rsquo;. A procedure can have its own local variables, declared using <code>${highlight('LOCAL', 'BASIC')}</code>. A <code>${highlight('PRIVATE', 'BASIC')}</code> variable is declared the same way, but unlike a <code>${highlight('LOCAL', 'BASIC')}</code> variable, it retains its value between procedure calls. A procedure can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${highlight('par1%', 'BASIC')}</code> above).` }),
  element('p', { content: 'A function is similar to a procedure, with the addition that it returns a value. Also a function name must begin with &lsquo;FN&rsquo;, for example:' }),
  element('pre', { content: `<code>${highlight('DEF FNmyfunction(par1%)\n  REM [procedure commands]\n  = "output"', 'BASIC')}</code>` }),
  element('p', { content: `The last statement of a function always begins with <code>${highlight('=', 'BASIC')}</code> and the <code>${highlight('"output"', 'BASIC')}</code> provides the return value for the function.` }),
  element('h4', { content: 'Reserved Words, Declarations, Types, and Variables' }),
  element('p', { content: `The words <code>${highlight('REM', 'BASIC')}</code>, <code>${highlight('END', 'BASIC')}</code>, <code>${highlight('DEF', 'BASIC')}</code>, etc. are all capitalized to emphasise the program structure. BASIC takes notice of capitalization. These three words are also in red here (or gray for comments) – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;END&rsquo;).` }),
  element('p', { content: 'Variables all end with either a &lsquo;%&rsquo; or a &lsquo;$&rsquo; – Turtle will tell you if you forget! Turtle BASIC allows two types of variables:' }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('tr', { content: '<td>integer</td><td>whole number (name ends in &lsquo;%&rsquo;)</td>' }),
      element('tr', { content: '<td>string</td><td>sequence of characters (name ends in &lsquo;$&rsquo;)</td>' })
    ]
  }),
  element('p', { content: `Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings 2&rsquo; example program, <code>${highlight('ringsize%', 'BASIC')}</code> is declared by assigning the value <code>${highlight('130', 'BASIC')}</code> using the command:` }),
  element('pre', { content: `<code>${highlight('ringsize% = 130', 'BASIC')}</code>` }),
  element('p', { content: 'Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:' }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('tr', { content: `<td><code>${highlight('TURTX%', 'BASIC')}</code></td><td>The Turtle&rsquo;s x-coordinate</td>` }),
      element('tr', { content: `<td><code>${highlight('TURTY%', 'BASIC')}</code></td><td>The Turtle&rsquo;s y-coordinate</td>` }),
      element('tr', { content: `<td><code>${highlight('TURTD%', 'BASIC')}</code></td><td>The Turtle&rsquo;s direction</td>` }),
      element('tr', { content: `<td><code>${highlight('TURTT%', 'BASIC')}</code></td><td>The Turtle&rsquo;s pen thickness</td>` }),
      element('tr', { content: `<td><code>${highlight('TURTC%', 'BASIC')}</code></td><td>The Turtle&rsquo;s colour setting</td>` })
    ]
  }),
  element('p', { content: 'These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.' }),
  element('p', { content: `For a use of <code>${highlight('TURTD%', 'BASIC')}</code>, see the &lsquo;Simple procedure&rsquo; example.` })
]

// help text for Turtle Pascal
const Pascal = [
  element('h3', { content: 'Programs and Procedures: the Basics' }),
  element('p', { content: 'The simplest Pascal programs take this form:' }),
  element('pre', { content: `<code>${highlight('PROGRAM myprog;\nBEGIN\n  {program commands}\nEND.', 'Pascal')}</code>` }),
  element('p', { content: `The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings 2&rsquo; program introduces a global variable: it is called <code>${highlight('ringsize', 'Pascal')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; at the beginning of the program, like this:` }),
  element('pre', { content: `<code>${highlight('PROGRAM myprog;\nVAR global1: integer;\n    global2, global3: integer;\nBEGIN\n  {program commands}\nEND.', 'Pascal')}</code>` }),
  element('p', { content: `Complicated programs are usually divided into subroutines, to separate the various tasks and make them easier to understand. Pascal has two types of subroutine, procedures (which are like mini-programs) and functions (which are designed to calculate some value). The &lsquo;Simple procedure&rsquo; example program has a procedure to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Procedures fit into a Pascal program after the global variables and before the <code>${highlight('BEGIN', 'Pascal')}</code> of the main program; they look like this:` }),
  element('pre', { content: `<code>${highlight('Procedure myprocedure(par1: integer);\nVar local1, local2: integer;\nBegin\n  {procedure commands}\nEnd;', 'Pascal')}</code>` }),
  element('p', { content: `A procedure can have its own local variables, declared much like global variables. But it can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${highlight('par1', 'Pascal')}</code> above).` }),
  element('h4', { content: 'Reserved Words, Declarations, Types, and Variables' }),
  element('p', { content: `The words <code>${highlight('PROGRAM', 'Pascal')}</code>, <code>${highlight('BEGIN', 'Pascal')}</code> and <code>${highlight('END', 'Pascal')}</code> are often capitalized to emphasise the program structure, but Pascal actually takes no notice of capitalization (so you could write <code>${highlight('program', 'Pascal')}</code>, <code>${highlight('Program', 'Pascal')}</code> or even <code>${highlight('PrOgRaM', 'Pascal')}</code>!). These three words are also in red here – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;begin&rsquo;). As well as variables, a program can use constants to give a convenient name to a particular value. Any constants must be &lsquo;declared&rsquo; even before the variables, like this:` }),
  element('pre', { content: `<code>${highlight('PROGRAM myprog;\nCONST limit = 4;\nVAR global1: integer;\n{and so on}', 'Pascal')}</code>` }),
  element('p', { content: `Notice that variable and constant declarations must all end with a semicolon – Turtle will tell you if you forget! Notice also that while constants are given a value when declared (e.g. <code>${highlight('limit', 'Pascal')}</code> is given the value <code>${highlight('4', 'Pascal')}</code> above), variables are given a <em>type</em>, to indicate the sort of data that they can store. Turtle Pascal allows four main types of variables:` }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('tr', { content: '<td>integer</td><td>whole number</td>' }),
      element('tr', { content: '<td>boolean</td><td>true or false</td>' }),
      element('tr', { content: '<td>char</td><td>single character</td>' }),
      element('tr', { content: '<td>string</td><td>sequence of character(s)</td>' })
    ]
  }),
  element('p', { content: 'Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value, e.g.' }),
  element('pre', { content: `<code>${highlight('VAR ringsize: integer;', 'Pascal')}</code>` }),
  element('p', { content: `is declared in the &lsquo;Olympic rings 2&rsquo; example program, and <code>${highlight('ringsize', 'Pascal')}</code> is later assigned the value <code>${highlight('130', 'Pascal')}</code> using the command:` }),
  element('pre', { content: `<code>${highlight('ringsize := 130;', 'Pascal')}</code>` }),
  element('p', { content: 'Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:' }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('tr', { content: `<td><code>${highlight('turtx', 'Pascal')}</code></td><td>The Turtle’s x-coordinate</td>` }),
      element('tr', { content: `<td><code>${highlight('turty', 'Pascal')}</code></td><td>The Turtle’s y-coordinate</td>` }),
      element('tr', { content: `<td><code>${highlight('turtd', 'Pascal')}</code></td><td>The Turtle’s direction</td>` }),
      element('tr', { content: `<td><code>${highlight('turtt', 'Pascal')}</code></td><td>The Turtle’s pen thickness</td>` }),
      element('tr', { content: `<td><code>${highlight('turtc', 'Pascal')}</code></td><td>The Turtle’s colour setting</td>` })
    ]
  }),
  element('p', { content: 'These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.' }),
  element('p', { content: `For a use of <code>${highlight('turtd', 'Pascal')}</code>, see the &lsquo;Simple procedure&rsquo; example.` })
]

// help text for Turtle Python
const Python = [
  element('h3', { content: 'Programs and Procedures: the Basics' }),
  element('p', { content: 'The simplest Python programs take this form:' }),
  element('pre', { content: `<code>${highlight('# myprog  [this is a comment]\ndef main():\n  # program commands', 'Python')}</code>` }),
  element('p', { content: `The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings 2&rsquo; program introduces a variable: it is called <code>${highlight('ringsize', 'Python')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; by assigning a value, like this:` }),
  element('pre', { content: `<code>${highlight('ringsize = 130\n# other program commands', 'Python')}</code>` }),
  element('p', { content: `Complicated programs are usually divided into functions, to separate the various tasks and make them easier to understand. The &lsquo;Simple procedure&rsquo; example program has a function to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Functions fit into a Python program before the <code>${highlight('main()', 'Python')}</code> function and may be nested; they look like this:` }),
  element('pre', { content: `<code>${highlight('def outsidefunction(par1):\n  global global1, global2        # optional\n  nonlocal nonlocal1, nonlocal2  # optional\n\n  def insidefunction():\n    # insidefunction&rsquo;s commands\n\n  # outsidefunction&rsquo;s commands', 'Python')}` }),
  element('p', { content: `Nested functions must occur after any <code>${highlight('global', 'Python')}</code> or <code>${highlight('nonlocal', 'Python')}</code> declarations and before the function&rsquo;s commands. Functions may return a value like this:` }),
  element('pre', { content: `<code>${highlight('def fname(par1):\n  # function commands\n  return somevalue', 'Python')}</code>` }),
  element('p', { content: 'If there is no return statement then the function behaves like a procedure in Pascal or BASIC.' }),
  element('p', { content: `A function can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${highlight('par1', 'Python')}</code> above).` }),
  element('h4', { content: 'Reserved Words, Declarations, Types, and Variables' }),
  element('p', { content: `The words <code>${highlight('def', 'Python')}</code>, <code>${highlight('return', 'Python')}</code>, <code>${highlight('global', 'Python')}</code>, etc. must all be in lower case; Python takes notice of capitalisation! These three words are also in red here – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;return&rsquo;). Variables are of two types, depending on the sort of data that they can store. Turtle Python allows two main types of variables:` }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('tr', { content: '<td>integer</td><td>whole number</td>' }),
      element('tr', { content: '<td>string</td><td>sequence of character(s)</td>' })
    ]
  }),
  element('p', { content: `Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings 2&rsquo; example program, <code>${highlight('ringsize', 'Python')}</code> is declared by assigning the value <span>${highlight('130', 'Python')}</span> using the command:` }),
  element('pre', { content: `<code>${highlight('ringsize = 130', 'Python')}</code>` }),
  element('p', { content: `Note that sometimes Python cannot automatically determine what type a variable is meant to be. If this occurs an error message will be generated. To solve these cases the type of the variable can be forced into an integer by adding zero, e.g. <code>${highlight('varname + 0', 'Python')}</code>, or forced into a string by adding the null string, e.g. <code>${highlight('varname + \'\'', 'Python')}</code>.` }),
  element('p', { content: 'Five special global integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:' }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('tr', { content: `<td><code>${highlight('turtx', 'Python')}</code></td><td>The Turtle&rsquo;s x-coordinate</td>` }),
      element('tr', { content: `<td><code>${highlight('turty', 'Python')}</code></td><td>The Turtle&rsquo;s y-coordinate</td>` }),
      element('tr', { content: `<td><code>${highlight('turtd', 'Python')}</code></td><td>The Turtle&rsquo;s direction</td>` }),
      element('tr', { content: `<td><code>${highlight('turtt', 'Python')}</code></td><td>The Turtle&rsquo;s pen thickness</td>` }),
      element('tr', { content: `<td><code>${highlight('turtc', 'Python')}</code></td><td>The Turtle&rsquo;s colour setting</td>` })
    ]
  }),
  element('p', { content: 'These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.' }),
  element('p', { content: `For a use of <code>${highlight('turtd', 'Python')}</code>, see the &lsquo;Simple procedure&rsquo; example.` })
]

// register to keep text in sync with the language
state.on('language-changed', refresh)
