import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

iziToast.settings({
  position: "topRight",
  timeout: 3000,
  resetOnHover: true,
  transitionIn: "flipInX",
  transitionOut: "flipOutX"
});

let isShown = false;
const form = document.querySelector(".form");

form.addEventListener("submit", promiseGenerator);

function promiseGenerator(e) {
  e.preventDefault();
  const delay = form.elements.delay.value;
  const state = form.elements.state.value;
  // form reset with delay
  if (!isShown) {
    isShown = true;
    iziToast.info({message: "Form will reset in 10 sec"});
    setTimeout(() => {
      iziToast.info({message: "Form reset..."});
      form.reset();
      isShown = false;
    }, 10000);
  }

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      }
      reject(delay);
    }, delay);
  })
    .then(value => iziToast.success({message: `Fulfilled promise in ${value}ms`}))
    .catch(error => iziToast.error({message: `Rejected promise in ${error}ms`}));
}