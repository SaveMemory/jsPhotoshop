document.addEventListener('DOMContentLoaded', start);
let canvas = document.getElementById('editor');
console.log(canvas.width);
let contrastBtn = document.querySelector('#contrastBtn');
let ctx = canvas.getContext('2d');
let image;
let mouseDown = false;
let factor;
let imgData = ctx.getImageData(0, 0, 600, 400);

function start() {
  loadImg();
  ctx.strokeStyle = 'purple';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  canvas.addEventListener('mousedown', down);
  canvas.addEventListener('mouseup', toggleDraw);
  canvas.addEventListener('mousemove', function(event) {
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
  image.src =
    'https://www.wykop.pl/cdn/c3201142/comment_MzEwETvgHANGlzTFlFo9SA22cXLFiOAJ.jpg';
  image.onload = function() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
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
  let contrast = 70;
  let d = imgData.data;
  contrast = contrast / 100 + 1;
  let intercept = 128 * (1 - contrast);
  for (let i = 0; i < d.length; i += 4) {
    d[i] = d[i] * contrast + intercept;
    d[i + 1] = d[i + 1] * contrast + intercept;
    d[i + 2] = d[i + 2] * contrast + intercept;
  }
  console.log('dziala');
  return imgData;
}