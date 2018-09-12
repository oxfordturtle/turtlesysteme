# Turtle System X

## 1. Basics

- The `main` module is the main process for the Electron version of the app.
- The `electron` module is the renderer process for the Electron version of the app.
- The `browser` module is the entry point for the browser version of the app.

Webpack generates single `tsx.js` files for both the Electron renderer and the browser (using the `electron` and `browser` modules respectively). These are placed in the `dist` directory.

Other modules are stored in subdirectories. As a matter of design principle, every directory contains an `index.js` file, controlling what that directory exposes to other parts of the application. Thus every directory is effectively a module, made up of various submodules within that directory. No require statement (except to SCSS files in the `styles` directory) should include any slashes: all dependencies should either be on modules in the same directory, or on upper-level modules.

There are five upper-level modules: `data`, `programs`, `dom`, `state`, and `components`. Details about each follow.

## 2. Data, Programs, and DOM

The `data` module exposes a load of system-wide constants. Its component modules mostly have no dependencies, though a few depend on their siblings (e.g. the `data/pc` module, which generates a map of pcodes from the array exported by the `constants/pcodes` module).

The `programs` module exposes all of the example programs (as plain text), in several associative arrays (one for each language). The `data/examples` module exposes arrays of example program names and ids for generating the lists of example programs. The text of the actual program can then be looked up from the `programs` module.

The `dom` module exposes a handful of utilities for DOM manipulation, notably functions for creating tabs, popups (for error messages), and generic elements.

## 3. Components

These previously mentioned three modules are all computationally pretty basic. This is where it starts to get a little more complicated, though there still isn't very much to say. The `components` module exposes five components of the interface, which are basically DOM elements that are dynamically updated to reflect the current application state, and also contain interactive elements that can trigger state changes. For details on how this works, see section 4 below. The five components are `system`, `program`, `controls`, `machine`, and `help`.

### 3.1. System

The `system` component displays (and lets you edit) the current program's name. On the browser version of the application, it also lets you change the current language (on the Electron version, there is an application menu for this). Displaying the pcode is a bit complicated, because there are options for displaying raw code or assembly code, and because long lines of pcode are wrapped (with a maximum of 8 codes per line).

### 3.2. Program

The `program` component display (and lets you edit) the current program's code, and also displays usage and pcode data when the program is compiled. On the browser version of the application, it also lets you open new programs (or example programs) and save your current program to disk (on the Electron version, there is an application menu for this).

The code display uses a *textarea* element for the actual input, but overlays this with a *pre* element, which contains a copy of the text with syntax highlighting. The syntax highlighting is generated using the `highlight` function exposed by the `state/compiler` module.

### 3.3. Controls

The `controls` component lets you run, halt, and pause the current program, and also displays the Turtle's current properties (constantly updated during program execution).

### 3.4. Machine

The `machine` component displays the output of the program, i.e. the machine canvas, console, and text output, and lets you inspect the machine's memory. It also lets you change the machine's run-time settings (via an additional tab on the browser version, and a separate popup window on the Electron version).

### 3.5. Help

The `help` component simply displays language specific help, i.e. the prepared help text for each language, together with tables of commands and native colour constants. The example code in the prepared help text is given syntax highlighting using the `highlight` function exposed by the `state/compiler` module.

## 4. State

Notes to follow.
