/*
 * record of example programs
 */
const newExample = (id, name) =>
  ({ id, name });

const newExampleGroup = (index, title, examples) =>
  ({ index, title, examples });

module.exports = {
  // help examples
  help: [
    newExampleGroup(1, 'Drawing, counting, and procedures/methods', [
      newExample('DrawPause', 'Simple drawing with pauses'),
      newExample('OlympicRings1', 'Olympic rings 1 (using PENUP)'),
      newExample('OlympicRings2', 'Olympic rings 2 (with variable)'),
      newExample('ThePlough', 'The plough constellation'),
      newExample('ForLoop', 'FOR (counting) loop'),
      newExample('Circles', 'Circling circles'),
      newExample('NestedLoops', 'Nested FOR loops'),
      newExample('SimpleProcedure', 'Simple procedure'),
      newExample('ColourSpiral', 'Spiral of colours'),
      newExample('ParameterProcedure', 'Procedure with parameter'),
      newExample('Polygons', 'POLYGON and POLYLINE'),
      newExample('YouAreHere', 'Text and arrow (using PRINT)'),
    ]),
    newExampleGroup(2, 'Further commands and structures', [
      newExample('Stars', 'Stars (using ANGLES and FORGET)'),
      newExample('PolygonRings', 'Polygon rings'),
      newExample('Clock', 'Analogue clock (using REPEAT)'),
      newExample('DigitalClock', 'Digital clock (using IF and WHILE)'),
      newExample('CycleColours', 'Cycling colours (using MOD)'),
      newExample('Triangles', 'Recursive triangles'),
      newExample('Flashlights', 'Using Booleans'),
      newExample('RefParams', 'Reference parameters'),
      newExample('Balls3D', '3D colour effects'),
      newExample('AskInput', 'Asking for typed input'),
      newExample('StringFunctions', 'String functions'),
      newExample('MathFunctions', 'Mathematical functions'),
      newExample('TrigonometricGraphs', 'Trigonometric graphs'),
    ]),
    newExampleGroup(3, 'Smooth movement and interaction', [
      newExample('MovingBall', 'Moving ball (using variables)'),
      newExample('BouncingBall', 'Bouncing ball (using variables)'),
      newExample('TurtleMove', 'Moving ball (using the Turtle)'),
      newExample('TurtleBounce', 'Bouncing ball (using the Turtle)'),
      newExample('MultiBounce', 'Multiple bouncing balls'),
      newExample('GravitySteps', 'Movement under gravity'),
      newExample('SolarSystem', 'Solar system (using ARRAY)'),
      newExample('SimpleDraw', 'Drawing to the mouse'),
      newExample('FiveTurtles', 'Five turtles moving to the mouse'),
    ]),
    newExampleGroup(4, 'Complex applications', [
      newExample('PaintApp', 'Painting application'),
      newExample('SnakeGame', 'Snake (classic game)'),
      newExample('Shoot', 'Arcade shooting game'),
      newExample('Mandelbrot', 'Mandelbrot set'),
      newExample('Quine', 'Quine (self-replicating) program'),
      newExample('NoughtsAndCrosses', 'Noughts and crosses'),
    ]),
    newExampleGroup(5, 'Artificial life and social models', [
      newExample('GameOfLife', 'Conway\'s Game of Life'),
      newExample('Schelling', 'Schelling\'s segregation model'),
      newExample('IteratedPD', 'Iterated Prisoner\'s Dilemma'),
    ])
  ],
  // csac book examples
  csac: [
    newExampleGroup(1, 'Introduction, Computer Science for Fun, and Turtling', [
      newExample('DrawPause', '1.4 Simple drawing with pauses'),
      newExample('ColourSpiral', '1.5 Spiral of colours'),
    ]),
    newExampleGroup(2, 'Animation and Movement', [
      newExample('MovingBall', '2.1 Moving ball (using variables)'),
      newExample('BouncingBall', '2.2 Bouncing ball (using variables)'),
      newExample('TurtleMove', '2.3 (a) Moving ball (using the Turtle)'),
      newExample('TurtleBounce', '2.3 (b) Bouncing ball (using the Turtle)'),
      newExample('AskInput', '2.4.1 Asking for typed input'),
    ]),
    newExampleGroup(3, 'Computing in Physics: Cannons and Rockets', [
      newExample('GravitySteps', '3.1 Movement under gravity'),
      newExample('AimCannon', '3.2 (a) Firing a cannon (manual)'),
      newExample('AutoCannon', '3.2 (b) Firing a cannon (automatic)'),
      newExample('RocketLaunch', '3.3 Launching a rocket into orbit'),
    ]),
    newExampleGroup(4, 'Cellular Automata: Modelling Disease, \'Life\', and Shell Patterns', [
      newExample('LifeStart', '4.1 Initialising Conway\'s Game of Life'),
      newExample('Disease', '4.2 Spread of disease'),
      newExample('GameOfLife', '4.5 Conway\'s Game of Life'),
      newExample('Automata', '4.6 One-dimensional cellular automata'),
    ]),
    newExampleGroup(5, 'Computing in Chemistry: Diffusion and Brownian Motion', [
      newExample('Diffusion', '5.1 A model of diffusion'),
      newExample('BrownianMotion', '5.2 Brownian motion'),
    ]),
    newExampleGroup(6, 'Computing in Biology: Evolution and Behaviour', [
      newExample('Cheetahs', '6.1 Cheetahs and gazelles'),
      newExample('SexRatio', '6.2 The sex ratio'),
      newExample('Flocking', '6.3 Flocking behaviour'),
    ]),
    newExampleGroup(7, 'Chaos and Self-Similarity', [
      newExample('Logistic', '7.1 (a) Logistic equation'),
      newExample('LogisticSpider', '7.1 (b) Logistic spider'),
      newExample('Mandelbrot', '7.2 Mandelbrot set'),
      newExample('MandelbrotMini', '7.2.1 Mandelbrot mini'),
      newExample('MandelbrotSpectrum', '7.2.2 (a) Mandelbrot spectrum'),
      newExample('MandelbrotMiniSpectrum', '7.2.2 (b) Mandelbrot mini spectrum'),
      newExample('Triangles', '7.3 (a) Recursive triangles'),
      newExample('Sierpinski', '7.3 (b) Sierpinski triangle'),
      newExample('SierpinskiDots', '7.3 (c) Sierpinski dots'),
      newExample('IFSBackground', '7.4 (a) Iterated function systems (IFS) background'),
      newExample('SierpinskiColour', '7.4 (b) Sierpinski colour'),
      newExample('SierpinskiIFS', '7.4 (c) Sierpinski IFS'),
      newExample('BarnsleyIFS', '7.5 (a) Barnsley IFS'),
      newExample('BarnsleyColour', '7.5 (b) Barnlsey colour'),
      newExample('TreeIFS', '7.5 (c) Tree IFS'),
      newExample('DragonIFS', '7.5 (d) Dragon IFS'),
      newExample('DragonColour', '7.5 (e) Dragon colour'),
    ]),
    newExampleGroup(8, 'Waves and Quantum Mechanics', [
      newExample('Interference', '8.3 Interference'),
      newExample('WaveSuperposer', '8.5 Wave superposer'),
      newExample('TwoSlits', '8.6 Young\'s two-slit experiment'),
    ]),
    newExampleGroup(9, 'Games and Computer Science', [
      newExample('KnightsTour', '9.1 Knight\'s tour'),
      newExample('Nim', '9.2 Nim'),
      newExample('NoughtsAndCrosses', '9.3 Noughts and crosses'),
    ]),
    newExampleGroup(10, 'Philosophy and Social Science', [
      newExample('Schelling', '10.1 Schelling\'s segregation model'),
      newExample('IteratedPD', '10.2 Iterated Prisoner\'s Dilemma'),
    ])
  ]
};
