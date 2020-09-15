const $canvas = $("#sig-canvas"); // jQuery select element
const canvas = $canvas[0]; // select actual html element
const ctx = canvas.getContext("2d"); // create context

const $hiddenField = $("#hidden-field");
const hiddenField = $hiddenField[0];

const $clearButton = $("#clear");
$clearButton.on("click", () => {
    console.log("clicked clear button");
    hiddenField.value = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// const canvas = document.getElementById("sig-canvas");
// let ctx = canvas.getContext("2d");
// const sigInput = document.getElementById("signature-input");

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", paint);

let coord = { x: 0, y: 0 };
let draw = false;

function getPosition(event) {
    coord.x = event.clientX - canvas.getBoundingClientRect().left;
    coord.y = event.clientY - canvas.getBoundingClientRect().top;
}

function startDrawing(event) {
    draw = true;
    getPosition(event);
}
function stopDrawing() {
    draw = false;

    let dataURL = canvas.toDataURL();
    hiddenField.value = dataURL;
}

function paint(event) {
    if (!draw) return;
    ctx.beginPath();

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.moveTo(coord.x, coord.y);
    getPosition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}
