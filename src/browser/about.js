/*
Setup the about page (browser).
*/
import { create } from 'common/components/tabs'
import canvas from 'common/components/about/canvas'
import system from 'common/components/about/system'
import { languageSelect } from 'common/components/program/file'

// setup the about page
export default (tsx) => {
  tsx.classList.add('tsx-help')
  tsx.appendChild(language)
  tsx.appendChild(about)
}

const language = document.createElement('div')
language.classList.add('tsx-controls')
language.appendChild(languageSelect)

const about = create('tsx-system-tabs', [
  { label: 'System', active: true, content: [system] },
  { label: 'Canvas', active: false, content: [canvas] }
])
