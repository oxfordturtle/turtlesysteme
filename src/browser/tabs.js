/*
Setup the system page (browser).
*/
import * as dom from 'common/components/dom'

// setup the system page
export default (programDiv, machineDiv, helpDiv, aboutDiv) => {
  // collect the tab pane divs
  const tabPanes = [programDiv, machineDiv, helpDiv, aboutDiv]

  // create the tabs
  const systemTab = dom.createElement('a', 'tse-browser-tab', 'System')
  const programTab = dom.createElement('a', 'tse-browser-tab', 'Program')
  const machineTab = dom.createElement('a', 'tse-browser-tab', 'Machine')
  const helpTab = dom.createElement('a', 'tse-browser-tab', 'Help')
  const aboutTab = dom.createElement('a', 'tse-browser-tab', 'About')
  const tabs = [systemTab, programTab, machineTab, helpTab, aboutTab]

  // create the tabs div
  const content = [
    dom.createImage('turtle.png'),
    systemTab,
    programTab,
    machineTab,
    helpTab,
    aboutTab
  ]
  const tabsDiv = dom.createElement('div', 'tse-browser-tab-list', content)

  // add tabbing event listeners
  const switchTabs = (tabToActivate, tabPanesToActivate) => {
    tabs.forEach((x) => { x.classList.remove('tse-active') })
    tabPanes.forEach((x) => { x.classList.remove('tse-active') })
    tabToActivate.classList.add('tse-active')
    tabPanesToActivate.forEach((x) => { x.classList.add('tse-active') })
    programDiv.classList.remove('tse-side-by-side')
    machineDiv.classList.remove('tse-side-by-side')
  }
  systemTab.addEventListener('click', (e) => {
    switchTabs(systemTab, [programDiv, machineDiv])
    programDiv.classList.add('tse-side-by-side')
    machineDiv.classList.add('tse-side-by-side')
  })
  programTab.addEventListener('click', (e) => {
    switchTabs(programTab, [programDiv])
  })
  machineTab.addEventListener('click', (e) => {
    switchTabs(machineTab, [machineDiv])
  })
  helpTab.addEventListener('click', (e) => {
    switchTabs(helpTab, [helpDiv])
  })
  aboutTab.addEventListener('click', (e) => {
    switchTabs(aboutTab, [aboutDiv])
  })

  // activate either system or program tab, depending on screen size
  if (window.innerWidth < 1024) {
    programTab.click()
  } else {
    systemTab.click()
  }
  window.addEventListener('resize', (e) => {
    if (window.innerWidth < 1024) {
      if (systemTab.classList.contains('tse-active')) {
        programTab.click()
      }
    } else {
      if (programTab.classList.contains('tse-active') || machineTab.classList.contains('tse-active')) {
        systemTab.click()
      }
    }
  })

  // return the tabsDiv
  return tabsDiv
}
