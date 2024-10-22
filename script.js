// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const namesInput = document.getElementById('names-input');
    const winnerDialog = document.getElementById('winner-dialog');
    const winnerNameElement = document.getElementById('winner-name');
    const closeDialogButton = document.getElementById('close-dialog');

    let names = [];
    let startAngle = 0;
    let arc = 0;
    let spinTimeout = null;
    let spinAngleStart = 0;
    let spinTime = 0;
    let spinTimeTotal = 0;
    let slowSpinInterval = null; // For slow rotation

    const storageKey = 'wheelOfNamesData';
    const expirationDays = 7;

    // Array of congratulatory phrases
    const phrases = [
        "Congratulations, {name}! You are the winner!",
        "Well done, {name}! You've been selected!",
        "Hooray! {name}, you're up next!",
        "Lucky you, {name}! It's your turn!",
        "The wheel has spoken: {name}!",
        "Get ready, {name}! It's time to shine!",
        "Bravo, {name}! You've been chosen!",
        "Cheers, {name}! The spotlight is yours!",
        "Fantastic, {name}! You start the meeting!",
        "{name}, fortune favors you today!"
    ];

    // Load names from localStorage
    loadNamesFromStorage();

    // Event listeners
    spinButton.addEventListener('click', spin);
    namesInput.addEventListener('input', updateNames);
    closeDialogButton.addEventListener('click', () => {
        winnerDialog.close();
    });

    function startSlowSpin() {
        if (slowSpinInterval) {
            clearInterval(slowSpinInterval);
        }
        slowSpinInterval = setInterval(() => {
            startAngle += (0.5 / 3) * (Math.PI / 180); // Rotate by 0.1667 degree per frame
            drawWheel();
        }, 30); // Update every 30 milliseconds
    }

    function updateNames() {
        const namesText = namesInput.value;
        names = namesText.split('\n').map(name => name.trim()).filter(name => name);
        arc = (Math.PI * 2) / names.length;
        drawWheel();
        saveNamesToStorage();
        // Start slow spin if not already spinning
        if (!spinTimeout && !slowSpinInterval) {
            startSlowSpin();
        }
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

            // Draw segment
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
                canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 70),
                canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 70)
            );
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#2c3e50'; // Darker text color for contrast
            ctx.font = 'bold 20px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
            ctx.fillText(name, 0, 0);
            ctx.restore();
        });

        // Draw pointer
        drawPointer();
    }

    function drawPointer() {
        // Draw pointer with distinct color and outline
        ctx.fillStyle = '#ffffff'; // White color to stand out against the wheel
        ctx.strokeStyle = '#000000'; // Black outline for contrast
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 15, canvas.height / 2 - (canvas.height / 2) - 10);
        ctx.lineTo(canvas.width / 2 + 15, canvas.height / 2 - (canvas.height / 2) - 10);
        ctx.lineTo(canvas.width / 2, canvas.height / 2 - (canvas.height / 2) + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function spin() {
        if (names.length === 0) {
            alert('Please enter at least one name to spin the wheel.');
            return;
        }
        // Stop the slow spin
        if (slowSpinInterval) {
            clearInterval(slowSpinInterval);
            slowSpinInterval = null;
        }
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 8000 + 10000; // Increased spin time
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
        spinTimeout = null;
        const degrees = (startAngle * 180) / Math.PI + 90;
        const arcd = (arc * 180) / Math.PI;
        const index = Math.floor(((360 - (degrees % 360)) % 360) / arcd);
        const selectedName = names[index];

        // Select a random phrase
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        const message = randomPhrase.replace('{name}', selectedName);

        // Display the winner in the dialog
        winnerNameElement.textContent = message;
        winnerDialog.showModal();

        // Restart the slow spin
        startSlowSpin();
    }

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    function getColor(itemIndex, totalItems) {
        const hue = (itemIndex * 360) / totalItems;
        return `hsl(${hue}, 70%, 60%)`; // Adjusted saturation and lightness for softer colors
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
                startSlowSpin(); // Start slow spin after loading names
            } else {
                // Data expired
                localStorage.removeItem(storageKey);
                namesInput.value = '';
                updateNames();
                startSlowSpin(); // Start slow spin
            }
        } else {
            // Initialize with empty names
            namesInput.value = '';
            updateNames();
            startSlowSpin(); // Start slow spin
        }
    }
});
