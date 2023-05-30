let audioPlayer = document.getElementById("audioPlayer");
const audioFile = "audioFiles/ye.mp3";
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();

// Connect the audio player to the analyser
function connectAudioSource() {
  let source = audioCtx.createMediaElementSource(audioPlayer);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
}

// Render the circular waveform
function renderCircularWaveform() {
  let canvas = document.getElementById("waveformCanvas");
  let canvasContext = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 240; // Adjust the radius value for a larger circle

  canvasContext.clearRect(0, 0, width, height);

  function draw() {
    requestAnimationFrame(draw);

    // Get frequency data
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Clear canvas and set background color
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(0, 0, width, height);

    // Draw circular waveform
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "black";
    canvasContext.beginPath();

    for (let i = 0; i < bufferLength; i++) {
      let angle = (i / bufferLength) * Math.PI * 2;
      let amplitude = (dataArray[i] / 32.0) * radius;

      let x = centerX + Math.cos(angle) * amplitude;
      let y = centerY + Math.sin(angle) * amplitude;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }
    }

    canvasContext.closePath();
    canvasContext.stroke();
  }

  draw();
}

function playAudio() {
  audioPlayer.src = audioFile;
  audioPlayer.play();
  connectAudioSource();
  renderCircularWaveform();
}
