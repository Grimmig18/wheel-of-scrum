// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const app = new WheelOfNamesApp();
    app.init();
});

class WheelOfNamesApp {
    constructor() {
        // Canvas and context
        this.canvas = document.getElementById('wheel-canvas');
        this.ctx = this.canvas.getContext('2d');

        // UI elements
        this.spinButton = document.getElementById('spin-button');
        this.namesInput = document.getElementById('names-input');
        this.winnerDialog = document.getElementById('winner-dialog');
        this.winnerNameElement = document.getElementById('winner-name');
        this.closeDialogButton = document.getElementById('close-dialog');

        // Sliders
        this.spinDurationSlider = document.getElementById('spin-duration-slider');
        this.spinSpeedSlider = document.getElementById('spin-speed-slider');
        this.spinDurationValue = document.getElementById('spin-duration-value');
        this.spinSpeedValue = document.getElementById('spin-speed-value');

        // Wheel instance
        this.wheel = new Wheel(this.canvas, this.ctx);

        // Storage handler
        this.storageHandler = new StorageHandler('wheelOfNamesData', 7);

        // Phrases
        this.phrases = [
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

        // User settings
        this.userSpinDuration = 16000;
        this.userSpinSpeed = 1.0;

        // Names list
        this.names = [];

        // Event listeners
        this.addEventListeners();
    }

    init() {
        // Initialize slider values
        this.userSpinDuration = parseInt(this.spinDurationSlider.value);
        this.userSpinSpeed = parseFloat(this.spinSpeedSlider.value);
        this.spinDurationValue.textContent = `${this.userSpinDuration / 1000} s`;
        this.spinSpeedValue.textContent = this.userSpinSpeed.toFixed(1);

        // Load names from storage
        const storedNames = this.storageHandler.loadNames();
        if (storedNames.length > 0) {
            this.names = storedNames;
            this.namesInput.value = this.names.join('\n');
        }

        this.updateWheel();
        this.wheel.startSlowSpin();
    }

    addEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.namesInput.addEventListener('input', () => this.updateNames());
        this.closeDialogButton.addEventListener('click', () => {
            this.winnerDialog.close();
        });

        this.spinDurationSlider.addEventListener('input', () => {
            this.userSpinDuration = parseInt(this.spinDurationSlider.value);
            this.spinDurationValue.textContent = `${this.userSpinDuration / 1000} s`;
        });

        this.spinSpeedSlider.addEventListener('input', () => {
            this.userSpinSpeed = parseFloat(this.spinSpeedSlider.value);
            this.spinSpeedValue.textContent = this.userSpinSpeed.toFixed(1);
        });
    }

    updateNames() {
        const namesText = this.namesInput.value;
        this.names = namesText.split('\n').map(name => name.trim()).filter(name => name);
        this.wheel.setNames(this.names);
        this.updateWheel();
        this.storageHandler.saveNames(this.names);
    }

    updateWheel() {
        if (this.names.length > 0) {
            this.wheel.setNames(this.names);
            this.wheel.drawWheel();
        } else {
            this.wheel.clearWheel();
        }
    }

    spin() {
        if (this.names.length === 0) {
            alert('Please enter at least one name to spin the wheel.');
            return;
        }
        this.wheel.stopSlowSpin();
        this.wheel.spin(
            this.userSpinDuration,
            this.userSpinSpeed,
            (selectedName) => this.showWinner(selectedName)
        );
    }

    showWinner(selectedName) {
        // Select a random phrase
        const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
        const message = randomPhrase.replace('{name}', selectedName);

        // Display the winner in the dialog
        this.winnerNameElement.textContent = message;
        this.winnerDialog.showModal();

        // Restart the slow spin
        this.wheel.startSlowSpin();
    }
}

