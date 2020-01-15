/*
The machine canvas component.
*/
// import { send, on } from 'common/system/state'

// the canvas element
const element = document.createElement('div')
export default element

// initialise the element
element.classList.add('tse-canvas')
element.innerHTML = `
  <div class="tse-canvas-left">
    <div></div>
    <div class="tse-canvas-coords">
      <span>0</span>
      <span>250</span>
      <span>500</span>
      <span>750</span>
      <span>999</span>
    </div>
  </div>
  <div class="tse-canvas-right">
    <div class="tse-canvas-coords">
      <span>0</span>
      <span>250</span>
      <span>500</span>
      <span>750</span>
      <span>999</span>
    </div>
    <div class="tse-canvas-wrapper">
      <canvas width="1000" height="1000"></canvas>
    </div>
  </div>`
