/*
Text for the structures help tab.
*/

// create the HTML element first
const { element } = require('dom')
const structures = element('div')

// export the HTML element
module.exports = structures

// function to load the DIV with help text for the current language
const refresh = (language) => {
  const text = { BASIC, Pascal, Python }
  structures.innerHTML = ''
  text[language].forEach(x => structures.appendChild(x))
}

// dependencies
const { highlight } = require('compiler')
const state = require('state')

// help text for Turtle BASIC
const BASIC = [
  element('h3', { content: 'Command Structures' }),
  element('p', { content: 'Selection and ordering of commands is done by <em>sequencing</em>, <em>conditional selection</em>, and <em>looping</em>.' }),
  element('h4', { content: 'Sequencing of Commands' }),
  element('p', { content: 'Commands to be performed in sequence are usually placed in the appropriate order within the program, e.g.:' }),
  element('pre', { content: `<code>${highlight('COLOUR(GREEN)\nBLOT(100)\nPAUSE(1000)\nCOLOUR(RED)\nFORWARD(450) REM etc.', 'BASIC')}</code>` }),
  element('p', { content: '(From the first example program in the Help menu.)' }),
  element('h4', { content: 'Conditional Selection of Commands' }),
  element('p', { content: `Suppose you want to draw a blot with a given radius (stored as the integer variable <code>${highlight('radius%', 'BASIC')}</code>), but only if that value is less than 500; do it like this:` }),
  element('pre', { content: `<code>${highlight('IF radius% < 500 THEN\n  BLOT(radius%)\nENDIF', 'BASIC')}</code>` }),
  element('p', { content: `If you want to do something different when the condition is not met (e.g. drawing a blot with half the radius), extend the <code>${highlight('IF - THEN', 'BASIC')}</code> structure by adding <code>${highlight('ELSE', 'BASIC')}</code> and then the new command:` }),
  element('pre', { content: `<code>${highlight('IF radius% < 500 THEN\n  BLOT(radius%)\nELSE\n  BLOT(radius% / 2)\nENDIF', 'BASIC')}</code>` }),
  element('h4', { content: 'Grouping of Commands' }),
  element('p', { content: `A sequence of commands within an <code>${highlight('IF - THEN - ELSE - ENDIF', 'BASIC')}</code> structure is always treated as a single command. The <code>${highlight('ELSE', 'BASIC')}</code> and <code>${highlight('ENDIF', 'BASIC')}</code> words bracket off the sequence of commands. (Another possibility is to package them into a procedure.) You can also write these on a single line without the <code>${highlight('ENDIF', 'BASIC')}</code>, like this:` }),
  element('pre', { content: `<code>${highlight('IF radius% < 500 THEN BLOT(radius%)', 'BASIC')}</code>` }),
  element('h4', { content: 'Spacing, Indenting, Auto-Formatting' }),
  element('p', { content: 'Unnecessary &lsquo;white space&rsquo; is ignored by BASIC, so you can use line breaks and indenting to make the structure of your program easy to read. However, each statement must be on its own line, unless separated by a colon &lsquo;:&rsquo;.' }),
  element('h4', { content: 'Looping Structures' }),
  element('p', { content: `BASIC provides three different structures for looping (or &lsquo;iterating&rsquo;) commands. If you know in advance how many times you want to loop – or you want to &lsquo;loop over&rsquo; a particular range of values (e.g. from 1 to 200), then the simplest is a &lsquo;<code>${highlight('FOR', 'BASIC')}</code> loop&rsquo; (or &lsquo;counting loop&rsquo;):` }),
  element('pre', { content: `<code>${highlight('FOR count% = 1 TO 200\n  FORWARD(count% / 3)\n  RIGHT(5)\n  REM etc.\nNEXT', 'BASIC')}</code>` }),
  element('p', { content: `(From the first <code>${highlight('FOR', 'BASIC')}</code> loop example program in the Help menu.)` }),
  element('p', { content: `Here, <code>${highlight('NEXT', 'BASIC')}</code> is used to bracket together a number of commands, and indenting is used to show the structure.` }),
  element('p', { content: `To count downwards, use <code>${highlight('STEP -1', 'BASIC')}</code> at then end (as in the &lsquo;Procedure with parameter&rsquo; example program).` }),
  element('p', { content: `In a <code>${highlight('FOR', 'BASIC')}</code> loop, the &lsquo;loop variable&rsquo; (here <code>${highlight('count%', 'BASIC')}</code>) is given in turn each of the values in the range (here 1, 2, 3, &hellip;, 199, 200), and the loop instructions are performed each time. So in the example above, a spiral is drawn as the Turtle moves forward gradually more and more (as <code>${highlight('count%', 'BASIC')}</code> increases).` }),
  element('p', { content: 'If instead of looping a specific number of times, you want to loop through some sequence of commands until some particular condition becomes true, then you can use:' }),
  element('pre', { content: `<code>${highlight('REPEAT\n  REM command1\n  REM command2 (etc.)\nUNTIL REM condition', 'BASIC')}</code>` }),
  element('p', { content: `The &lsquo;Simple procedure&rsquo; example program does this, looping until the Turtle is pointing directly north (i.e., <code>${highlight('TURTD% = 0', 'BASIC')}</code>).` }),
  element('p', { content: 'Alternatively, you can loop through a sequence of commands while some condition is true (so that it stops when the condition becomes false):' }),
  element('pre', { content: `<code>${highlight('WHILE REM condition\n  REM sequence of commands\nENDWHILE', 'BASIC')}</code>` }),
  element('p', { content: `Things that can be done with a <code>${highlight('REPEAT', 'BASIC')}</code> loop can equally be done with a <code>${highlight('WHILE', 'BASIC')}</code> loop (and vice-versa), but sometimes one is more natural than the other. Notice also that a <code>${highlight('REPEAT', 'BASIC')}</code> loop always executes the sequence of commands at least once, because it tests the condition at the end of the loop. But a <code>${highlight('WHILE', 'BASIC')}</code> loop tests the condition <em>before</em> executing the sequence of commands, and so will not execute them even once if condition is false to start with. (For examples of the various loops, see the second set of example programs, &lsquo;Further commands and structures&rsquo;.)` })
]

