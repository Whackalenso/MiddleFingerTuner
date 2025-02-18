inTuneRange = 10;

tuner = new Tuner(440);
frequencyData = null;

timeToDetect = 100;
resetTimeout = null;

function getFrame(cents) {
  cents = Math.min(Math.abs(cents), inTuneRange);
  return Math.round(((cents - 0) * (60 - 1)) / (inTuneRange - 0) + 1);
}

function setHandFrame(frame) {
  if (frame < 10) {
    frame = "0" + frame;
  }
  document.querySelector(".thumb").src = "./frames/00" + frame + ".png";
}

tuner.onNoteDetected = (note) => {
  if (note.confidence < 0.5) {
    return;
  }

  frame = getFrame(note.cents);
  setHandFrame(frame);
  console.log(note);

  if (resetTimeout) {
    clearTimeout(resetTimeout);
  }
  resetTimeout = setTimeout(() => {
    setHandFrame(0);
  }, timeToDetect);
};

function start() {
  tuner.init(() => {
    document.querySelector(".allow-access").remove();
    document.querySelector(".thumb").classList.remove("hidden");
  });
  frequencyData = new Uint8Array(tuner.analyser.frequencyBinCount);
}
