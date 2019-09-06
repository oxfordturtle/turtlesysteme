/*
Text for the basics help tab.
*/
import highlight from 'common/compiler/highlight'
import { on } from 'common/system/state'

// the div for help text about the basics
const element = document.createElement('div')
export default element

// subscribe to keep in sync with the system state
on('language-changed', (language) => {
  if (language === 'BASIC') element.innerHTML = basicText
  if (language === 'Pascal') element.innerHTML = pascalText
  if (language === 'Python') element.innerHTML = pythonText
})

// help text for Turtle BASIC
const basicText = `
  <h3>Programs and Procedures: the Basics</h3>
  <p>The simplest BASIC programs take this form:</p>
  <pre><code>${highlight('REM myprog  [this is a comment]\n\nREM [program commands]\nEND', 'BASIC')}</code></pre>
  <p>The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings&rsquo; program introduces a global variable: it is called <code>${highlight('ringsize%', 'BASIC')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; by assigning a value, like this:</p>
  <pre><code>${highlight('ringsize% = 130\nREM [other program commands]\nEND', 'BASIC')}</code></pre>
  <p>Complicated programs are usually divided into subroutines, to separate the various tasks and make them easier to understand. BASIC has two types of subroutine, procedures (which are like mini-programs) and functions (which are designed to calculate some value).</p>
  <p>The &lsquo;Simple procedure&rsquo; example program has a procedure to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Procedures fit into a BASIC program after the end of the main program, indicated by <code>${highlight('END', 'BASIC')}</code>. They look like this:</p>
  <pre><code>${highlight('DEF PROCmyprocedure(par1%)\n  LOCAL local1%, local2$\n  REM [procedure commands]\nENDPROC', 'BASIC')}</code></pre>
  <p>All procedure names must begin with &lsquo;PROC&rsquo;, e.g. &lsquo;PROCmyprocedure&rsquo;. A procedure can have its own local variables, declared using <code>${highlight('LOCAL', 'BASIC')}</code>. A <code>${highlight('PRIVATE', 'BASIC')}</code> variable is declared the same way, but unlike a <code>${highlight('LOCAL', 'BASIC')}</code> variable, it retains its value between procedure calls. A procedure can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${highlight('par1%', 'BASIC')}</code> above).</p>
  <p>A function is similar to a procedure, with the addition that it returns a value. Also a function name must begin with &lsquo;FN&rsquo;, for example:</p>
  <pre><code>${highlight('DEF FNmyfunction$(par1%)\n  REM [procedure commands]\n= "output"', 'BASIC')}</code></pre>
  <p>The last statement of a function always begins with <code>${highlight('=', 'BASIC')}</code> and the <code>${highlight('"output"', 'BASIC')}</code> provides the return value for the function. If a function returns a string (as above), then its name must end with '$'; otherwise an integer return type will be assumed.</p>
  <h4>Reserved Words, Declarations, Types, and Variables</h4>
  <p>The words <code>${highlight('REM', 'BASIC')}</code>, <code>${highlight('END', 'BASIC')}</code>, <code>${highlight('DEF', 'BASIC')}</code>, etc. are all capitalized to emphasise the program structure. BASIC takes notice of capitalization. These three words are also in red here (or gray for comments) – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;END&rsquo;).</p>
  <p>Variables all end with either a &lsquo;%&rsquo; or a &lsquo;$&rsquo; – Turtle will tell you if you forget! Turtle BASIC allows two types of variables:</p>
  <table class="tse-help-table">
    <tbody>
      <tr><th>integer</th><td>whole number (name ends in &lsquo;%&rsquo;)</td></tr>
      <tr><th>string</th><td>sequence of characters (name ends in &lsquo;$&rsquo;)</td></tr>
    </tbody>
  </table>
  <p>Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings&rsquo; example program, <code>${highlight('ringsize%', 'BASIC')}</code> is declared by assigning the value <code>${highlight('130', 'BASIC')}</code> using the command:</p>
  <pre><code>${highlight('ringsize% = 130', 'BASIC')}</code></pre>
  <p>Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:</p>
  <table class="tse-help-table">
    <tbody>
      <tr><th><code>${highlight('TURTX%', 'BASIC')}</code></th><td>The Turtle&rsquo;s x-coordinate</td></tr>
      <tr><th><code>${highlight('TURTY%', 'BASIC')}</code></th><td>The Turtle&rsquo;s y-coordinate</td></tr>
      <tr><th><code>${highlight('TURTD%', 'BASIC')}</code></th><td>The Turtle&rsquo;s direction</td></tr>
      <tr><th><code>${highlight('TURTT%', 'BASIC')}</code></th><td>The Turtle&rsquo;s pen thickness</td></tr>
      <tr><td><code>${highlight('TURTC%', 'BASIC')}</code></td><td>The Turtle&rsquo;s colour setting</td></tr>
    </tbody>
  </table>
  <p>These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.</p>
  <p>For a use of <code>${highlight('TURTD%', 'BASIC')}</code>, see the &lsquo;Simple procedure&rsquo; example.</p>`

