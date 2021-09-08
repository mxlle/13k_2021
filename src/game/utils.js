export function addCanvasToBody() {
  document.body.appendChild(createElement({ tag: 'canvas' }));
}

export function createElement({ tag, cssClass, text, onClick }) {
  const elem = document.createElement(tag || 'div');
  if (cssClass) elem.classList.add(cssClass);
  if (text) {
    const textNode = document.createTextNode(text);
    elem.appendChild(textNode);
  }
  if (onClick) {
    elem.addEventListener('click', onClick);
  }
  return elem;
}

export function addBodyClasses(...classes) {
  document.body.classList.add(...classes);
}

export function removeBodyClasses(...classes) {
  document.body.classList.remove(...classes);
}

export function getStoredNumber(id) {
  const num = Number(localStorage.getItem(id));
  return isNaN(num) ? 0 : num;
}

export function storeNumber(id, num) {
  localStorage.setItem(id, `${num}`);
}

export function getWidthHeightScale() {
  const BASE_RESOLUTION = 1500 * 1000;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const resolution = width * height;
  // adapt object size based on screen size
  const scale = Math.sqrt(resolution) / Math.sqrt(BASE_RESOLUTION);
  return { width, height, scale };
}
