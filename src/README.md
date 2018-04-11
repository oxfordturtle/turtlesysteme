# Turtle System X

## Basics

- The `main.js` module is the main process for the Electron version of the app.
- The `electron.js` module is the renderer process for the Electron version of the app.
- The `browser.js` module is the entry point for the browser version of the app.

Webpack generates single `tsx.js` files for both the Electron renderer and the browser (using the `electron.js` and `browser.js` modules respectively). These are placed in the `dist` directory.

Other modules are stored in subdirectories. As a matter of design principle, every directory contains an `index.js` file, controlling what that directory exposes to other parts of the application. Thus every directory is effectively a module, made up of various submodules within that directory. No require statement (except to SCSS files in the `styles` directory) should include any slashes: all dependencies should either be on modules in the same directory, or on upper-level modules.

There are five upper-level modules: `components`, `dom`, `compiler`, `machine`, and `constants`. Broadly speaking, the modules earlier in this list depend on the modules later in the list. I shall now say a little more about them, in reverse order.

## Constants

The `constants` module, as you would expect, exposes a load of system-wide constants. Its component modules mostly have no dependencies, though a few depend on their siblings (e.g. the `constants/pc.js` module, which generates a map of pcodes from the array exported by the `constants/pcodes.js` module).

System-wide constants include the code for all the on-board example programs (stored as plain text files), and all the system and compilation error messages.

## The Compilers and the Turtle Machine

The compilers and the virtual Turtle machine live in the `compiler` and `machine` subdirectories respectively. These are the two main features of the system. The compilers are just pure functions, turning program code (text) into machine code. They have no dependencies apart from some of the system-wide constants.

The machine also has no dependencies aside from some system-wide constants. Obviously it is not a pure function, however. It has its own internal state, which is updated, initially in response to calling the machine to execute a compiled program, and then subsequently by that program itself.

## DOM


## Components