// help text for Turtle Pascal
const Pascal = [
  element('h3', { content: 'Command Structures' }),
  element('p', { content: 'Selection and ordering of commands is done by <em>sequencing</em>, <em>conditional selection</em>, and <em>looping</em>.' }),
  element('h4', { content: 'Sequencing of Commands' }),
  element('p', { content: 'Commands to be performed in sequence are usually placed in the appropriate order within the program, separated by semicolons, e.g.:' }),
  element('pre', { content: `<code>${highlight('colour(green);\nblot(100);\npause(1000);\ncolour(red);\nforward(450); {etc.}', 'Pascal')}</code>` }),
  element('p', { content: '(From the first example program in the Help menu.)' }),
  element('h4', { content: 'Conditional Selection of Commands' }),
  element('p', { content: `Suppose you want to draw a blot with a given radius (stored as the integer variable <code>${highlight('radius', 'Pascal')}</code>), but only if that value is less than 500; do it like this:` }),
  element('pre', { content: `<code>${highlight('if radius < 500 then\n  blot(radius);', 'Pascal')}</code>` }),
  element('p', { content: `If you want to do something different when the condition is not met (e.g. drawing a blot with half the radius), extend the <code>${highlight('if condition then', 'Pascal')}</code> structure by adding <code>${highlight('else', 'Pascal')}</code> and then the new command:` }),
  element('pre', { content: `<code>${highlight('if radius < 500 then\n  blot(radius)\nelse\n  blot(radius / 2);', 'Pascal')}</code>` }),
  element('p', { content: `Notice that this is a single complex command, so you must not put a semicolon before the <code>${highlight('else', 'Pascal')}</code> (if you do, Turtle will give you a warning).` }),
  element('h4', { content: 'Grouping of Commands' }),
  element('p', { content: `Sometimes you will want to do a sequence of commands within an <code>${highlight('if {condition} then {command} else', 'Pascal')}</code> structure, in which case you can bracket them between <code>${highlight('begin', 'Pascal')}</code> and <code>${highlight('end', 'Pascal')}</code>, e.g.` }),
  element('pre', { content: `<code>${highlight('if {condition} then\n  begin\n    {sequence1}\n  end\nelse\n  begin\n    {sequence2}\n  end;', 'Pascal')}</code>` }),
  element('p', { content: 'Any such bracketed sequence of commands is always treated as a single command. (Another possibility is to package them into a procedure.)' }),
  element('h4', { content: 'Spacing, Indenting, Auto-Formatting' }),
  element('p', { content: 'Unnecessary &lsquo;white space&rsquo; is ignored by Pascal, so you can use line breaks and indenting to make the structure of your program easy to read.' }),
  element('h4', { content: 'Looping Structures' }),
  element('p', { content: `Pascal provides three different structures for looping (or &lsquo;iterating&rsquo;) commands. If you know in advance how many times you want to loop – or you want to &lsquo;loop over&rsquo; a particular range of values (e.g. from 1 to 200), then the simplest is a &lsquo;<code>${highlight('for', 'Pascal')}</code> loop&rsquo; (or &lsquo;counting loop&rsquo;):` }),
  element('pre', { content: `<code>${highlight('for count := 1 to 200 do\n  begin\n    forward(count / 3);\n    right(5);\n    {etc.}\n  end;', 'Pascal')}</code>` }),
  element('p', { content: `(From the first <code>${highlight('for', 'Pascal')}</code> loop example program in the Help menu.)` }),
  element('p', { content: `Again <code>${highlight('begin {commands} end', 'Pascal')}</code> is used to bracket together a number of commands, and indenting is used to show the structure.` }),
  element('p', { content: `In a <code>${highlight('for', 'Pascal')}</code> loop, the &lsquo;loop variable&rsquo; (here <code>${highlight('count', 'Pascal')}</code>) is given in turn each of the values in the range (here 1, 2, 3, &hellip;, 199, 200), and the loop instructions are performed each time. So in the example above, a spiral is drawn as the Turtle moves forward gradually more and more (as <code>${highlight('count', 'Pascal')}</code> increases).` }),
  element('p', { content: `To count downwards, use <code>${highlight('downto', 'Pascal')}</code> instead of <code>${highlight('to', 'Pascal')}</code> (as in the &lsquo;Procedure with parameter&rsquo; example program.` }),
  element('p', { content: 'If instead of looping a specific number of times, you want to loop through some sequence of commands until some particular condition becomes true, then you can use:' }),
  element('pre', { content: `<code>${highlight('repeat\n  {command1;}\n  {command2; (etc.)}\nuntil {condition}', 'Pascal')}</code>` }),
  element('p', { content: `<p>The &lsquo;Simple procedure&rsquo; example program does this, looping until the Turtle is pointing directly north (i.e., <code>${highlight('turtd = 0', 'Pascal')}</code>). Alternatively, you can loop through a sequence of commands while some condition is true (so that it stops when the condition becomes false):` }),
  element('pre', { content: `<code>${highlight('while {condition} do\n  begin\n    {sequence of commands}\n  end;', 'Pascal')}</code>` }),
  element('p', { content: `Things that can be done with a &lsquo;<code>${highlight('repeat', 'Pascal')}</code> loop&rsquo; can equally be done with a &lsquo;<code>${highlight('while', 'Pascal')}</code> loop&rsquo; (and vice-versa), but sometimes one is more natural than the other. Notice also that a <code>${highlight('repeat', 'Pascal')}</code> loop always executes the sequence of commands at least once, because it tests the condition at the end of the loop. But a <code>${highlight('while', 'Pascal')}</code> loop tests the condition <em>before</em> executing the sequence of commands, and so will not execute them even once if condition is false to start with. (For examples of the various loops, see the second set of example programs, &lsquo;Further commands and structures&rsquo;.)` })
]

