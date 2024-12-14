

function showGiftPopup(playerName) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div>
            <label>Steals:</label>
            <input type="number" id="newGiftSteals" value="0" min="0">
        </div>
        <div>
            <label>Description:</label>
            <input type="text" id="newGiftDescription">
        </div>
        <div>
            <label>Current Holder:</label>
            <input type="text" id="newGiftHolder" value="${playerName}">
        </div>
        <button id="popupOk">OK</button>
        <button id="popupCancel">Cancel</button>
    `;
    document.body.appendChild(popup);
    popup.style.display = 'block';
    document.getElementById('popupOk').focus(); // Set focus to the Save button
    document.getElementById('popupOk').addEventListener('click', function() {
        const steals = document.getElementById('newGiftSteals').value;
        const description = document.getElementById('newGiftDescription').value;
        const holder = document.getElementById('newGiftHolder').value;

        if (description.trim() === '') {
            alert('Description cannot be empty.');
            return;
        }

        const gift = {
            gid: 'gift' + String(Math.floor(Math.random() * 1000000)),   // Generate a random gift ID
            steals: steals,
            description: description,
            holder: holder,
            lastUpdate: new Date(),
            lastSteal: new Date(),
            updates: []
        };

        addGiftToList(gift);

        document.body.removeChild(popup);
    });

    document.getElementById('popupCancel').addEventListener('click', function() {
        document.body.removeChild(popup);
    });
}



function addGiftToList(gift) {
    console.log("addGiftToList:", gift);
    const giftsPanel = document.getElementById('giftsPanel');
    const giftList = document.getElementById('giftList');
    const giftItem = document.createElement('li');
    maxSteals = document.getElementById('maxSteals').value;

    giftItem.className = 'gift';
    giftItem.id = gift.gid;
    giftItem.innerHTML = `
        <input type="number" value="${gift.steals}" class="gift-steals" min="0" max="${maxSteals}">
        <input type="text" value="${gift.description}" class="gift-description">
        <input type="text" value="${gift.holder}" class="gift-holder">
        <input type="hidden" value="${gift.lastSteal}" class="gift-lastSteal">

    `;
    giftsPanel.style.display = 'block';

    // Add the new gift to the top of the list
    giftList.prepend(giftItem);

    // Update the last update time and list of updates when steals or holder is changed
    const stealsInput = giftItem.querySelector('.gift-steals');
    const descriptionInput = giftItem.querySelector('.gift-description');
    const holderInput = giftItem.querySelector('.gift-holder');

    function updateGiftClass() {
        if (parseInt(stealsInput.value) >= maxSteals) {
            giftItem.classList.add('uneditable');
            descriptionInput.disabled = true;
            holderInput.disabled = true;
            stealsInput.style.backgroundColor = 'grey';
            descriptionInput.style.backgroundColor = 'grey';
            holderInput.style.backgroundColor = 'grey';
        } else {
            giftItem.classList.remove('uneditable');
            descriptionInput.disabled = false;
            holderInput.disabled = false;
            stealsInput.style.backgroundColor = '';
            descriptionInput.style.backgroundColor = '';
            holderInput.style.backgroundColor = '';
        }
    }

    stealsInput.addEventListener('change', function() {
        gift.steals = stealsInput.value;
        gift.lastSteal = new Date();
        giftItem.querySelector('.gift-lastSteal').value = gift.lastSteal;
        updateGift(gift);
        updateGiftClass();
        // sortGiftsByLastSteal();
    });

    descriptionInput.addEventListener('change', function() {
        gift.description = descriptionInput.value;
        updateGift(gift);
    });

    holderInput.addEventListener('change', function() {
        gift.holder = holderInput.value;
        updateGift(gift);
    });

    // Initial check
    updateGiftClass();

}

function updateGift(gift) {
    gift.lastUpdate = new Date();
    maxSteals = document.getElementById('maxSteals').value;
    gift.updates.push({
        steals: gift.steals,
        description: gift.description,
        holder: gift.holder,
        time: gift.lastUpdate
    });
    updateGiftOrder();
}

function updateGiftOrder() {
    const giftList = document.getElementById('giftList');
    const gifts = Array.from(giftList.children);
    gifts.sort((a, b) => {
        const stealsA = parseInt(a.querySelector('.gift-steals').value);
        const stealsB = parseInt(b.querySelector('.gift-steals').value);

        if (stealsA >= maxSteals && stealsB >= maxSteals) {
            return 0; // Both are at maxSteals, keep their order
        }
        if (stealsA >= maxSteals) {
            return 1; // Move a to the bottom
        }
        if (stealsB >= maxSteals) {
            return -1; // Move b to the bottom
        }
        const lastStealA = new Date(a.querySelector('.gift-lastSteal').value);
        const lastStealB = new Date(b.querySelector('.gift-lastSteal').value);
        return lastStealB - lastStealA;
    });
    gifts.forEach(gift => giftList.appendChild(gift));
}
