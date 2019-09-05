import * as examples from 'common/constants/examples'

export default (tse) => {
  const language = tse.dataset.language
  const pre = document.createElement('pre')
  examples.menu.forEach((set) => {
    set.examples.forEach((id) => {
      pre.innerHTML += examples.code[language][id]
      pre.innerHTML += '\n\n'
    })
  })
  tse.appendChild(pre)
}
