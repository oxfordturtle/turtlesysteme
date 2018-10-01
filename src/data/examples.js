/*
groups of example programs (for the example menus)
*/
import { group } from './factory.js'

export const help = [
  group(1, 'Drawing, counting, and procedures/methods', [
    'DrawPause',
    'OlympicRings1',
    'OlympicRings2',
    'ThePlough',
    'ForLoop',
    'Circles',
    'NestedLoops',
    'SimpleProcedure',
    'ColourSpiral',
    'ParameterProcedure',
    'Polygons',
    'YouAreHere'
  ]),
  group(2, 'Further commands and structures', [
    'Stars',
    'PolygonRings',
    'Clock',
    'DigitalClock',
    'CycleColours',
    'Triangles',
    'Flashlights',
    'RefParams',
    'Balls3D',
    'AskInput',
    'StringFunctions',
    'MathFunctions',
    'TrigonometricGraphs'
  ]),
  group(3, 'Smooth movement and interaction', [
    'MovingBall',
    'BouncingBall',
    'TurtleMove',
    'TurtleBounce',
    'MultiBounce',
    'GravitySteps',
    'SolarSystem',
    'SimpleDraw',
    'FiveTurtles'
  ]),
  group(4, 'Complex applications', [
    'PaintApp',
    'SnakeGame',
    'Shoot',
    'Mandelbrot',
    'Quine',
    'NoughtsAndCrosses'
  ]),
  group(5, 'Artificial life and social models', [
    'GameOfLife',
    'Schelling',
    'IteratedPD'
  ])
]

export const csac = [
  group(1, 'Introduction, Computer Science for Fun, and Turtling', [
    'DrawPause',
    'ColourSpiral'
  ]),
  group(2, 'Animation and Movement', [
    'MovingBall',
    'BouncingBall',
    'TurtleMove',
    'TurtleBounce',
    'AskInput'
  ]),
  group(3, 'Computing in Physics: Cannons and Rockets', [
    'GravitySteps',
    'AimCannon',
    'AutoCannon',
    'Launch'
  ]),
  group(4, 'Cellular Automata: Modelling Disease, \'Life\', and Shell Patterns', [
    'LifeStart',
    'Disease',
    'GameOfLife',
    'Automata'
  ]),
  group(5, 'Computing in Chemistry: Diffusion and Brownian Motion', [
    'Diffusion',
    'BrownianMotion'
  ]),
  group(6, 'Computing in Biology: Evolution and Behaviour', [
    'Cheetahs',
    'SexRatio',
    'Flocking'
  ]),
  group(7, 'Chaos and Self-Similarity', [
    'Logistic',
    'LogisticSpider',
    'Mandelbrot',
    'MandelbrotMini',
    'MandelbrotSpectrum',
    'MandelbrotMiniSpectrum',
    'Triangles',
    'Sierpinski',
    'SierpinskiDots',
    'IFSBackground',
    'SierpinskiColour',
    'SierpinskiIFS',
    'BarnsleyIFS',
    'BarnsleyColour',
    'TreeIFS',
    'DragonIFS',
    'DragonColour'
  ]),
  group(8, 'Waves and Quantum Mechanics', [
    'Interference',
    'WaveSuperposer',
    'TwoSlits'
  ]),
  group(9, 'Games and Computer Science', [
    'KnightsTour',
    'Nim',
    'NoughtsAndCrosses'
  ]),
  group(10, 'Philosophy and Social Science', [
    'Schelling',
    'IteratedPD'
  ])
]

export const names = {
  AimCannon: 'Firing a cannon (manual)',
  AskInput: 'Asking for typed input',
  AutoCannon: 'Firing a cannon (automatic)',
  Automata: 'One-dimensional cellular automata',
  Balls3D: '3D colour effects',
  BarnsleyColour: 'Barnsley colour',
  BarnsleyIFS: 'Barnsley IFS',
  BouncingBall: 'Bouncing ball (using variables)',
  BrownianMotion: 'Brownian motion',
  Cheetahs: 'Cheetahs and gazelles',
  Circles: 'Circling circles',
  Clock: 'Analogue clock (using REPEAT)',
  ColourSpiral: 'Spiral of colours',
  CycleColours: 'Cycling colours (using MOD)',
  Diffusion: 'A model of diffusion',
  DigitalClock: 'Digital clock (using IF and WHILE)',
  Disease: 'Spread of disease',
  DragonColour: 'Dragon colour',
  DragonIFS: 'Dragon IFS',
  DrawPause: 'Simple drawing with pauses',
  FiveTurtles: 'Five turtles moving to the mouse',
  Flashlights: 'Using Booleans',
  Flocking: 'Flocking behaviour',
  ForLoop: 'FOR (counting) loop',
  GameOfLife: 'Conway\'s Game of Life',
  GravitySteps: 'Movement under gravity',
  IFSBackground: 'Iterated function systems (IFS) background',
  Interference: 'Interference',
  IteratedPD: 'Iterated Prisoner\'s Dilemma',
  KnightsTour: 'Knight\'s tour',
  Launch: 'Launching a rocket into orbit',
  LifeStart: 'Initialising Conway\'s Game of Life',
  Logistic: 'Logistic equation',
  LogisticSpider: 'Logistic spider',
  Mandelbrot: 'Mandelbrot set',
  MandelbrotMini: 'Mandelbrot mini',
  MandelbrotMiniSpectrum: 'Mandelbrot mini spectrum',
  MandelbrotSpectrum: 'Mandelbrot spectrum',
  MathFunctions: 'Mathematical functions',
  MovingBall: 'Moving ball (using variables)',
  MultiBounce: 'Multiple bouncing balls',
  NestedLoops: 'Nested FOR loops',
  Nim: 'Nim',
  NoughtsAndCrosses: 'Noughts and crosses',
  OlympicRings1: 'Olympic rings 1 (using PENUP)',
  OlympicRings2: 'Olympic rings 2 (with variable)',
  PaintApp: 'Painting application',
  ParameterProcedure: 'Procedure with parameter',
  PolygonRings: 'Polygon rings',
  Polygons: 'POLYGON and POLYLINE',
  Quine: 'Quine (self-replicating) program',
  RefParams: 'Reference parameters',
  Schelling: 'Schelling\'s segregation model',
  SexRatio: 'The sex ratio',
  Shoot: 'Arcade shooting game',
  Sierpinski: 'Sierpinski triangle',
  SierpinskiColour: 'Sierpinski colour',
  SierpinskiDots: 'Sierpinski dots',
  SierpinskiIFS: 'Sierpinski IFS',
  SimpleDraw: 'Drawing to the mouse',
  SimpleProcedure: 'Simple procedure',
  SnakeGame: 'Snake (classic game)',
  SolarSystem: 'Solar system (using ARRAY)',
  Stars: 'Stars (using ANGLES and FORGET)',
  StringFunctions: 'String functions',
  ThePlough: 'The plough constellation',
  TreeIFS: 'Tree IFS',
  Triangles: 'Recursive triangles',
  TrigonometricGraphs: 'Trigonometric graphs',
  TurtleBounce: 'Bouncing ball (using the Turtle)',
  TurtleMove: 'Moving ball (using the Turtle)',
  TwoSlits: 'Young\'s two-slit experiment',
  WaveSuperposer: 'Wave superposer',
  YouAreHere: 'Text and arrow (using PRINT)'
}
