document.addEventListener('DOMContentLoaded', start);
let canvas = document.getElementById('editor');
console.log(canvas.width);
let contrastBtn = document.querySelector('#contrastBtn');
let ctx = canvas.getContext('2d');
let image;
let mouseDown = false;
let factor;
let imgData;

function start() {
  loadImg();
  ctx.strokeStyle = 'purple';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  canvas.addEventListener('mousedown', down);
  canvas.addEventListener('mouseup', toggleDraw);
  canvas.addEventListener('mousemove', function (event) {
    let mousePosition = getMousePosition(canvas, event);
    let positionX = mousePosition.x;
    let positionY = mousePosition.y;
    draw(canvas, positionX, positionY);
  });
  console.log('xd');
  contrastBtn.addEventListener('click', contrastImage);
}

function loadImg() {
  image = new Image();
  image.src = './zdj.png';
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    console.log(image);
    // imgData = ctx.getImageData(0, 0, 600, 400);
  };
}

function down() {
  mouseDown = true;
}

function toggleDraw() {
  mouseDown = false;
}

function getMousePosition(canvas, event) {
  let rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
}

function draw(canvas, positionX, positionY) {
  if (mouseDown) {
    ctx.beginPath();
    ctx.moveTo(positionX, positionY);
    ctx.lineTo(positionX, positionY);
    ctx.stroke();
  }
}

function contrastImage() {
  let imgData = ctx.getImageData(0, 0, 600, 400);
  contrast(imgData, 0.5);
  ctx.putImageData(imgData, 0, 0);
  //   console.log('dziala');
}

function contrast(imageData, contrast) {
  // contrast input as percent; range [-1..1]
  let data = imageData.data; // Note: original dataset modified directly!
  contrast *= 255;
  let factor = (contrast + 255) / (255.01 - contrast); //add .1 to avoid /0 error.

  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData; //optional (e.g. for filter function chaining)
}