# Turtle System X

## 1. Style Principles

### 1.1. Use StandardJS

The source code follows the [JavaScript Standard Style](https://standardjs.com). Because some style is desirable, and this one is clean and simple, and doesn't faff around with configuration options. I like it.

### 1.2. Write in a Top-Down Fashion

Higher-level things are defined first, using whatever lower-level things they need. Those lower-level things are then defined later. The point being, you should be able to look at a module and see up front what it does. You should only need to read on if you want to know *how* it does it.

In the same vein, the *first* thing in any module should be whatever it exports. Any dependencies (be they imports from other modules or other things defined in the same module) should come later.

There are exceptions to these general rules. The modules in the `components` directory output HTML elements. Of necessity, these elements are defined in a bottom-up order, since higher-level elements have lower-level elements as children, and therefore require these children to be defined first. In these modules, the elements are first defined in reverse order, then come the module exports, then come any other things needed (defined in top-down order, as in the general case).

### 1.3. Write Pure(ish) Functions

Side-effects and mutable data tend are avoided where possible, but not religiously. On the whole, for-loops should be shunned, but while-loop are acceptable in place of recursion; until JavaScript engines implement tail-call optimization, performance considerations take precedence over style.

Internally mutable data and side-effects are tolerated in the sub-functions of the `compile` function. The first pass returns an object represented the program structure, and the second pass returns an array of pcode; in both cases those variables are passed around internally, being modified or added to as they go.

## 2. Source Code Structure

### 2.1. Data, Examples, Tools, and Styles

Let's get some basic things out of the way first: The `data` directory system-wide constants, mostly in arrays. The `app/examples` module exposes arrays of example program names and ids for generating the lists of example programs in the drop-down menus. The text of the actual programs can be looked up from the `app/examples` directory. The `tools` module exposes a handful of utilities for DOM manipulation, notably functions for creating tabs, popups (for error messages), and generic HTML elements. The `styles` directory doesn't contain a module; it just contains the CSS styles for the System (in SCSS files).

### 2.2. Compiler

[Notes to follow soon.]

### 2.3. System

[Notes to follow soon.]

### 2.4. Components

[Notes to follow soon.]
