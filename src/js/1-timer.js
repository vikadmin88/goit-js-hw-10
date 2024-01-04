import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

iziToast.settings({
  position: "topRight",
  timeout: 4000,
  resetOnHover: true,
  transitionIn: "flipInX",
  transitionOut: "flipOutX"
});

const inputField = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");
startBtn.addEventListener("click", (e) => {
  timer.start(selectedTime);
  if (!startBtn.classList.contains("btn-disabled")) {
    startBtn.classList.add("btn-disabled");
    inputField.classList.add("input-disabled");
  }
});

let selectedTime;

flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  dateFormat: "Y-m-d H:i",
  minuteIncrement: 1,
  onClose(selectedDates) {
    const dtNow = new Date();
    const stampNow = dtNow.setSeconds(0,0);
    const stampSel = Date.parse(selectedDates[0]);

    if (stampNow < stampSel) {
      iziToast.success({message: "You have selected a correct date in the future!"});
      selectedTime = stampSel;

      if (startBtn.classList.contains("btn-disabled")) {
        startBtn.classList.remove("btn-disabled");
        inputField.classList.remove("input-disabled");
      }

    } else {
      timer.stop();
      this.setDate(dtNow);
      iziToast.error({message: "Please choose a date in the future!"});

      if (!startBtn.classList.contains("btn-disabled")) {
        startBtn.classList.add("btn-disabled");
        inputField.classList.add("input-disabled");
      }
    }
  },
});


const timer = {
  intervalId: null,
  intervalMs: 1000,
  timeObj: {},
  selectedTime: 0,
  valuesElem: {},

  init(valElemsObj, finishFn = null) {
    this.valuesElem = valElemsObj;
    if (finishFn) {
      this.finishFn = finishFn;
    }
  },

  start(selectedTime) {
    if (this.intervalId) {
      iziToast.info({message: "Timer in progress! To restart refresh this page."});
      return;
    }
    this.selectedTime = selectedTime;
    const timeDelta = selectedTime - Date.now();
    if (timeDelta <= 0) {
      iziToast.error({message: "Please choose a date in the future!"});
      return;
    }
    this.timeObj = this.millisToObj(timeDelta);
    Object.keys(this.timeObj).forEach(it => {
        this.valuesElem[it].textContent = this.timeObj[it].toString().padStart(2, "0");
    });
    this.intervalId = setInterval(() => this.updateValuesElem(), this.intervalMs);
  },

  updateValuesElem() {
    const timeDelta = this.selectedTime - Date.now();
    if (timeDelta <= 0) {
      this.stop();
      this.finishFn();
      return;
    }

    const newTimeObj = this.millisToObj(timeDelta);
    Object.keys(this.timeObj).forEach(it => {
      if (this.timeObj[it] != newTimeObj[it]) {
        this.timeObj[it] = newTimeObj[it];
        this.valuesElem[it].textContent = newTimeObj[it].toString().padStart(2, "0");
      }
    });
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
    }
  },

  finishFn: () => {
    iziToast.success({message: "FINISH: INTERNAL function call!"});
  },

  millisToObj(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
  },
}

const valElemsObj = {};
valElemsObj.days = document.querySelector("span[data-days]");
valElemsObj.hours = document.querySelector("span[data-hours]");
valElemsObj.minutes = document.querySelector("span[data-minutes]");
valElemsObj.seconds = document.querySelector("span[data-seconds]");

timer.init(valElemsObj,timerFinishExtFn);

function timerFinishExtFn(){
  iziToast.success({message: "FINISH: EXTERNAL function call!"});
}