// help text for Turtle Pascal
const pascalText = `
  <h3>Programs and Procedures: the Basics</h3>
  <p>The simplest Pascal programs take this form:</p>
  <pre><code>${highlight('PROGRAM myprog;\nBEGIN\n  {program commands}\nEND.', 'Pascal')}</code></pre>
  <p>The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings&rsquo; program introduces a global variable: it is called <code>${highlight('ringsize', 'Pascal')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; at the beginning of the program, like this:</p>
  <pre><code>${highlight('PROGRAM myprog;\nVAR global1: integer;\n    global2, global3: integer;\nBEGIN\n  {program commands}\nEND.', 'Pascal')}</code></pre>
  <p>Complicated programs are usually divided into subroutines, to separate the various tasks and make them easier to understand. Pascal has two types of subroutine, procedures (which are like mini-programs) and functions (which are designed to calculate some value). The &lsquo;Simple procedure&rsquo; example program has a procedure to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Procedures fit into a Pascal program after the global variables and before the <code>${highlight('BEGIN', 'Pascal')}</code> of the main program; they look like this:</p>
  <pre><code>${highlight('Procedure myprocedure(par1: integer);\nVar local1, local2: integer;\nBegin\n  {procedure commands}\nEnd;', 'Pascal')}</code></pre>
  <p>A procedure can have its own local variables, declared much like global variables. But it can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${highlight('par1', 'Pascal')}</code> above).</p>
  <h4>Reserved Words, Declarations, Types, and Variables</h4>
  <p>The words <code>${highlight('PROGRAM', 'Pascal')}</code>, <code>${highlight('BEGIN', 'Pascal')}</code> and <code>${highlight('END', 'Pascal')}</code> are often capitalized to emphasise the program structure, but Pascal actually takes no notice of capitalization (so you could write <code>${highlight('program', 'Pascal')}</code>, <code>${highlight('Program', 'Pascal')}</code> or even <code>${highlight('PrOgRaM', 'Pascal')}</code>!). These three words are also in red here – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;begin&rsquo;). As well as variables, a program can use constants to give a convenient name to a particular value. Any constants must be &lsquo;declared&rsquo; even before the variables, like this:</p>
  <pre><code>${highlight('PROGRAM myprog;\nCONST limit = 4;\nVAR global1: integer;\n{and so on}', 'Pascal')}</code></pre>
  <p>Notice that variable and constant declarations must all end with a semicolon – Turtle will tell you if you forget! Notice also that while constants are given a value when declared (e.g. <code>${highlight('limit', 'Pascal')}</code> is given the value <code>${highlight('4', 'Pascal')}</code> above), variables are given a <em>type</em>, to indicate the sort of data that they can store. Turtle Pascal allows four main types of variables:</p>
  <table class="tse-help-table">
    <tbody>
      <tr><th>integer</th><td>whole number</td></tr>
      <tr><th>boolean</th><td>true or false</td></tr>
      <tr><th>char</th><td>single character</td></tr>
      <tr><th>string</th><td>sequence of character(s)</td></tr>
    </tbody>
  </table>
  <p>Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value, e.g.</p>
  <pre><code>${highlight('VAR ringsize: integer;', 'Pascal')}</code></pre>
  <p>is declared in the &lsquo;Olympic rings&rsquo; example program, and <code>${highlight('ringsize', 'Pascal')}</code> is later assigned the value <code>${highlight('130', 'Pascal')}</code> using the command:</p>
  <pre><code>${highlight('ringsize := 130;', 'Pascal')}</code></pre>
  <p>Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:</p>
  <table class="tse-help-table">
    <tbody>
      <tr><th><code>${highlight('turtx', 'Pascal')}</code></th><td>The Turtle’s x-coordinate</td></tr>
      <tr><th><code>${highlight('turty', 'Pascal')}</code></th><td>The Turtle’s y-coordinate</td></tr>
      <tr><th><code>${highlight('turtd', 'Pascal')}</code></th><td>The Turtle’s direction</td></tr>
      <tr><th><code>${highlight('turtt', 'Pascal')}</code></th><td>The Turtle’s pen thickness</td></tr>
      <tr><th><code>${highlight('turtc', 'Pascal')}</code></th><td>The Turtle’s colour setting</td></tr>
    </tbody>
  </table>
  <p>These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.</p>
  <p>For a use of <code>${highlight('turtd', 'Pascal')}</code>, see the &lsquo;Simple procedure&rsquo; example.</p>`

