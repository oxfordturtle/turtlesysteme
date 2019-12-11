/*
Setup the about page (browser).
*/
import * as dom from 'common/components/dom'
import canvas from 'common/components/about/canvas'
import system from 'common/components/about/system'

// setup the about page
export default () => {
  const content = [
    dom.createTabs([
      { label: 'System', active: true, content: [system] },
      { label: 'Canvas API', active: false, content: [canvas] }
    ])
  ]
  const aboutDiv = dom.createElement('div', 'tse-browser-tab-pane', content)
  aboutDiv.classList.add('tse-help')
  return aboutDiv
}
