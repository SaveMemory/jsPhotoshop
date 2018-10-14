document.addEventListener("DOMContentLoaded", start);
console.log('działa');
let canvas;
let ctx;
let image;
function start(){
    console.log('działa');
    loadImg();
}
function loadImg (){
    canvas = document.getElementById("editor");
    ctx = canvas.getContext("2d");
    console.log('dziala');
    image = new Image();
    image.src = 'https://www.wykop.pl/cdn/c3201142/comment_MzEwETvgHANGlzTFlFo9SA22cXLFiOAJ.jpg';
    image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
}