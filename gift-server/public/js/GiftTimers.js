document.getElementById('saveSettings').addEventListener('click', function() {
    updateTimers();
});

timerIndex = 0;

function updateTimers() {

    const numTimers = parseInt(document.getElementById('numTimers').value);
    const defaultTime = parseInt(document.getElementById('defaultTime').value);
    const timersContainer = document.getElementById('timersContainer');
    /*timersContainer.innerHTML = '';*/

    currentTimers = timersContainer.children.length;
    console.log("CurrentTimers:", currentTimers, "   NumTimers:", numTimers);

    for (let i = 1; i <= numTimers - currentTimers; i++) {
        createTimer(++timerIndex, defaultTime, timersContainer);
    }
};

function createTimer(index, defaultTime, container) {
    const timerDiv = document.createElement('div');
    timerDiv.className = 'timer';
    timerDiv.innerHTML = `
        <input type="text" value="${index}" class="player-name">
        <div class="time">${defaultTime}</div>
        <div class="buttons">
            <button class="start">Start</button>
            <button class="reset">Reset</button>
            <button class="steal">Steal</button>
            <button class="new-gift">New Gift</button>
        </div>
    `;
    container.appendChild(timerDiv);

    const timeDisplay = timerDiv.querySelector('.time');
    let timeLeft = defaultTime;
    let interval;

    // Timer Countdown
    timerDiv.querySelector('.start').addEventListener('click', function() {
        if (interval) return;
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeDisplay.textContent = timeLeft;
                if (timeLeft <= 10) {
                    timeDisplay.classList.add('warning');
                    // Increase font size by 1px
                    const currentFontSize = window.getComputedStyle(timeDisplay).fontSize;
                    const newFontSize = parseFloat(currentFontSize) + 3 + 'px';
                    timeDisplay.style.fontSize = newFontSize;
                }
            } else {
                clearInterval(interval);
                timeDisplay.textContent = "Time's Up!";
                const currentFontSize = window.getComputedStyle(timeDisplay).fontSize;
                const newFontSize = parseFloat(currentFontSize) - 14 + 'px';
                timeDisplay.style.fontSize = newFontSize;

            }
        }, 1000);
    });

    timerDiv.querySelector('.reset').addEventListener('click', function() {
        clearInterval(interval);
        interval = null;
        timeLeft = defaultTime;
        timeDisplay.textContent = timeLeft;
        timeDisplay.classList.remove('warning');
    });

    timerDiv.querySelector('.steal').addEventListener('click', function() {
        showPopup('Well there went another one!');
        removeAndShiftTimers(timerDiv, container, defaultTime);
    });

    timerDiv.querySelector('.new-gift').addEventListener('click', function() {
        const playerName = timerDiv.querySelector('.player-name').value;
        showGiftPopup(playerName);
        removeAndShiftTimers(timerDiv, container, defaultTime);
    });
}

function removeAndShiftTimers(timerDiv, container, defaultTime) {
    timerDiv.style.transition = 'opacity 2s';
    timerDiv.style.opacity = '0';
    setTimeout(() => {
        container.removeChild(timerDiv);
        const timers = Array.from(container.children);
        timers.forEach((timer, index) => {
            timer.style.transition = 'transform 1s';
            timer.style.transform = `translateX(-${100 * index}%)`;
            // timer.style.transform = `translateX(${index * 310}px)`; // Adjust based on timer width and margin

        });
        setTimeout(() => {
            timers.forEach(timer => {
                timer.style.transition = '';
                timer.style.transform = '';
            });
            updateTimers();
        }, 1000);
    }, 2000);
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    popup.style.display = 'block';
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}

function openSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    settingsPopup.style.display = 'block';
}

document.getElementById('saveSettings').addEventListener('click', function() {
    const title = document.getElementById('titleField').value;
    document.getElementById('title').textContent = title;
    document.getElementById('settingsPopup').style.display = 'none';
});

/********************************************************************************** */
