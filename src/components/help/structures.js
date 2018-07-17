const { create } = require('dom');
const { highlight } = require('lexer');
const state = require('state');

const BASIC = [
  create('div', { content: `    <h3>Command Structures</h3>
    <p>Selection and ordering of commands is done by <i>sequencing</i>, <i>conditional selection</i>, and <i>looping</i>.</p>
    <h4>Sequencing of Commands</h4>
    <p>Commands to be performed in sequence are usually placed in the appropriate order within the program, e.g.:</p>
    <pre><span class="function">COLOUR</span>(<span class="constant">GREEN</span>)
<span class="function">BLOT</span>(<span class="integer">100</span>)
<span class="function">PAUSE</span>(<span class="integer">1000</span>)
<span class="function">COLOUR</span>(<span class="constant">RED</span>)
<span class="function">FORWARD</span>(<span class="integer">450</span>) <span class="meta-comment">(etc.)</span></pre>
    <p>(From the first example program in the Help menu.)</p>
    <h4>Conditional Selection of Commands</h4>
    <p>Suppose you want to draw a blot with a given radius (stored as the integer variable <code class="variable">radius%</code>), but only if that value is less than <span class="integer">500</span>; do it like this:</p>
    <pre><span class="keyword">IF</span> <span class="variable">radius%</span> <span class="operator">&lt;</span> <span class="integer">500</span> <span class="keyword">THEN</span>
  <span class="function">BLOT</span>(<span class="variable">radius%</span>)
<span class="keyword">ENDIF</span></pre>
    <p>If you want to do something different when the condition is not met (e.g. drawing a blot with half the radius), extend the <code><span class="keyword">IF</span> <span class="meta-comment">&hellip;</span> <span class="keyword">THEN</span></code> structure by adding <code class="keyword">ELSE</code> and then the new command:</p>
    <pre><span class="keyword">IF</span> <span class="variable">radius%</span> <span class="operator">&lt;</span> <span class="integer">500</span> <span class="keyword">THEN</span>
  <span class="function">BLOT</span>(<span class="variable">radius%</span>)
<span class="keyword">ELSE</span>
  <span class="function">BLOT</span>(<span class="variable">radius%</span> <span class="operator">/</span> <span class="integer">2</span>)
<span class="keyword">ENDIF</span></pre>
    <h4>Grouping of Commands</h4>
    <p>A sequence of commands within an <code><span class="keyword">IF</span> <span class="meta-comment">&hellip;</span> <span class="keyword">THEN</span> <span class="meta-comment">&hellip;</span> <span class="keyword">ELSE</span> <span class="meta-comment">&hellip;</span> <span class="keyword">ENDIF</span></code> structure is always treated as a single command. The <code class="keyword">ELSE</code> and <code class="keyword">ENDIF</code> words bracket off the sequence of commands. (Another possibility is to package them into a procedure.) You can also write these on a single line without the <code class="keyword">ENDIF</code>, like this:</p>
    <pre><span class="keyword">IF</span> <span class="variable">radius%</span> <span class="operator">&lt;</span> <span class="integer">500</span> <span class="keyword">THEN</span> <span class="function">BLOT</span>(<span class="variable">radius%</span>)</pre>
    <h4>Spacing, Indenting, Auto-Formatting</h4>
    <p>Unnecessary &lsquo;white space&rsquo; is ignored by BASIC, so you can use line breaks and indenting to make the structure of your program easy to read. However, each statement must be on its own line, unless separated by a colon &lsquo;:&rsquo;. The Edit menu provides an auto-formatter that will neaten your programs in a standard way. Use it!</p>
    <h4>Looping Structures</h4>
    <p>BASIC provides three different structures for looping (or &lsquo;iterating&rsquo;) commands. If you know in advance how many times you want to loop – or you want to &lsquo;loop over&rsquo; a particular range of values (e.g. from <span class="integer">1</span> to <span class="integer">200</span>), then the simplest is a &lsquo;<span class="keyword">FOR</span> loop&rsquo; (or &lsquo;counting loop&rsquo;):</p>
    <pre><span class="keyword">FOR</span> <span class="variable">count%</span> <span class="operator">=</span> <span class="integer">1</span> <span class="keyword">TO</span> <span class="integer">200</span>
  <span class="function">FORWARD</span>(<span class="variable">count%</span> <span class="operator">/</span> <span class="integer">3</span>)
  <span class="function">RIGHT</span>(<span class="integer">5</span>)
  <span class="meta-comment">&hellip;</span>
<span class="keyword">NEXT</span></pre>
    <p>(From the first <span class="keyword">FOR</span> loop example program in the Help menu.)</p>
    <p>Here, <code class="keyword">NEXT</code> is used to bracket together a number of commands, and indenting is used to show the structure.</p>
    <p>To count downwards, use <code><span class="keyword">STEP</span> <span class="integer">-1</span></code> at then end (as in the &lsquo;Procedure with parameter&rsquo; example program).</p>
    <p>In a <span class="keyword">FOR</span> loop, the &lsquo;loop variable&rsquo; (here <code class="variable">count%</code>) is given in turn each of the values in the range (here <span class="integer">1</span>, <span class="integer">2</span>, <span class="integer">3</span>, &hellip;, <span class="integer">199</span>, <span class="integer">200</span>), and the loop instructions are performed each time. So in the example above, a spiral is drawn as the Turtle moves forward gradually more and more (as <code class="variable">count%</code> increases).</p>
    <p>If instead of looping a specific number of times, you want to loop through some sequence of commands until some particular condition becomes true, then you can use:</p>
    <pre><span class="keyword">REPEAT</span>
  <span class="meta-comment">&lt;command1&gt;</span>
  <span class="meta-comment">&lt;command2&gt; (etc.)</span>
<span class="keyword">UNTIL</span> <span class="meta-comment">&lt;condition&gt;</span></pre>
    <p>The &lsquo;Simple procedure&rsquo; example program does this, looping until the Turtle is pointing directly north (i.e., <code><span class="variable">TURTD%</span> <span class="operator">=</span> <span class="integer">0</span></code>).</p>
    <p>Alternatively, you can loop through a sequence of commands while some condition is true (so that it stops when the condition becomes false):</p>
    <pre><span class="keyword">WHILE</span> <span class="meta-comment">&lt;condition&gt;</span>
  <span class="meta-comment">&lt;sequence of commands&gt;</span>
<span class="keyword">ENDWHILE</span></pre>
    <p>Things that can be done with a <span class="keyword">REPEAT</span> loop can equally be done with a <span class="keyword">WHILE</span> loop (and vice-versa), but sometimes one is more natural than the other. Notice also that a <span class="keyword">REPEAT</span> loop always executes the sequence of commands at least once, because it tests the <span class="meta-comment">&lt;condition&gt;</span> at the end of the loop. But a <span class="keyword">WHILE</span> loop tests the <span class="meta-comment">&lt;condition&gt;</span> <i>before</i> executing the sequence of commands, and so will not execute them even once if <span class="meta-comment">&lt;condition&gt;</span> is false to start with. (For examples of the various loops, see the second set of example programs, &lsquo;Further commands and structures&rsquo;.)
` }),
];

