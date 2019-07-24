/*
Setup the settings page (Electron).
*/
import * as settings from 'common/components/machine/settings'

// setup the settings page
export default (tse) => {
  tse.classList.add('tse-settings')
  tse.appendChild(settings.buttons)
  tse.appendChild(settings.drawCountMax)
  tse.appendChild(settings.codeCountMax)
  tse.appendChild(settings.smallSize)
  tse.appendChild(settings.stackSize)
}
