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
