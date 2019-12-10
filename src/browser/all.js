/*
Setup the page with everything (browser).
*/
import about from './about'
import help from './help'
import system from './system'
import * as dom from 'common/components/dom'

// setup the system page
export default (tse) => {
  const systemDiv = document.createElement('div')
  const helpDiv = document.createElement('div')
  const aboutDiv = document.createElement('div')
  const tabs = dom.createTopTabs([
    { label: 'Program', active: true, content: [systemDiv] },
    { label: 'Help', active: false, content: [helpDiv] },
    { label: 'About', active: false, content: [aboutDiv] }
  ])
  const tabList = tabs.querySelector('nav')
  const image = document.createElement('img')
  image.src = 'turtle.png'
  tabList.prepend(image)
  system(systemDiv)
  help(helpDiv, false)
  about(aboutDiv, false)
  tse.classList.add('tse-all')
  dom.setContent(tse, [tabs])
}
