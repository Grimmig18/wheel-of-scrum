// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const namesInput = document.getElementById('names-input');

    let names = [];
    let startAngle = 0;
    let arc = 0;
    let spinTimeout = null;
    let spinAngleStart = 0;
    let spinTime = 0;
    let spinTimeTotal = 0;

    const storageKey = 'wheelOfNamesData';
    const expirationDays = 7;

    // Load names from localStorage
    loadNamesFromStorage();

    // Event listeners
    spinButton.addEventListener('click', spin);
    namesInput.addEventListener('input', updateNames);

    function updateNames() {
        const namesText = namesInput.value;
        names = namesText.split('\n').map(name => name.trim()).filter(name => name);
        arc = (Math.PI * 2) / names.length;
        drawWheel();
        saveNamesToStorage();
    }

    function drawWheel() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (names.length === 0) {
            // Display message if no names are entered
            ctx.fillStyle = 'black';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Please enter names to spin the wheel', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Draw wheel slices
        names.forEach((name, index) => {
            const angle = startAngle + index * arc;
            ctx.fillStyle = getColor(index, names.length);

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
            ctx.fillText(name, 0, 0);
            ctx.restore();
        });

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
        if (names.length === 0) {
            alert('Please enter at least one name to spin the wheel.');
            return;
        }
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
        const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        startAngle += (spinAngle * Math.PI) / 180;
        drawWheel();
        spinTimeout = setTimeout(rotateWheel, 30);
    }

    function stopRotateWheel() {
        clearTimeout(spinTimeout);
        const degrees = (startAngle * 180) / Math.PI + 90;
        const arcd = (arc * 180) / Math.PI;
        const index = Math.floor(((360 - (degrees % 360)) % 360) / arcd);
        const selectedName = names[index];
        alert(`Selected Participant: ${selectedName}`);
    }

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    function getColor(itemIndex, totalItems) {
        const hue = (itemIndex * 360) / totalItems;
        return `hsl(${hue}, 100%, 50%)`;
    }

    function saveNamesToStorage() {
        const data = {
            names: names,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function loadNamesFromStorage() {
        const dataString = localStorage.getItem(storageKey);
        if (dataString) {
            const data = JSON.parse(dataString);
            const currentTime = new Date().getTime();
            const expirationTime = expirationDays * 24 * 60 * 60 * 1000; // days to milliseconds
            if (currentTime - data.timestamp < expirationTime) {
                names = data.names;
                namesInput.value = names.join('\n');
                arc = (Math.PI * 2) / names.length;
                drawWheel();
            } else {
                // Data expired
                localStorage.removeItem(storageKey);
            }
        } else {
            // Initialize with sample names if no data is stored
            namesInput.value = 'Alice\nBob\nCharlie\nDiana';
            updateNames();
        }
    }
});