class Wheel {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.names = [];
        this.startAngle = 0;
        this.arc = 0;
        this.spinTimeout = null;
        this.spinAngleStart = 0;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
        this.slowSpinInterval = null;
        this.isSpinning = false;
    }

    setNames(names) {
        this.names = names;
        this.arc = (Math.PI * 2) / this.names.length;
    }

    drawWheel() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.names.length === 0) {
            // Display message if no names are entered
            this.ctx.fillStyle = 'black';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Please enter names to spin the wheel', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        // Draw wheel slices
        this.names.forEach((name, index) => {
            const angle = this.startAngle + index * this.arc;
            this.ctx.fillStyle = this.getColor(index, this.names.length);

            // Draw segment
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.arc(
                this.canvas.width / 2,
                this.canvas.height / 2,
                this.canvas.width / 2,
                angle,
                angle + this.arc,
                false
            );
            this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fill();

            // Add text labels
            this.ctx.save();
            this.ctx.translate(
                this.canvas.width / 2 + Math.cos(angle + this.arc / 2) * (this.canvas.width / 2 - 70),
                this.canvas.height / 2 + Math.sin(angle + this.arc / 2) * (this.canvas.height / 2 - 70)
            );
            this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#2c3e50'; // Darker text color for contrast
            this.ctx.font = 'bold 20px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
            this.ctx.fillText(name, 0, 0);
            this.ctx.restore();
        });

        // Draw pointer
        this.drawPointer();
    }

    clearWheel() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPointer() {
        // Draw pointer with distinct color and outline
        this.ctx.fillStyle = '#ffffff'; // White color to stand out against the wheel
        this.ctx.strokeStyle = '#000000'; // Black outline for contrast
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2 - 15, this.canvas.height / 2 - (this.canvas.height / 2) - 10);
        this.ctx.lineTo(this.canvas.width / 2 + 15, this.canvas.height / 2 - (this.canvas.height / 2) - 10);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2 - (this.canvas.height / 2) + 20);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    startSlowSpin() {
        if (this.slowSpinInterval) {
            clearInterval(this.slowSpinInterval);
        }
        this.slowSpinInterval = setInterval(() => {
            this.startAngle += (0.5 / 3) * (Math.PI / 180); // Rotate by approximately 0.1667 degrees per frame
            this.drawWheel();
        }, 30); // Update every 30 milliseconds
    }

    stopSlowSpin() {
        if (this.slowSpinInterval) {
            clearInterval(this.slowSpinInterval);
            this.slowSpinInterval = null;
        }
    }

    spin(spinDuration, spinSpeed, callback) {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinAngleStart = (Math.random() * 5 + 10) * spinSpeed;
        this.spinTime = 0;
        this.spinTimeTotal = spinDuration;
        this.rotateWheel(callback);
    }

    rotateWheel(callback) {
        this.spinTime += 30;
        if (this.spinTime >= this.spinTimeTotal) {
            this.stopRotateWheel(callback);
            return;
        }
        const spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
        this.startAngle += (spinAngle * Math.PI) / 180;
        this.drawWheel();
        this.spinTimeout = setTimeout(() => this.rotateWheel(callback), 30);
    }

    stopRotateWheel(callback) {
        clearTimeout(this.spinTimeout);
        this.spinTimeout = null;
        this.isSpinning = false;

        const degrees = (this.startAngle * 180) / Math.PI + 90;
        const arcd = (this.arc * 180) / Math.PI;
        const index = Math.floor(((360 - (degrees % 360)) % 360) / arcd);
        const selectedName = this.names[index];

        callback(selectedName);
    }

    easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    getColor(itemIndex, totalItems) {
        const hue = (itemIndex * 360) / totalItems;
        return `hsl(${hue}, 70%, 60%)`; // Adjusted saturation and lightness for softer colors
    }
}

class StorageHandler {
    constructor(storageKey, expirationDays) {
        this.storageKey = storageKey;
        this.expirationDays = expirationDays;
    }

    saveNames(names) {
        const data = {
            names: names,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadNames() {
        const dataString = localStorage.getItem(this.storageKey);
        if (dataString) {
            const data = JSON.parse(dataString);
            const currentTime = new Date().getTime();
            const expirationTime = this.expirationDays * 24 * 60 * 60 * 1000; // days to milliseconds
            if (currentTime - data.timestamp < expirationTime) {
                return data.names;
            } else {
                // Data expired
                localStorage.removeItem(this.storageKey);
            }
        }
        return [];
    }
}