const Pascal = [
  create('div', { content: `    <h3>Command Structures</h3>
    <p>Selection and ordering of commands is done by <i>sequencing</i>, <i>conditional selection</i>, and <i>looping</i>.</p>
    <h4>Sequencing of Commands</h4>
    <p>Commands to be performed in sequence are usually placed in the appropriate order within the program, separated by semicolons, e.g.:</p>
    <pre><span class="function">colour</span>(<span class="constant">green</span>);
<span class="function">blot</span>(<span class="integer">100</span>);
<span class="function">pause</span>(<span class="integer">1000</span>);
<span class="function">colour</span>(<span class="constant">red</span>);
<span class="function">forward</span>(<span class="integer">450</span>); <span class="meta-comment">(etc.)</span></pre>
    <p>(From the first example program in the Help menu.)</p>
    <h4>Conditional Selection of Commands</h4>
    <p>Suppose you want to draw a blot with a given radius (stored as the integer variable <code class="variable">radius</code>), but only if that value is less than <span class="integer">500</span>; do it like this:</p>
    <pre><span class="keyword">if</span> <span class="variable">radius</span> <span class="operator">&lt;</span> <span class="integer">500</span> <span class="keyword">then</span>
  <span class="function">blot</span>(<span class="variable">radius</span>);</pre>
    <p>If you want to do something different when the condition is not met (e.g. drawing a blot with half the radius), extend the <code><span class="keyword">if</span> <span class="meta-comment">&hellip;</span> <span class="keyword">then</span></code> structure by adding <code class="keyword">else</code> and then the new command:</p>
    <pre><span class="keyword">if</span> <span class="variable">radius</span> <span class="operator">&lt;</span> <span class="integer">500</span> <span class="keyword">then</span>
  <span class="function">blot</span>(<span class="variable">radius</span>)
<span class="keyword">else</span>
  <span class="function">blot</span>(<span class="variable">radius</span> <span class="operator">/</span> <span class="integer">2</span>);</pre>
    <p>Notice that this is a single complex command, so you must not put a semicolon before the <code class="keyword">else</code> (if you do, Turtle will give you a warning).</p>
    <h4>Grouping of Commands</h4>
    <p>Sometimes you will want to do a sequence of commands within an <code><span class="keyword">if</span> <span class="meta-comment">&hellip;</span> <span class="keyword">then</span> <span class="meta-comment">&hellip;</span> <span class="keyword">else</span></code> structure, in which case you can bracket them between <code class="keyword">begin</code> and <code class="keyword">end</code>, e.g.</p>
    <pre><span class="keyword">if</span> <span class="meta-comment">&lt;condition&gt;</span> <span class="keyword">then</span>
  <span class="keyword">begin</span>
    <span class="meta-comment">&lt;sequence1&gt;</span>
  <span class="keyword">end</span>
<span class="keyword">else</span>
  <span class="keyword">begin</span>
    <span class="meta-comment">&lt;sequence2&gt;</span>
  <span class="keyword">end</span>;</pre>
    <p>Any such bracketed sequence of commands is always treated as a single command. (Another possibility is to package them into a procedure.)</p>
    <h4>Spacing, Indenting, Auto-Formatting</h4>
    <p>Unnecessary &lsquo;white space&rsquo; is ignored by Pascal, so you can use line breaks and indenting to make the structure of your program easy to read. The Edit menu provides an auto-formatter that will neaten your programs in a standard way. Use it!</p>
    <h4>Looping Structures</h4>
    <p>Pascal provides three different structures for looping (or &lsquo;iterating&rsquo;) commands. If you know in advance how many times you want to loop – or you want to &lsquo;loop over&rsquo; a particular range of values (e.g. from <span class="integer">1</span> to <span class="integer">200</span>), then the simplest is a &lsquo;<span class="keyword">for</span> loop&rsquo; (or &lsquo;counting loop&rsquo;):</p>
    <pre><span class="keyword">for</span> <span class="variable">count</span> <span class="operator">:=</span> <span class="integer">1</span> <span class="keyword">to</span> <span class="integer">200</span> <span class="keyword">do</span>
  <span class="keyword">begin</span>
    <span class="function">forward</span>(<span class="variable">count</span> <span class="operator">/</span> <span class="integer">3</span>);
    <span class="function">right</span>(<span class="integer">5</span>);
    <span class="meta-comment">&hellip;</span>
  <span class="keyword">end</span>;</pre>
    <p>(From the first <span class="keyword">for</span> loop example program in the Help menu.)</p>
    <p>Again <code><span class="keyword">begin</span> <span class="meta-comment">&hellip;</span> <span class="keyword">end</span></code> is used to bracket together a number of commands, and indenting is used to show the structure.</p>
    <p>In a <span class="keyword">for</span> loop, the &lsquo;loop variable&rsquo; (here <code class="variable">count</code>) is given in turn each of the values in the range (here <span class="integer">1</span>, <span class="integer">2</span>, <span class="integer">3</span>, &hellip;, <span class="integer">199</span>, <span class="integer">200</span>), and the loop instructions are performed each time. So in the example above, a spiral is drawn as the Turtle moves forward gradually more and more (as <code class="variable">count</code> increases).</p>
    <p>To count downwards, use <code class="keyword">downto</code> instead of <code class="keyword">to</code> (as in the &lsquo;Procedure with parameter&rsquo; example program.</p>
    <p>If instead of looping a specific number of times, you want to loop through some sequence of commands until some particular condition becomes true, then you can use:</p>
    <pre><span class="keyword">repeat</span>
  <span class="meta-comment">&lt;command1&gt;</span>;
  <span class="meta-comment">&lt;command2&gt;</span>; <span class="meta-comment">(etc.)</span>
<span class="keyword">until</span> <span class="meta-comment">&lt;condition&gt;</span></pre>
    <p>The &lsquo;Simple procedure&rsquo; example program does this, looping until the Turtle is pointing directly north (i.e., <code><span class="variable">turtd</span> <span class="operator">=</span> <span class="integer">0</span></code>) Alternatively, you can loop through a sequence of commands while some condition is true (so that it stops when the condition becomes false):</p>
    <pre><span class="keyword">while</span> <span class="meta-comment">&lt;condition&gt;</span> <span class="keyword">do</span>
  <span class="keyword">begin</span>
    <span class="meta-comment">&lt;sequence of commands&gt;</span>
  <span class="keyword">end</span>;</pre>
    <p>Things that can be done with a &lsquo;<span class="keyword">repeat</span> loop&rsquo; can equally be done with a &lsquo;<span class="keyword">while</span> loop&rsquo; (and vice-versa), but sometimes one is more natural than the other. Notice also that a <span class="keyword">repeat</span> loop always executes the sequence of commands at least once, because it tests the <span class="meta-comment">&lt;condition&gt;</span> at the end of the loop. But a <span class="keyword">while</span> loop tests the <span class="meta-comment">&lt;condition&gt;</span> <i>before</i> executing the sequence of commands, and so will not execute them even once if <span class="meta-comment">&lt;condition&gt;</span> is false to start with. (For examples of the various loops, see the second set of example programs, &lsquo;Further commands and structures&rsquo;.)</p>
` }),
];

