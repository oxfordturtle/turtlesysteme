/*
Example programs.
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
  // examples 1
  DrawPause: 'Simple drawing with pauses',
  SmileyFace: 'Smily face (using PENUP and ELLBLOT)',
  ThePlough: 'The plough (using SETXY and POLYLINE)',
  OlympicRings: 'Olympic rings (using variable)',
  ForLoop: 'FOR (counting) loop',
  TriangleSpin: 'Spinning triangle pattern',
  Circles: 'Circling circles',
  NestedLoops: 'Nested FOR loops',
  RandomLines: 'Random lines pattern',
  RandomEllipses: 'Random ellipses pattern',
  ColourSpiral: 'Spiral of colours (simple PCODE)',
  // examples 2
  SimpleProc: 'Simple procedure',
  ParameterProc: 'Procedure with parameter',
  ResizableFace: 'Resizable face (nested procedures)',
  Polygons: 'Polygons (two parameters)',
  Stars: 'Stars (using ANGLES and FORGET)',
  PolygonRings: 'Polygon rings (three parameters)',
  Triangle1: 'Simple triangle',
  Triangle2: 'Triangle procedure',
  Triangle3: 'Triangle procedure with limit',
  Triangles: 'Recursive triangles',
  Factorials: 'Recursive factorials',
  Fibonaccis: 'Fibonaccis (using ARRAY and TIME)',
  // examples 3
  YouAreHere: 'Text and arrow (using PRINT)',
  CycleColours: 'Cycling colours (using MOD)',
  Clock: 'Analogue clock (using REPEAT)',
  DigitalClock: 'Digital clock (using IF and WHILE)',
  Flashlights: 'Flashlights (using Booleans)',
  RefParams: 'Reference parameters (using VAR)',
  Balls3D: '3D colour effects',
  StringFunctions: 'String functions',
  MathFunctions: 'Mathematical functions',
  TrigGraphs: 'Trigonometric graphs',
  // examples 4
  MovingBall: 'Moving ball (using variables)',
  BouncingBall: 'Bouncing ball (using variables)',
  TurtleMove: 'Moving ball (using Turtle)',
  TurtleBounce: 'Bouncing ball (using Turtle)',
  BouncingFace: 'Bouncing face',
  MultiBounce: 'Multiple bouncing balls',
  BouncingTriangle: 'Bouncing triangle',
  BouncingShapes: 'Multiple bouncing shapes',
  GravitySteps: 'Movement under gravity',
  SolarSystem: 'Solar system',
  // examples 5
  AskInput: 'Asking for typed input',
  QuickClick: 'Mouse reaction game',
  TypingTest: 'Typing test (checking characters)',
  TypingTestKeys: 'Typing test (checking keys)',
  SpongeThrow: 'Throwing sponges at a moving face',
  Arcade: 'Arcade shooting game',
  SnakeGame: 'Snake (classic game)',
  NoughtsAndCrosses: 'Noughts and crosses',
  SimpleDraw: 'Drawing to the mouse',
  PaintApp: 'Painting application',
  FiveTurtles: 'Five turtles moving to the mouse',
  // examples 6
  AimCannon: 'Firing a cannon (manual)',
  AutoCannon: 'Firing a cannon (automatic)',
  Launch: 'Launching a rocket into orbit',
  Disease: 'Spread of disease',
  GameOfLife: 'Conway’s Game of Life',
  Automata: 'One-dimensional cellular automata',
  BrownianMotion: 'Brownian motion',
  Dendrites: 'Dendritic crystal growth',
  Cheetahs: 'Cheetahs and gazelles',
  SexRatio: 'The sex ratio',
  Flocking: 'Flocking behaviour',
  Schelling: 'Schelling’s segregation model',
  IteratedPD: 'Iterated Prisoner’s Dilemma',
  // examples 7
  RecursionFactory: 'Recursion factory',
  RecursiveTree: 'Recursive tree',
  KochSnowflake: 'Koch snowflake',
  SquareKoch: 'Square Koch fractal curves',
  Sierpinski: 'Sierpinski triangle (by deletion)',
  SierpinskiDots: 'Sierpinski triangle (by random dots)',
  IFSBackground: 'Iterated function systems (IFS) background',
  IFSColour: 'IFS mappings on coloured background',
  IFSDemonstrator: 'IFS demonstrator program',
  Logistic: 'Logistic equation',
  LogisticSpider: 'Logistic spider',
  MandelbrotDemo: 'Mandelbrot multi-colour',
  MandelbrotSpectrumDemo: 'Mandelbrot spectral colours',
  // other CSAC examples not in the system menu
  LifeStart: 'Initialising Conway’s Game of Life',
  Diffusion: 'A model of diffusion',
  Mandelbrot: 'Mandelbrot set',
  MandelbrotMini: 'Mandelbrot mini',
  MandelbrotSpectrum: 'Mandelbrot spectrum',
  MandelbrotMiniSpectrum: 'Mandelbrot mini spectrum',
  SierpinskiColour: 'Sierpinski colour',
  SierpinskiIFS: 'Sierpinski IFS',
  BarnsleyColour: 'Barnsley colour',
  BarnsleyIFS: 'Barnsley IFS',
  DragonColour: 'Dragon colour',
  DragonIFS: 'Dragon IFS',
  TreeIFS: 'Tree IFS',
  Interference: 'Interference',
  WaveSuperposer: 'Wave superposer',
  TwoSlits: 'Young’s two-slit experiment',
  KnightsTour: 'Knight’s tour',
  Nim: 'Nim'
}

// array of menu items
export const menu = [
  {
    index: 1,
    title: 'drawing and counting loops',
    examples: [
      'DrawPause',
      'SmileyFace',
      'ThePlough',
      'OlympicRings',
      'ForLoop',
      'TriangleSpin',
      'Circles',
      'NestedLoops',
      'RandomLines',
      'RandomEllipses',
      'ColourSpiral'
    ]
  },
  {
    index: 2,
    title: 'procedures and simple recursion',
    examples: [
      'SimpleProc',
      'ParameterProc',
      'ResizableFace',
      'Polygons',
      'Stars',
      'PolygonRings',
      'Triangle1',
      'Triangle2',
      'Triangle3',
      'Triangles',
      'Factorials',
      'Fibonaccis'
    ]
  },
  {
    index: 3,
    title: 'further commands and structures',
    examples: [
      'YouAreHere',
      'CycleColours',
      'Clock',
      'DigitalClock',
      'Flashlights',
      'RefParams',
      'Balls3D',
      'StringFunctions',
      'MathFunctions',
      'TrigGraphs'
    ]
  },
  {
    index: 4,
    title: 'smooth movement and bouncing',
    examples: [
      'MovingBall',
      'BouncingBall',
      'TurtleMove',
      'TurtleBounce',
      'BouncingFace',
      'MultiBounce',
      'BouncingTriangle',
      'BouncingShapes',
      'GravitySteps',
      'SolarSystem'
    ]
  },
  {
    index: 5,
    title: 'user input and interaction',
    examples: [
      'AskInput',
      'QuickClick',
      'TypingTest',
      'TypingTestKeys',
      'SpongeThrow',
      'Arcade',
      'SnakeGame',
      'NoughtsAndCrosses',
      'SimpleDraw',
      'PaintApp',
      'FiveTurtles'
    ]
  },
  {
    index: 6,
    title: 'interdisciplinary models',
    examples: [
      'AimCannon',
      'AutoCannon',
      'Launch',
      'Disease',
      'GameOfLife',
      'Automata',
      'BrownianMotion',
      'Dendrites',
      'Cheetahs',
      'SexRatio',
      'Flocking',
      'Schelling',
      'IteratedPD'
    ]
  },
  {
    index: 7,
    title: 'self-similarity and chaos',
    examples: [
      'RecursionFactory',
      'RecursiveTree',
      'KochSnowflake',
      'SquareKoch',
      'Sierpinski',
      'SierpinskiDots',
      'IFSBackground',
      'IFSColour',
      'IFSDemonstrator',
      'Logistic',
      'LogisticSpider',
      'MandelbrotDemo',
      'MandelbrotSpectrumDemo'
    ]
  }
]
