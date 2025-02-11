let timer;
let timeLeft = 25 * 60; // 25 minutes
let isRunning = false;
let sessions = 0;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startPauseButton = document.getElementById("startPause");
const resetButton = document.getElementById("reset");
const sessionsDisplay = document.getElementById("sessions");

chrome.storage.sync.get(["sessions"], (data) => {
    sessions = data.sessions || 0;
    sessionsDisplay.textContent = sessions;
});

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes < 10 ? "0" + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? "0" + seconds : seconds;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startPauseButton.textContent = "Pause";
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                notifyUser();
                startBreak();
            }
        }, 1000);
    } else {
        clearInterval(timer);
        isRunning = false;
        startPauseButton.textContent = "Start";
    }
}

function startBreak() {
    sessions++;
    chrome.storage.sync.set({ sessions });
    sessionsDisplay.textContent = sessions;
    timeLeft = 5 * 60; // 5-minute break
    updateDisplay();
    startTimer();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();
    startPauseButton.textContent = "Start";
}

function notifyUser() {
    chrome.runtime.sendMessage({ type: "notification", message: "Pomodoro session completed! Take a short break." });
}

startPauseButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

updateDisplay();
