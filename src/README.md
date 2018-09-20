# Turtle System X

The Turtle System X is a cross-platform version of the Oxford Turtle System, an educational IDE with built-in support for Turtle graphics, designed to help students learn to program. The current version supports programming in BASIC, Pascal, and Python. The System includes compilers for these languages (with hundreds of precise and easy to understand error messages), compiling to a pseudo-code (or 'pcode') for a stack-based virtual machine. The compiled pcode and the contents of the virtual machine's memory can be inspected by advanced students wishing to learn some of the fundamentals of computer science.

The source code for this version of the System is written in JavaScript. It is compiled both as a single JavaScript file (for web deployment) and as an executable for Linux, MacOS, and Windows (using Node and Electron). The following explains how the source code is laid out.

## 1. Style Principles

### 1.1. Use StandardJS

The source code follows the [JavaScript Standard Style](https://standardjs.com). Because some style is desirable, and this one is clean and simple, and doesn't faff around with configuration options. I like it.

### 1.2. Write in a Top-Down Fashion

Higher-level things are defined first, using whatever lower-level things they need. Those lower-level things are then defined later. The point being, you should be able to look at a module and see up front what it does. You should only need to read on if you want to know *how* it does it.

In the same vein, the *first* thing in any module should be whatever it exports. Any dependencies (be they imports from other modules or other things defined in the same module) should come later.

There are exceptions to these general rules. The modules in the `components` directory output HTML elements. Of necessity, these elements are defined in a bottom-up order, since higher-level elements have lower-level elements as children, and therefore require these children to be defined first. In these modules, the elements are first defined in reverse order, then come the module exports, then come any other things needed (defined in top-down order, as in the general case).

### 1.3. Control Exports through `index`

Every directory should have an `index` file, which controls what is visible to modules outside that directory. Modules outside that directory should only ever import the module itself (i.e. the `index` file), rather than its submodules. In practical terms, this means all `require` statements should only be in one of two forms: `require('global-module')` or `require('./local-submodule')`.

### 1.4. Write Pure(ish) Functions

Side-effects and mutable data tend are avoided where possible, but not religiously. On the whole, for-loops should be shunned, but while-loop are acceptable in place of recursion; until JavaScript engines implement tail-call optimization, performance considerations take precedence over style.

Internally mutable data and side-effects are tolerated in the sub-functions of the `compile` function. The first pass returns an object represented the program structure, and the second pass returns an array of pcode; in both cases those variables are passed around internally, being modified or added to as they go, and creating a new object or array at each stage would make the functions verbose. Or at least, it would the way I write JavaScript; presumably a better functional programmer working in a functional language could do better.

## 2. Source Code Structure

### 2.1. Data, Programs, DOM, and Styles

Let's get some basic things out of the way first.

The `data` module exposes a load of system-wide constants, mostly in arrays. Its component modules mostly have no dependencies, though a few depend on their siblings (e.g. the `data/pc` module, which generates a map of pcodes---for easy lookup---from the array exported by the `constants/pcodes` module).

The `programs` module exposes all of the example programs (as plain text), in several associative arrays (one for each language). The `data/examples` module exposes arrays of example program names and ids for generating the lists of example programs in the drop-down menus. The text of the actual programs can be looked up from the `programs` module (using its id).

The `dom` module exposes a handful of utilities for DOM manipulation, notably functions for creating tabs, popups (for error messages), and generic HTML elements.

The `styles` directory doesn't contain a module; it just contains the CSS styles for the System (in SCSS files). In place of an `index`, it contains a `main.scss` file, which imports all of the separate files.

### 2.2. Compiler

[Notes to follow soon.]

### 2.3. Machine

[Notes to follow soon.]

### 2.4. State and Components

[These notes are still being written...]

- The `system` component displays (and lets you edit) the current program's name. On the browser version of the application, it also lets you change the current language (on the Electron version, there is an application menu for this). Displaying the pcode is a bit complicated, because there are options for displaying raw code or assembly code, and because long lines of pcode are wrapped (with a maximum of 8 codes per line).
- The `program` component display (and lets you edit) the current program's code, and also displays usage and pcode data when the program is compiled. On the browser version of the application, it also lets you open new programs (or example programs) and save your current program to disk (on the Electron version, there is an application menu for this). The code display uses a *textarea* element for the actual input, but overlays this with a *pre* element, which contains a copy of the text with syntax highlighting. The syntax highlighting is generated using the `highlight` function exposed by the `state/compiler` module.
- The `controls` component lets you run, halt, and pause the current program, and also displays the Turtle's current properties (constantly updated during program execution).
- The `machine` component displays the output of the program, i.e. the machine canvas, console, and text output, and lets you inspect the machine's memory. It also lets you change the machine's run-time settings (via an additional tab on the browser version, and a separate popup window on the Electron version).
- The `help` component simply displays language specific help, i.e. the prepared help text for each language, together with tables of commands and native colour constants. The example code in the prepared help text is given syntax highlighting using the `highlight` function exposed by the `state/compiler` module.
