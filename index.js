tuner = new Tuner(440);
frequencyData = null;

tuner.onNoteDetected = (note) => {
  document.querySelector(".thumb").innerHTML = note;
  console.log(note);
};

swal.fire("Press OK to start").then(function () {
  tuner.init();
  frequencyData = new Uint8Array(tuner.analyser.frequencyBinCount);
});
