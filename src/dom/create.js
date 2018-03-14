/**
 * create a pre-filled html element
 */
const create = (type, options = {}) => {
  const element = document.createElement(type);
  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'classes':
        options.classes.forEach(x => element.classList.add(x));
        break;
      case 'content':
        if (typeof options.content === 'string') {
          element.innerHTML = options.content;
        } else {
          options.content.forEach(child => element.appendChild(child));
        }
        break;
      case 'value':
        element.value = options[key];
        break;
      case 'on':
        options.on.forEach(e => element.addEventListener(e.type, e.callback));
        break;
      default:
        element.setAttribute(key, options[key]);
        break;
    }
  });
  return element;
};

module.exports = create;
