const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const saveElem = document.getElementById("save");
// Options for getDisplayMedia()

var chunks = [];
var mediaRecorder = null;
var recording = null;

const displayMediaOptions = {
  video: {
    cursor: "never"
  },
  audio: false
};
// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);
stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);
saveElem.addEventListener("click", function(evt) {
  saveCapture();
}, false);
console.log = msg => logElem.innerHTML += `${msg}<br>`;
console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();

    videoElem.srcObject.addEventListener('inactive', e => {
      this.stopCapture(e);
    });
    this.mediaRecorder = new MediaRecorder(videoElem.srcObject, {mimeType: 'video/webm'});
    this.mediaRecorder.addEventListener('dataavailable', event =>{
      if(event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });
    this.mediaRecorder.start(10);

  } catch(err) {
    console.error("Error: " + err);
  }
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;

  this.recording = window.URL.createObjectURL(new Blob(this.chunks, {type: 'video/webm'}));
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

function saveCapture() {
  const downloadlink = document.getElementById('downloadLink');
  downloadlink.addEventListener('progress', e => console.log(e));
  downloadlink.href = this.recording;
  downloadlink.download = 'screen-recording.webm';
  downloadlink.click();
}
