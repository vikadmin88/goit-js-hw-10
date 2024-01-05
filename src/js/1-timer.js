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

let selectedTime;
const inputField = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");

startBtn.addEventListener("click", (e) => {
  timer.start(selectedTime);
  switchBtn("On");
});


function switchBtn(switcher = "Off") {
  let isBtnDisabled = startBtn.classList.contains("btn-disabled");
  if (switcher === "On" && isBtnDisabled) {
    startBtn.classList.remove("btn-disabled");
    inputField.classList.remove("input-disabled");
  } else if (!isBtnDisabled) {
    startBtn.classList.add("btn-disabled");
    inputField.classList.add("input-disabled");
  }
}

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
      selectedTime = stampSel;
      switchBtn("On");
      iziToast.success({message: "You have selected a correct date in the future!"});

    } else {
      timer.stop();
      this.setDate(dtNow);
      switchBtn("Off");
      iziToast.error({message: "Please choose a date in the future!"});
    }
  },
});


const timer = {
  intervalId: null,
  intervalMs: 1000,
  dtObj: {},
  selectedTime: 0,
  pageElems: {},

  init(pageElemsObj, finishFnc = null) {
    this.pageElems = pageElemsObj;
    if (finishFnc) {
      this.finishFnc = finishFnc;
    }
  },

  start(selectedTime) {
    if (this.intervalId) {
      iziToast.info({message: "Timer in progress! To restart, refresh this page."});
      return;
    }
    this.selectedTime = selectedTime;
    const timeDelta = selectedTime - Date.now();
    if (timeDelta <= 0) {
      iziToast.error({message: "Please choose a date in the future!"});
      return;
    }
    this.dtObj = this.millisToObj(timeDelta);
    Object.keys(this.dtObj).forEach(it => {
        this.pageElems[it].textContent = this.dtObj[it].toString().padStart(2, "0");
    });
    this.intervalId = setInterval(() => this.updValues(), this.intervalMs);
  },

  updValues() {
    const timeDelta = this.selectedTime - Date.now();
    if (timeDelta <= 0) {
      this.stop();
      this.finishFnc();
      return;
    }

    const newTimeObj = this.millisToObj(timeDelta);
    Object.keys(this.dtObj).forEach(it => {
      if (this.dtObj[it] != newTimeObj[it]) {
        this.dtObj[it] = newTimeObj[it];
        this.pageElems[it].textContent = newTimeObj[it].toString().padStart(2, "0");
      }
    });
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
    }
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

  finishFnc: () => {
    iziToast.success({message: "FINISH: Object INTERNAL function invoked!"});
  },
}

const pageElemsObj = {
  days: document.querySelector("span[data-days]"),
  hours: document.querySelector("span[data-hours]"),
  minutes: document.querySelector("span[data-minutes]"),
  seconds: document.querySelector("span[data-seconds]")
};

timer.init(pageElemsObj, timerFinishExtFnc);
// as a variant: can invoke internal "finish" function of obj timer
// timer.init(pageElemsObj);

function timerFinishExtFnc(){
  iziToast.success({message: "FINISH: EXTERNAL function invoked!"});
}



