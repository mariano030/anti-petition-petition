// need hidden input field for the canvas value to be send

console.log("sane");

const $canvas = $("#sig-canvas"); // jQuery select element
const canvas = $canvas[0]; // select actual html element
const ctx = canvas.getContext("2d"); // create context

var oldPosition;

$canvas.on("mousedown", (e) => {
    console.log("click");
    oldPosition = {
        x: e.offsetX,
        y: e.offsetY,
    };
    $canvas.on("mousemove", (e) => {
        console.log(oldPosition);
        ctx.beginPath();
        ctx.moveTo(oldPosition.x, oldPosition.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        console.log("drawing");
        console.log(e.offsetX, e.offsetY);
        console.log(oldPosition);
        oldPostition = {
            x: e.offsetX,
            y: e.offsetY,
        };
    });
});
