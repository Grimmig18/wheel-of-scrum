// script.js

// Global variables
var canvas;
var ctx;
var names = [];
var startAngle = 0;
var arc = 0;
var spinTimeout = null;
var spinAngleStart = 0;
var spinTime = 0;
var spinTimeTotal = 0;

// Functions

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('wheel-canvas');
    ctx = canvas.getContext('2d');

    // Initialize with sample names
    document.getElementById('names-input').value = 'Alice\nBob\nCharlie\nDiana';
    updateNames();

    // Event listeners
    document.getElementById('spin-button').addEventListener('click', spin);
    document.getElementById('names-input').addEventListener('change', updateNames);
});

function updateNames() {
    var namesText = document.getElementById('names-input').value;
    names = namesText.split('\n').filter(function(name) {
        return name.trim() !== '';
    });
    arc = Math.PI * 2 / names.length;
    drawWheel();
}

function drawWheel() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel slices
    for (var i = 0; i < names.length; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, names.length);

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            angle,
            angle + arc,
            false
        );
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fill();

        // Add text labels
        ctx.save();
        ctx.translate(
            canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 50),
            canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 50)
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 15px Arial';
        ctx.fillText(names[i], 0, 0);
        ctx.restore();
    }

    // Draw pointer
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - (canvas.height / 2) - 20);
    ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - (canvas.height / 2) - 20);
    ctx.lineTo(canvas.width / 2, canvas.height / 2 - (canvas.height / 2) - 5);
    ctx.closePath();
    ctx.fill();
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = (startAngle * 180) / Math.PI + 90;
    var arcd = (arc * 180) / Math.PI;
    var index = Math.floor(((360 - (degrees % 360)) % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Arial';
    var selectedName = names[index];
    alert('Selected Participant: ' + selectedName);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function getColor(item, maxItems) {
    var hue = (item * 360) / maxItems;
    return 'hsl(' + hue + ', 100%, 50%)';
}
