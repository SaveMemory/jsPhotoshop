document.addEventListener("DOMContentLoaded", start);
let canvas = document.getElementById("editor");
let contrastBtn = document.querySelector("#contrastBtn");
let blurBtn = document.querySelector("#blurBtn");
let ctx = canvas.getContext("2d");
let image;
let mouseDown = false;
let factor;
let imageData;

function start() {
  loadImg();
  ctx.strokeStyle = "purple";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  canvas.addEventListener("mousedown", down);
  canvas.addEventListener("mouseup", toggleDraw);
  canvas.addEventListener("mousemove", function(event) {
    let mousePosition = getMousePosition(canvas, event);
    let positionX = mousePosition.x;
    let positionY = mousePosition.y;
    draw(canvas, positionX, positionY);
  });
  contrastBtn.addEventListener("click", contrastImage);
  blurBtn.addEventListener("click", blurImage);
}

//ładowanie obrazka
function loadImg() {
  image = new Image();
  let url = "http://192.168.56.1:8080";
  image.src = url + "?" + new Date().getTime();
  image.setAttribute("crossOrigin", "");
  image.onload = function() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}

//detekcja klikniecia
function down() {
  mouseDown = true;
}

//włączenie pędzla
function toggleDraw() {
  mouseDown = false;
}

//pobieranie pozycji myszki
function getMousePosition(canvas, event) {
  let rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
}

//zakres malowania pędzlem
function draw(canvas, positionX, positionY) {
  if (mouseDown) {
    ctx.beginPath();
    ctx.moveTo(positionX, positionY);
    ctx.lineTo(positionX, positionY);
    ctx.stroke();
  }
}

//dodawanie kontrastu
function contrastImage() {
  imageData = ctx.getImageData(0, 0, 600, 400);
  contrast(imageData, 0.5);
  ctx.putImageData(imageData, 0, 0);
}

//obliczanie kontrastu
function contrast(imageData, contrast) {
  let data = imageData.data;
  contrast *= 255;
  let factor = (contrast + 255) / (255.01 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
  return imageData;
}

//dodawanie rozmycia
function blurImage() {
  imageData = ctx.getImageData(0, 0, 600, 400);
  blur(imageData);
  ctx.putImageData(imageData, 0, 0);
}

//obliczanie rozmycia
function blur(imageData) {
  var iW = 0;
  var p1 = 0.99;
  var p2 = 0.99;
  var p3 = 0.99;
  var er = 0;
  var eg = 0;
  var eb = 0;
  var iBlurRate = 2;

  let data = imageData.data;
  for (br = 0; br < iBlurRate; br += 1) {
    for (var i = 0, n = data.length; i < n; i += 4) {
      iMW = 4 * iW;
      iSumOpacity = iSumRed = iSumGreen = iSumBlue = 0;
      iCnt = 0;
      aCloseData = [
        i - iMW - 4,
        i - iMW,
        i - iMW + 4,
        i - 4,
        i + 4,
        i + iMW - 4,
        i + iMW,
        i + iMW + 4
      ];
      // obliczanie sumy dla najblizszych pixeli
      for (e = 0; e < aCloseData.length; e += 1) {
        if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
          iSumOpacity += data[aCloseData[e]];
          iSumRed += data[aCloseData[e] + 1];
          iSumGreen += data[aCloseData[e] + 2];
          iSumBlue += data[aCloseData[e] + 3];
          iCnt += 1;
        }
      }
      // zastosowanie zmian
      data[i] = (iSumOpacity / iCnt) * p1 + er;
      data[i + 1] = (iSumRed / iCnt) * p2 + eg;
      data[i + 2] = (iSumGreen / iCnt) * p3 + eb;
      data[i + 3] = iSumBlue / iCnt;
    }
  }
  return imageData;
}
