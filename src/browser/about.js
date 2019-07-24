/*
Setup the about page (browser).
*/
import { create } from 'common/components/tabs'
import canvas from 'common/components/about/canvas'
import system from 'common/components/about/system'

// setup the about page
export default (tsx) => {
  tsx.classList.add('tsx-help')
  tsx.appendChild(about)
}

const about = create([
  { label: 'System', active: true, content: [system] },
  { label: 'Canvas', active: false, content: [canvas] }
])