const Python = [
  create('div', { content: `    <h3>Command Structures</h3>
    <p>Selection and ordering of commands is done by <i>sequencing</i>, <i>conditional selection</i>, and <i>looping</i>.</p>
    <h4>Sequencing of Commands</h4>
    <p>Commands to be performed in sequence are usually placed in the appropriate order within the program, with the same indent, e.g.:</p>
    <pre><span class="function">colour</span>(<span class="constant">green</span>)
<span class="function">blot</span>(<span class="integer">100</span>)
<span class="function">pause</span>(<span class="integer">1000</span>) <span class="meta-comment">(etc.)</span></pre>
    <p>(From the first example program in the Help menu.)</p>
    <h4>Conditional Selection of Commands</h4>
    <p>Suppose you want to draw a blot with a given radius (stored as the integer variable <code class="variable">radius</code>), but only if that value is less than <span class="integer">500</span>; do it like this:</p>
    <pre><span class="keyword">if</span> <span class="variable">radius</span> <span class="operator">&lt;</span> <span class="integer">500</span>:
  <span class="function">blot</span>(<span class="variable">radius</span>)</pre>
    <p>If you want to do something different when the condition is not met (e.g. drawing a blot with half the radius), extend the <code><span class="keyword">if</span> <span class="meta-comment">&hellip;</span></code> structure by adding <code class="keyword">else</code> and then the new command:</p>
    <pre><span class="keyword">if</span> <span class="variable">radius</span> <span class="operator">&lt;</span> <span class="integer">500</span>:
  <span class="function">blot</span>(<span class="variable">radius</span>)
<span class="keyword">else</span>:
  <span class="function">blot</span>(<span class="variable">radius</span> <span class="operator">//</span> <span class="integer">2</span>)</pre>
    <p>Notice that this is a single complex command, so the <code class="keyword">else</code> must have the same indent as <code class="keyword">if</code> and the sub-commands must be further indented (if you do not indent correctly, Turtle will give you a warning).</p>
    <h4>Grouping of Commands</h4>
    <p>Sometimes you will want to do a sequence of commands within an <code><span class="keyword">if</span> <span class="meta-comment">&hellip;</span> <span class="keyword">else</span></code> structure, in which case you can group them by indenting them all by the same amount. Any such indented sequence of commands is treated as a single command. (Another possibility is to package them into a function.)</p>
    <p>Note that indents must be consistent, so the following will generate several errors:</p>
    <pre><span class="keyword">if</span> <span class="variable">radius</span> <span class="operator">&lt;</span> <span class="integer">500</span>:
  <span class="function">blot</span>(<span class="variable">radius</span>)
    <span class="function">blot</span>(<span class="variable">radius</span> <span class="operator">//</span> <span class="integer">3</span>)      <span class="meta-comment">{ too many indents }</span>
  <span class="keyword">else</span>:            <span class="meta-comment">{ should match the <b>if</b> line }</span>
  <span class="function">blot</span>(<span class="variable">radius</span> <span class="operator">//</span> <span class="integer">2</span>) <span class="meta-comment">{ needs indent after <b>else</b> }</span></pre>
    <h4>Auto-Formatting</h4>
    <p>The Edit menu provides an auto-formatter that will neaten your programs in a standard way. Use it!</p>
    <h4>Looping Structures</h4>
    <p>Python provides two different structures for looping (or &lsquo;iterating&rsquo;) commands. If you know in advance how many times you want to loop – or you want to &lsquo;loop over&rsquo; a particular range of values (e.g. from <span class="integer">1</span> to <span class="integer">200</span>), then the simplest is a &lsquo;<span class="keyword">for</span> loop&rsquo; (or &lsquo;counting loop&rsquo;):</p>
    <pre><span class="keyword">for</span> <span class="variable">count</span> <span class="keyword">in</span> <span class="function">range</span>(<span class="integer">1</span>, <span class="integer">201</span>, <span class="integer">1</span>):
  <span class="function">forward</span>(<span class="variable">count</span> <span class="operator">//</span> <span class="integer">3</span>)
  <span class="function">right</span>(<span class="integer">5</span>)
  <span class="meta-comment">&hellip;</span></pre>
    <p>(From the first <span class="keyword">for</span> loop example program in the Help menu.)</p>
    <p>Again indenting is used to group together a number of commands.</p>
    <p>In a <span class="keyword">for</span> loop, the &lsquo;loop variable&rsquo; (here <code class="variable">count</code>) is given in turn each of the values in the range (here <span class="integer">1</span>, <span class="integer">2</span>, <span class="integer">3</span>, &hellip;, <span class="integer">199</span>, <span class="integer">200</span>), and the loop instructions are performed each time. So in the example above, a spiral is drawn as the Turtle moves forward gradually more and more (as <code class="variable">count</code> increases).</p>
    <p>The <span class="function">range</span> function specifies the values that the loop variable will take as follows:</p>
    <pre><span class="function">range</span>(<span class="variable">firstValue</span>, <span class="variable">lastValue</span> <span class="operator">+</span> <span class="integer">1</span>, <span class="variable">increment</span>)</pre>
    <p>The increment can be either <span class="integer">1</span> or <span class="integer">-1</span>. To count down through a loop, use an increment of <span class="integer">-1</span>.</p>
    <p>If instead of looping a specific number of times, you want to loop through some sequence of commands while some condition is true (so that it stops when the condition becomes false), then you can use:</p>
    <pre><span class="keyword">while</span> <span class="meta-comment">&lt;condition&gt;</span>:
  <span class="meta-comment">&lt;sequence of commands&gt;</span></pre>
    <p>A <span class="keyword">while</span> loop tests the <span class="meta-comment">&lt;condition&gt;</span> <i>before</i> executing the sequence of commands, and so will not execute them even once if <span class="meta-comment">&lt;condition&gt;</span> is false to start with. (For examples of the various loops, see the second set of example programs, &lsquo;Further commands and structures&rsquo;.)</p>
` }),
];

const text = { BASIC, Pascal, Python };

const structures = create('div');

const refresh = (language) => {
  structures.innerHTML = '';
  text[language].forEach(x => structures.appendChild(x));
};

refresh(state.getLanguage());
state.on('language-changed', refresh);

module.exports = structures;
