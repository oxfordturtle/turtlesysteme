import FibonaccisB from './BASIC/Fibonaccis.json'
import FibonaccisP from './Pascal/Fibonaccis.json'
import MultiBounceB from './BASIC/MultiBounce.json'
import MultiBounceP from './Pascal/MultiBounce.json'
import BouncingShapesB from './BASIC/BouncingShapes.json'
import BouncingShapesP from './Pascal/BouncingShapes.json'
import SolarSystemB from './BASIC/SolarSystem.json'
import SolarSystemP from './Pascal/SolarSystem.json'
import TypingTestB from './BASIC/TypingTest.json'
import TypingTestP from './Pascal/TypingTest.json'
import TypingTestKeysB from './BASIC/TypingTestKeys.json'
import TypingTestKeysP from './Pascal/TypingTestKeys.json'

export default {
  Fibonaccis: { BASIC: FibonaccisB, Pascal: FibonaccisP },
  MultiBounce: { BASIC: MultiBounceB, Pascal: MultiBounceP },
  BouncingShapes: { BASIC: BouncingShapesB, Pascal: BouncingShapesP },
  SolarSystem: { BASIC: SolarSystemB, Pascal: SolarSystemP },
  TypingTest: { BASIC: TypingTestB, Pascal: TypingTestP },
  TypingTestKeys: { BASIC: TypingTestKeysB, Pascal: TypingTestKeysP }
}
