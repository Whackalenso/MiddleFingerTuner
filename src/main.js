import Tuner from "./tuner.js";

const inTuneRange = 20;

const tuner = new Tuner(440);
var frequencyData = null;

const timeToDetect = 500;
var resetTimeout = null;
var lastNotes = [null, null];

function updateHand(cents) {
  // Get Frame
  let frame = 0;
  if (cents != null) {
    frame = Math.round(
      (Math.min(Math.abs(cents), inTuneRange) * (60 - 1)) / inTuneRange + 1
    );
  }

  let hand = document.querySelector(".hand");

  hand.src = "./frames/00" + (frame < 10 ? "0" : "") + frame + ".png";

  let rotation = (Math.max(0, frame - 1) / 59) * 90;
  rotation *= cents > 0 ? -1 : 1;

  let vertOffset = cents;
  if (vertOffset > 0) {
    vertOffset = 0;
  }
  if (vertOffset < -1 * inTuneRange) {
    vertOffset = -1 * inTuneRange;
  }
  vertOffset *= 5;

  hand.style.transform = `translateY(${vertOffset}px) rotate(${Math.floor(
    rotation
  )}deg)`;
}

function updateCentsIndicator(cents) {
  let centsIndicator = document.querySelector(".cents");

  if (cents) {
    centsIndicator.innerHTML = (cents > 0 ? "+" : "") + cents;
    // centsIndicator.style.translate = `0 ${-cents}px`;
  } else {
    centsIndicator.innerHTML = "";
    // centsIndicator.style.translate = "0 0";
  }
}

function updateNoteIndicator(note) {
  let noteLetter = document.querySelector(".note-letter");
  let noteAccidental = document.querySelector(".note-accidental");
  let noteOctave = document.querySelector(".note-octave");

  if (note) {
    noteLetter.innerHTML = note.name[0];
    noteAccidental.innerHTML = note.name.charAt(1);
    noteOctave.innerHTML = note.octave;
  } else {
    noteLetter.innerHTML = "";
    noteAccidental.innerHTML = "";
    noteOctave.innerHTML = "";
  }
}

tuner.onNoteDetected = (note) => {
  // function handleSlider(note) {
  // console.log(confidence);
  // if (note.confidence < 0.4) {
  //   return;
  // }
  if (lastNotes.some((n) => n !== note.name)) {
    // makes sure note is stable before updating
    lastNotes.push(note.name);
    lastNotes.shift();
    return;
  }

  updateHand(note.cents);
  updateCentsIndicator(note.cents);
  updateNoteIndicator(note);

  if (resetTimeout) {
    clearTimeout(resetTimeout);
  }
  resetTimeout = setTimeout(() => {
    // updateHand(null);
    // updateCentsIndicator(null);
    // updateNoteIndicator(null);
  }, timeToDetect);
};

function onClick() {
  let hand = document.querySelector(".hand");
  if (hand.classList.contains("hidden")) {
    tuner.init(() => {
      document.querySelector(".allow-access").remove();
      hand.classList.remove("hidden");
    });
    frequencyData = new Uint8Array(tuner.analyser.frequencyBinCount);
  }
}

document.body.addEventListener("click", onClick);
// document.querySelector(".test-slider").oninput = function () {
//   handleSlider({ name: "A#", value: 1, cents: this.value, octave: 1 });
//   console.log("asdf");
// };
