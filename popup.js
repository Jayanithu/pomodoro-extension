let timer;
let timeLeft;
let isRunning = false;
let sessions = 0;
let workDuration = 25;
let breakDuration = 5;
let currentMode = "work";

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startPauseButton = document.getElementById("startPause");
const resetButton = document.getElementById("reset");
const workInput = document.getElementById("workDuration");
const breakInput = document.getElementById("breakDuration");
const saveSettingsButton = document.getElementById("saveSettings");
const sessionsDisplay = document.getElementById("sessions");
const taskList = document.getElementById("taskList");
const newTaskInput = document.getElementById("newTask");
const addTaskButton = document.getElementById("addTask");
const stickyTimer = document.getElementById("stickyTimer");
const stickyTimeDisplay = document.getElementById("stickyTime");
const hideStickyButton = document.getElementById("hideSticky");

chrome.storage.sync.get(["sessions", "workDuration", "breakDuration"], (data) => {
    sessions = data.sessions || 0;
    workDuration = data.workDuration || 25;
    breakDuration = data.breakDuration || 5;
    timeLeft = workDuration * 60;
    workInput.value = workDuration;
    breakInput.value = breakDuration;
    sessionsDisplay.textContent = sessions;
    updateDisplay();
});

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    stickyTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
                switchMode();
            }
        }, 1000);
    } else {
        clearInterval(timer);
        isRunning = false;
        startPauseButton.textContent = "Start";
    }
}

function switchMode() {
    if (currentMode === "work") {
        sessions++;
        chrome.storage.sync.set({ sessions });
        sessionsDisplay.textContent = sessions;
        currentMode = "break";
        timeLeft = breakDuration * 60;
    } else {
        currentMode = "work";
        timeLeft = workDuration * 60;
    }
    updateDisplay();
    startTimer();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = workDuration * 60;
    currentMode = "work";
    updateDisplay();
    startPauseButton.textContent = "Start";
}

saveSettingsButton.addEventListener("click", () => {
    workDuration = parseInt(workInput.value);
    breakDuration = parseInt(breakInput.value);
    chrome.storage.sync.set({ workDuration, breakDuration });
    resetTimer();
});

function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === "") return;
    
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `<span>${taskText}</span> <button class="deleteTask">❌</button>`;
    taskList.appendChild(taskItem);
    
    taskItem.querySelector(".deleteTask").addEventListener("click", () => {
        taskItem.remove();
    });
    
    newTaskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);

hideStickyButton.addEventListener("click", () => {
    stickyTimer.classList.add("hidden");
});

startPauseButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
updateDisplay();
