/*
The machine canvas component.
*/
// import { send, on } from 'common/system/state'

// the canvas element
const element = document.createElement('div')
export default element

// initialise the element
element.classList.add('tsx-canvas')
element.innerHTML = `
  <div class="tsx-canvas-left">
    <div></div>
    <div class="tsx-canvas-coords">
      <span>0</span>
      <span>250</span>
      <span>500</span>
      <span>750</span>
      <span>999</span>
    </div>
  </div>
  <div class="tsx-canvas-right">
    <div class="tsx-canvas-coords">
      <span>0</span>
      <span>250</span>
      <span>500</span>
      <span>750</span>
      <span>999</span>
    </div>
    <div class="tsx-canvas-wrapper">
      <canvas></canvas>
    </div>
  </div>`
