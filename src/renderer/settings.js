/*
Setup the settings page (Electron).
*/
import * as dom from 'common/components/dom'
import * as settings from 'common/components/machine/settings'

// setup the settings page
export default (tse) => {
  tse.classList.add('tse-settings')
  dom.setContent(tse, [
    settings.buttons,
    settings.drawCountMax,
    settings.codeCountMax,
    settings.smallSize,
    settings.stackSize
  ])
}
