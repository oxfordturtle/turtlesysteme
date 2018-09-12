/**
 * create a pre-filled HTML element, with options for content and attributes
 */

// an HTML element
const element = (type, options = {}) => {
  // create the element
  const el = document.createElement(type);
  // iterate over the options adding content/attributes
  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'classes':
        options.classes.forEach(x => el.classList.add(x));
        break;
      case 'content':
        if (typeof options.content === 'string') {
          el.innerHTML = options.content;
        } else {
          options.content.forEach(child => el.appendChild(child));
        }
        break;
      case 'value':
        el.value = options.value;
        break;
      case 'on':
        options.on.forEach(e => el.addEventListener(e.type, e.callback));
        break;
      default:
        el.setAttribute(key, options[key]);
        break;
    }
  });
  return el;
};

// export the function
module.exports = element;