// help text for Turtle Python
const Python = [
  element('h3', { content: 'Command Structures' }),
  element('p', { content: 'Selection and ordering of commands is done by <em>sequencing</em>, <em>conditional selection</em>, and <em>looping</em>.' }),
  element('h4', { content: 'Sequencing of Commands' }),
  element('p', { content: 'Commands to be performed in sequence are usually placed in the appropriate order within the program, with the same indent, e.g.:' }),
  element('pre', { content: `<code>${highlight('colour(green)\nblot(100)\npause(1000) # etc.', 'Python')}</code>` }),
  element('p', { content: '(From the first example program in the Help menu.)' }),
  element('h4', { content: 'Conditional Selection of Commands' }),
  element('p', { content: `Suppose you want to draw a blot with a given radius (stored as the integer variable <code>${highlight('radius', 'Python')}</code>), but only if that value is less than 500; do it like this:` }),
  element('pre', { content: `<code>${highlight('if radius < 500:\n  blot(radius)', 'Python')}</code>` }),
  element('p', { content: `If you want to do something different when the condition is not met (e.g. drawing a blot with half the radius), extend the <code>${highlight('if', 'Python')}</code> structure by adding <code>${highlight('else', 'Python')}</code> and then the new command:` }),
  element('pre', { content: `<code>${highlight('if radius < 500:\n  blot(radius)\nelse:\n  blot(radius // 2)', 'Python')}</code>` }),
  element('p', { content: `Notice that this is a single complex command, so the <code>${highlight('else', 'Python')}</code> must have the same indent as <code>${highlight('if', 'Python')}</code> and the sub-commands must be further indented (if you do not indent correctly, Turtle will give you a warning).` }),
  element('h4', { content: 'Grouping of Commands' }),
  element('p', { content: `Sometimes you will want to do a sequence of commands within an <code>${highlight('if - else', 'Python')}</code> structure, in which case you can group them by indenting them all by the same amount. Any such indented sequence of commands is treated as a single command. (Another possibility is to package them into a function.)` }),
  element('p', { content: 'Note that indents must be consistent, so the following will generate several errors:' }),
  element('pre', { content: `<code>${highlight('if radius < 500:\n  blot(radius)\n    blot(radius // 3)      # too many indents\n  else:            # should match the if line\n  blot(radius // 2) # needs indent after else', 'Python')}</code>` }),
  element('h4', { content: 'Auto-Formatting' }),
  element('h4', { content: 'Looping Structures' }),
  element('p', { content: `Python provides two different structures for looping (or &lsquo;iterating&rsquo;) commands. If you know in advance how many times you want to loop – or you want to &lsquo;loop over&rsquo; a particular range of values (e.g. from 1 to 200), then the simplest is a &lsquo;<code>${highlight('for', 'Python')}</code> loop&rsquo; (or &lsquo;counting loop&rsquo;):` }),
  element('pre', { content: `<code>${highlight('for count in range(1, 201, 1):\n  forward(count // 3)\n  right(5)\n  # etc.', 'Python')}</code>` }),
  element('p', { content: `(From the first <code>${highlight('for', 'Python')}</code> loop example program in the Help menu.)` }),
  element('p', { content: 'Again indenting is used to group together a number of commands.' }),
  element('p', { content: `In a <code>${highlight('for', 'Python')}</code> loop, the &lsquo;loop variable&rsquo; (here <code>${highlight('count', 'Python')}</code>) is given in turn each of the values in the range (here 1, 2, 3, &hellip;, 199, 200), and the loop instructions are performed each time. So in the example above, a spiral is drawn as the Turtle moves forward gradually more and more (as <code>${highlight('count', 'Python')}</code> increases).` }),
  element('p', { content: `The <code>${highlight('range', 'Python')}</code> function specifies the values that the loop variable will take as follows:` }),
  element('pre', { content: `<code>${highlight('range(firstValue, lastValue + 1, increment)', 'Python')}</code>` }),
  element('p', { content: 'The increment can be either 1 or -1. To count down through a loop, use an increment of -1.' }),
  element('p', { content: 'If instead of looping a specific number of times, you want to loop through some sequence of commands while some condition is true (so that it stops when the condition becomes false), then you can use:' }),
  element('pre', { content: `<code>${highlight('while condition:\n  # sequence of commands', 'Python')}</code>` }),
  element('p', { content: `A <code>${highlight('while', 'Python')}</code> loop tests the condition <em>before</em> executing the sequence of commands, and so will not execute them even once if condition is false to start with. (For examples of the various loops, see the second set of example programs, &lsquo;Further commands and structures&rsquo;.)` })
]

// load text for the current language, and register to keep it in sync with the application state
state.on('language-changed', refresh)
