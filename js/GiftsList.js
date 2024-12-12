

document.getElementById('addGift').addEventListener('click', function() {
    const steals = document.getElementById('newGiftSteals').value;
    const description = document.getElementById('newGiftDescription').value;
    const holder = document.getElementById('newGiftHolder').value;

    if (steals && description && holder) {
        const gift = {
            steals: steals,
            description: description,
            holder: holder,
            lastUpdate: new Date(),
            updates: []
        };

        addGiftToList(gift);

        // Clear input fields
        document.getElementById('newGiftSteals').value = '0';
        document.getElementById('newGiftDescription').value = '';
        document.getElementById('newGiftHolder').value = '';
    }
});

function addGiftToList(gift) {
    const giftsList = document.getElementById('giftsList');
    const giftItem = document.createElement('li');
    giftItem.className = 'gift';
    giftItem.innerHTML = `
        <input type="number" value="${gift.steals}" class="gift-steals" min="0">
        <input type="text" value="${gift.description}" class="gift-description">
        <input type="text" value="${gift.holder}" class="gift-holder">
    `;

    // Add the new gift to the top of giftcol1
    giftsList.prepend(giftItem);

    // Update the last update time and list of updates when any field is changed
    const stealsInput = giftItem.querySelector('.gift-steals');
    const descriptionInput = giftItem.querySelector('.gift-description');
    const holderInput = giftItem.querySelector('.gift-holder');

    stealsInput.addEventListener('change', function() {
        gift.steals = stealsInput.value;
        updateGift(gift);
    });

    descriptionInput.addEventListener('change', function() {
        gift.description = descriptionInput.value;
        updateGift(gift);
    });

    holderInput.addEventListener('change', function() {
        gift.holder = holderInput.value;
        updateGift(gift);
    });
}

function updateGift(gift) {
    gift.lastUpdate = new Date();
    gift.updates.push({
        steals: gift.steals,
        description: gift.description,
        holder: gift.holder,
        time: gift.lastUpdate
    });
}

document.getElementById('createTimers').addEventListener('click', function() {
    const numTimers = parseInt(document.getElementById('numTimers').value);
    const defaultTime = parseInt(document.getElementById('defaultTime').value);
    const timersContainer = document.getElementById('timersContainer');
    timersContainer.innerHTML = '';

    for (let i = 1; i <= numTimers; i++) {
        createTimer(i, defaultTime, timersContainer);
    }
});

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

    timerDiv.querySelector('.start').addEventListener('click', function() {
        if (interval) return;
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeDisplay.textContent = timeLeft;
                if (timeLeft <= 10) {
                    timeDisplay.classList.add('warning');
                }
            } else {
                clearInterval(interval);
                timeDisplay.textContent = 'Times Up!';
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
        });
        setTimeout(() => {
            timers.forEach(timer => {
                timer.style.transition = '';
                timer.style.transform = '';
            });
            createTimer(timers.length + 1, defaultTime, container);
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

function showGiftPopup(playerName) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div>
            <label>Steals:</label>
            <input type="number" id="popupSteals" value="0" min="0">
        </div>
        <div>
            <label>Description:</label>
            <input type="text" id="popupDescription">
        </div>
        <div>
            <label>Current Holder:</label>
            <input type="text" id="popupHolder" value="${playerName}">
        </div>
        <button id="popupOk">OK</button>
    `;
    document.body.appendChild(popup);
    popup.style.display = 'block';
    document.getElementById('popupOk').addEventListener('click', function() {
        document.body.removeChild(popup);
    });
}

function openSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    settingsPopup.style.display = 'block';
}

document.getElementById('saveSettings').addEventListener('click', function() {
    const title = document.getElementById('titleField').value;
    const numTimers = parseInt(document.getElementById('numTimers').value);
    const defaultTime = parseInt(document.getElementById('defaultTime').value);
    document.getElementById('title').textContent = title;
    document.getElementById('settingsPopup').style.display = 'none';

    const timersContainer = document.getElementById('timersContainer');
    const currentTimers = timersContainer.children.length;

    if (currentTimers < numTimers) {
        for (let i = currentTimers + 1; i <= numTimers; i++) {
            createTimer(i, defaultTime, timersContainer);
        }
    }
});