// help text for Turtle Python
const pythonText = `
  <h3>Programs and Procedures: the Basics</h3>
  <p>The simplest Python programs take this form:</p>
  <pre><code>${highlight('# myprog  [this is a comment]\n\n# program commands', 'Python')}</code></pre>
  <p>The first couple of Turtle example programs (from the Help menu) are like this. But the &lsquo;Olympic rings&rsquo; program introduces a variable: it is called <code>${highlight('ringsize', 'Python')}</code> and specifies the size of the rings. Such variables are &lsquo;declared&rsquo; by assigning a value, like this:</p>
  <pre><code>${highlight('ringsize = 130\n# other program commands', 'Python')}</code></pre>
  <p>Complicated programs are usually divided into functions, to separate the various tasks and make them easier to understand. The &lsquo;Simple procedure&rsquo; example program has a function to draw a &lsquo;prong&rsquo; – a line ending in a blot – and then return to the starting point. Functions must be described at the start of the main program, and may be nested; they look like this:</p>
  <pre><code>${highlight('def outsidefunction(par1):\n  global global1, global2        # optional\n  nonlocal nonlocal1, nonlocal2  # optional\n\n  def insidefunction():\n    # insidefunction&rsquo;s commands\n\n  # outsidefunction&rsquo;s commands', 'Python')}</pre>
  <p>Nested functions must occur after any <code>${highlight('global', 'Python')}</code> or <code>${highlight('nonlocal', 'Python')}</code> declarations and before the function&rsquo;s commands. Functions may return a value like this:</p>
  <pre><code>${highlight('def fname(par1):\n  # function commands\n  return somevalue', 'Python')}</code></pre>
  <p>If there is no return statement then the function behaves like a procedure in Pascal or BASIC.</p>
  <p>A function can also have parameters (or &lsquo;arguments&rsquo;) that are values sent into the subroutine when it is called from the program, and given a name within the subroutine (e.g. <code>${highlight('par1', 'Python')}</code> above).</p>
  <h4>Reserved Words, Declarations, Types, and Variables</h4>
  <p>The words <code>${highlight('def', 'Python')}</code>, <code>${highlight('return', 'Python')}</code>, <code>${highlight('global', 'Python')}</code>, etc. must all be in lower case; Python takes notice of capitalisation! These three words are also in red here – this is to indicate that they are special &lsquo;reserved&rsquo; words that cannot be used for other purposes (so you can&rsquo;t call a procedure or variable &lsquo;return&rsquo;). Variables are of two types, depending on the sort of data that they can store. Turtle Python allows two main types of variables:</p>
  <table class="tse-help-table">
    <tbody>
      <tr><th>integer</th><td>whole number</td></tr>
      <tr><th>string</th><td>sequence of character(s)</td></tr>
    </tbody>
  </table>
  <p>Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings&rsquo; example program, <code>${highlight('ringsize', 'Python')}</code> is declared by assigning the value <span>${highlight('130', 'Python')}</span> using the command:</p>
  <pre><code>${highlight('ringsize = 130', 'Python')}</code></pre>
  <p>Note that sometimes Python cannot automatically determine what type a variable is meant to be. If this occurs an error message will be generated. To solve these cases the type of the variable can be forced into an integer by adding zero, e.g. <code>${highlight('varname + 0', 'Python')}</code>, or forced into a string by adding the null string, e.g. <code>${highlight('varname + \'\'', 'Python')}</code>.</p>
  <p>Five special global integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:</p>
  <table class="tse-help-table">
    <tbody>
      <tr><th><code>${highlight('turtx', 'Python')}</code></th><td>The Turtle&rsquo;s x-coordinate</td></tr>
      <tr><th><code>${highlight('turty', 'Python')}</code></th><td>The Turtle&rsquo;s y-coordinate</td></tr>
      <tr><th><code>${highlight('turtd', 'Python')}</code></th><td>The Turtle&rsquo;s direction</td></tr>
      <tr><th><code>${highlight('turtt', 'Python')}</code></th><td>The Turtle&rsquo;s pen thickness</td></tr>
      <tr><th><code>${highlight('turtc', 'Python')}</code></th><td>The Turtle&rsquo;s colour setting</td></tr>
    </tbody>
  </table>
  <p>These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.</p>
  <p>For a use of <code>${highlight('turtd', 'Python')}</code>, see the &lsquo;Simple procedure&rsquo; example.</p>`
