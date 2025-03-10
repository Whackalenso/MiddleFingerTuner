inTuneRange = 30;

tuner = new Tuner(440);
frequencyData = null;

timeToDetect = 500;
resetTimeout = null;
lastNotes = [null, null];

function updateHand(cents) {
  // Get Frame
  frame = 0;
  if (cents != null) {
    frame = Math.round(
      (Math.min(Math.abs(cents), inTuneRange) * (60 - 1)) / inTuneRange + 1
    );
  }

  hand = document.querySelector(".hand");

  hand.src = "./frames/00" + (frame < 10 ? "0" : "") + frame + ".png";

  rotation = (Math.max(0, frame - 1) / 59) * 90;
  rotation *= cents > 0 ? -1 : 1;
  hand.style.transform = `rotate(${Math.floor(rotation)}deg)`;
}

function updateCentsIndicator(cents) {
  centsIndicator = document.querySelector(".cents");

  if (cents) {
    centsIndicator.innerHTML = (cents > 0 ? "+" : "") + cents;
    // centsIndicator.style.translate = `0 ${-cents}px`;
  } else {
    centsIndicator.innerHTML = "";
    // centsIndicator.style.translate = "0 0";
  }
}

tuner.onNoteDetected = (note) => {
  // function handleSlider(cents) {
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

  if (resetTimeout) {
    clearTimeout(resetTimeout);
  }
  resetTimeout = setTimeout(() => {
    updateHand(null);
    updateCentsIndicator(null);
  }, timeToDetect);
};

function onClick() {
  hand = document.querySelector(".hand");
  if (hand.classList.contains("hidden")) {
    tuner.init(() => {
      document.querySelector(".allow-access").remove();
      hand.classList.remove("hidden");
    });
    frequencyData = new Uint8Array(tuner.analyser.frequencyBinCount);
  }
}
