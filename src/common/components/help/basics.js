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
  <div class="tse-help-table">
    <table>
      <tbody>
        <tr><th>integer</th><td>whole number (name ends in &lsquo;%&rsquo;)</td></tr>
        <tr><th>string</th><td>sequence of characters (name ends in &lsquo;$&rsquo;)</td></tr>
      </tbody>
    </table>
  </div>
  <p>Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value. In the &lsquo;Olympic rings&rsquo; example program, <code>${highlight('ringsize%', 'BASIC')}</code> is declared by assigning the value <code>${highlight('130', 'BASIC')}</code> using the command:</p>
  <pre><code>${highlight('ringsize% = 130', 'BASIC')}</code></pre>
  <p>Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:</p>
  <div class="tse-help-table">
    <table>
      <tbody>
        <tr><th><code>${highlight('TURTX%', 'BASIC')}</code></th><td>The Turtle&rsquo;s x-coordinate</td></tr>
        <tr><th><code>${highlight('TURTY%', 'BASIC')}</code></th><td>The Turtle&rsquo;s y-coordinate</td></tr>
        <tr><th><code>${highlight('TURTD%', 'BASIC')}</code></th><td>The Turtle&rsquo;s direction</td></tr>
        <tr><th><code>${highlight('TURTT%', 'BASIC')}</code></th><td>The Turtle&rsquo;s pen thickness</td></tr>
        <tr><td><code>${highlight('TURTC%', 'BASIC')}</code></td><td>The Turtle&rsquo;s colour setting</td></tr>
      </tbody>
    </table>
  </div>
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
  <div class="tse-help-table">
    <table>
      <tbody>
        <tr><th>integer</th><td>whole number</td></tr>
        <tr><th>boolean</th><td>true or false</td></tr>
        <tr><th>char</th><td>single character</td></tr>
        <tr><th>string</th><td>sequence of character(s)</td></tr>
      </tbody>
    </table>
  </div>
  <p>Most of your variables are likely to be integer variables, like a transparent box that stores a number. You can look at the box to see which number it contains at any time, and you can change the number by assigning a new value, e.g.</p>
  <pre><code>${highlight('VAR ringsize: integer;', 'Pascal')}</code></pre>
  <p>is declared in the &lsquo;Olympic rings&rsquo; example program, and <code>${highlight('ringsize', 'Pascal')}</code> is later assigned the value <code>${highlight('130', 'Pascal')}</code> using the command:</p>
  <pre><code>${highlight('ringsize := 130;', 'Pascal')}</code></pre>
  <p>Five special integer variables are &lsquo;built in&rsquo; from the start, and these are called the Turtle&rsquo;s fields:</p>
  <div class="tse-help-table">
    <table>
      <tbody>
        <tr><th><code>${highlight('turtx', 'Pascal')}</code></th><td>The Turtle’s x-coordinate</td></tr>
        <tr><th><code>${highlight('turty', 'Pascal')}</code></th><td>The Turtle’s y-coordinate</td></tr>
        <tr><th><code>${highlight('turtd', 'Pascal')}</code></th><td>The Turtle’s direction</td></tr>
        <tr><th><code>${highlight('turtt', 'Pascal')}</code></th><td>The Turtle’s pen thickness</td></tr>
        <tr><th><code>${highlight('turtc', 'Pascal')}</code></th><td>The Turtle’s colour setting</td></tr>
      </tbody>
    </table>
  </div>
  <p>These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.</p>
  <p>For a use of <code>${highlight('turtd', 'Pascal')}</code>, see the &lsquo;Simple procedure&rsquo; example.</p>`

// help text for Turtle Python
const pythonText = `
  <h3>Programs and Functions: the Basics</h3>
  <p>A Turtle Python program is a sequence of statements, separated either by a semicolon, or by being placed on a new line. For example, the following two programs are equivalent:</p>
  <pre><code>${highlight('colour(green); blot(200); colour(red); blot(100)', 'Python')}</code></pre>
  <pre><code>${highlight('colour(green)\nblot(200)\ncolour(red)\nblot(100)', 'Python')}</code></pre>
  <p>Statements are either simple or compound. Compound statements are discussed later. Simple statements, first, are either function calls, variable declarations/assignments, <code>${highlight('return', 'Python')}</code> statements, or <code>${highlight('global', 'Python')}</code>/<code>${highlight('nonlocal', 'Python')}</code> statements.</p>
  <h4>Function calls</h4>
  <p>A function is like a separate program you can use within your main program. Later you will see how to create your own functions, but you can also use any of the Turtle System&rsquo;s built-in commands. To call a function, type its name followed by opening and closing brackets. If the function takes any arguments, type these in between the brackets, separated by commas. For example:</p>
  <pre><code>${highlight('home()\ncolour(red)\ncircle(50)\nellipse(50, 80)', 'Python')}</code></pre>
  <p>A full list of built-in commands is available from the &lsquo;Commands&rsquo; tab of this Language Guide.</p>
  <p>Some functions return a value, like the <code>${highlight('max(a, b)', 'Python')}</code> function, which returns the highest of the two numbers <code>${highlight('a', 'Python')}</code> and <code>${highlight('b', 'Python')}</code>. You can use these anywhere you would use a named value. For example:</p>
  <pre><code>${highlight('blot(max(100, 200))', 'Python')}</code></pre>
  <h4>Variable declarations/assignments</h4>
  <p>Variables are like boxes where you can store one value at a time. There are three types of variables in Turtle Python: integers, Booleans, and strings. You must declare a variable (specify its type) before you can assign it a value. Variables in Turtle Python are declared like this:</p>
  <pre><code>${highlight('ringsize: int\ndraw: bool\nname: str', 'Python')}</code></pre>
  <p>After they have been declared, variables can be assigned a value like this:</p>
  <pre><code>${highlight('ringsize = 130\ndraw = True\nname = \'Turtle Python\'', 'Python')}</code></pre>
  <p>Once you have given your variable a value, you can recall that value at any time by typing the variable&rsquo;s name.</p>
  <p>Variable declarations and initial assignments can also be combined into a single statement, like this:</p>
  <pre><code>${highlight('ringsize: int = 130\ndraw: bool = True\nname: str = \'Turtle Python\'', 'Python')}</code></pre>
  <p>Five special integer variables are built in to your program from the start, and these are called the Turtle&rsquo;s fields:</p>
  <div class="tse-help-table">
    <table>
      <tbody>
        <tr><th><code>${highlight('turtx', 'Python')}</code></th><td>The Turtle&rsquo;s x-coordinate</td></tr>
        <tr><th><code>${highlight('turty', 'Python')}</code></th><td>The Turtle&rsquo;s y-coordinate</td></tr>
        <tr><th><code>${highlight('turtd', 'Python')}</code></th><td>The Turtle&rsquo;s direction</td></tr>
        <tr><th><code>${highlight('turtt', 'Python')}</code></th><td>The Turtle&rsquo;s pen thickness</td></tr>
        <tr><th><code>${highlight('turtc', 'Python')}</code></th><td>The Turtle&rsquo;s colour setting</td></tr>
      </tbody>
    </table>
  </div>
  <p>These automatically change to keep track of the Turtle&rsquo;s state, and are shown above the Canvas.</p>
  <h4>Python vs Turtle Python</h4>
  <p>In Python itself, specifying the type of your variables is called <em>type hinting</em>, and it is optional. Also, Python itself is a <em>dynamically typed</em> language, which means that you can change the types of your variables midway through a program. Turtle Python, however, is a <em>statically typed</em> language, which means that you cannot change the types of your variables (so if you try to assign a string value to an integer variable, for example, you will get an error). The type hinting that is optional in Python itself is compulsory in Turtle Python.</p>
  <h4>User-defined functions and return statements</h4>
  <p>Compound statements are groups of statements that cover several lines. Most compound statements are command structures, described on the &lsquoStructures&rsquo; tab of his Language Guide. One kind of compound statement, however, is a custom function definition. Function definitions begin with the keyword <code>${highlight('def', 'Python')}</code>, followed by the function&rsquo;s name, opening and closing brackets, and a colon. The function&rsquo;s commands then follow on a newline, indented with one or more spaces at the start. For example:</p>
  <pre><code>${highlight('def prong():\n  forward(400)\n  blot(20)\n  back(400)', 'Python')}</code></pre>
  <p>Following a definition like this, you can then call your function in the same way you would call any built-in command: <code>${highlight('prong()', 'Python')}</code></p>
  <p>Functions can also be given parameters, which are specified inside the brackets after the function name. These are like variables for the function that are assinged a value each time the function is called. For example:</p>
  <pre><code>${highlight('def prong(size: int):\n  forward(size)\n  blot(20)\n  back(size)', 'Python')}</code></pre>
  <p>Values for these parameters must then be specified each time the function is called: <code>${highlight('prong(100)', 'Python')}</code></p>
  <p>If you want your function to return a value, you must specify the type of value after the function&rsquo;s closing brackets, and end the function&rsquo;s commands with a <code>${highlight('return', 'Python')}</code> statement specifying which value to return. For example:</p>
  <pre><code>${highlight('def double(a: int) -> int:\n  return a * 2', 'Python')}</code></pre>
  <h4><code>${highlight('global', 'Python')}</code>/<code>${highlight('nonlocal', 'Python')}</code> statements</h4>
  <p>Variables declared inside your main program are called <em>global</em> variables. Variables declared inside a custom function are called <em>local</em> variables. Local variables are only visible inside the function where they are declared; the main program, and any other custom function, will not be able to do anything with these variables. Global variables, in contrast, are visible throughout your program, including inside any custom functions. For example, the following program will draw a circle of radius 100 on the canvas:</p>
  <pre><code>${highlight('x: int\n\ndef drawCircle():\n  circle(x)\n\nx = 100\ndrawCircle()', 'Python')}</code></pre>
  <p>The following example, however, will generate an error, because the variable <code>${highlight('x', 'Python')}</code> is not visible within the main program:</p>
  <pre><code>${highlight('def declarex():\n  x: int = 100\n\ndeclarex()\ncircle(x)', 'Python')}</code></pre>
  <p>Although global variables are <em>visible</em> inside custom functions, meaning that you can access their current value, by default you cannot assign them a new value within a function. If you want to assign them a new value within a function, you must declare them in a <code>${highlight('global', 'Python')}</code> statement at the start of your function definition. Thus::</p>
  <pre><code>${highlight('x: int = 100 # x is now a global variable\n\ndef foo():\n  x = 200 # this is an error;\n          # the global x cannot be assigned a value here\n          # and no local x has been declared\n\ndef bar():\n  global x\n  x = 200 # this is fine, and will set the value of the global x', 'Python')}</code></pre>
  <p>Custom functions can be defined inside other custom functions. A function&rsquo's local variables are all visible within any of its subfunctions (and any of <em>their</em> subfunctions, etc.), but cannot be assigned new values there. In these cases, <code>nonlocal</code> statements operate exactly like <code>global</code> statements, and are used to make it possible to assign a value to a local variable from a function higher up in the tree.</p>`
