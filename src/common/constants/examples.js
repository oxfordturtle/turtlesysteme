/*
Example programs: their code, their names, and their groups (for the example menus).
*/
import BASIC from './code/basic'
import Pascal from './code/pascal'
import Python from './code/python'

// code for the example programs
export const code = {
  BASIC,
  Pascal,
  Python
}

// names for the example programs
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

// help example groups
export const help = [
  {
    index: 1,
    title: 'Drawing, counting, and procedures/methods',
    examples: [
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
    ]
  },
  {
    index: 2,
    title: 'Further commands and structures',
    examples: [
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
    ]
  },
  {
    index: 3,
    title: 'Smooth movement and interaction',
    examples: [
      'MovingBall',
      'BouncingBall',
      'TurtleMove',
      'TurtleBounce',
      'MultiBounce',
      'GravitySteps',
      'SolarSystem',
      'SimpleDraw',
      'FiveTurtles'
    ]
  },
  {
    index: 4,
    title: 'Complex applications',
    examples: [
      'PaintApp',
      'SnakeGame',
      'Shoot',
      'Mandelbrot',
      'Quine',
      'NoughtsAndCrosses'
    ]
  },
  {
    index: 5,
    title: 'Artificial life and social models',
    examples: [
      'GameOfLife',
      'Schelling',
      'IteratedPD'
    ]
  }
]

// csac book examples
export const csac = [
  {
    index: 1,
    title: 'Introduction, Computer Science for Fun, and Turtling',
    examples: [
      'DrawPause',
      'ColourSpiral'
    ]
  },
  {
    index: 2,
    title: 'Animation and Movement',
    examples: [
      'MovingBall',
      'BouncingBall',
      'TurtleMove',
      'TurtleBounce',
      'AskInput'
    ]
  },
  {
    index: 3,
    title: 'Computing in Physics: Cannons and Rockets',
    examples: [
      'GravitySteps',
      'AimCannon',
      'AutoCannon',
      'Launch'
    ]
  },
  {
    index: 4,
    title: 'Cellular Automata: Modelling Disease, \'Life\', and Shell Patterns',
    examples: [
      'LifeStart',
      'Disease',
      'GameOfLife',
      'Automata'
    ]
  },
  {
    index: 5,
    title: 'Computing in Chemistry: Diffusion and Brownian Motion',
    examples: [
      'Diffusion',
      'BrownianMotion'
    ]
  },
  {
    index: 6,
    title: 'Computing in Biology: Evolution and Behaviour',
    examples: [
      'Cheetahs',
      'SexRatio',
      'Flocking'
    ]
  },
  {
    index: 7,
    title: 'Chaos and Self-Similarity',
    examples: [
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
    ]
  },
  {
    index: 8,
    title: 'Waves and Quantum Mechanics',
    examples: [
      'Interference',
      'WaveSuperposer',
      'TwoSlits'
    ]
  },
  {
    index: 9,
    title: 'Games and Computer Science',
    examples: [
      'KnightsTour',
      'Nim',
      'NoughtsAndCrosses'
    ]
  },
  {
    index: 10,
    title: 'Philosophy and Social Science',
    examples: [
      'Schelling',
      'IteratedPD'
    ]
  }
]
