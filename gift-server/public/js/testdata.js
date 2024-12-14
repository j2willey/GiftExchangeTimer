

const data = [{ name: "John", gift: "Fuzzy Dice"},
                { name: "Jane", gift: "Frisbee"},
                { name: "Joe", gift: "Fuzzy slippers"},
                { name: "Jill", gift: "Fuzzy socks"},
                { name: "Jack", gift: "Fuzzy hat"},
                { name: "Jenny", gift: "Fuzzy scarf"},
                { name: "Jerry", gift: "Fuzzy gloves"},
                { name: "Jesse", gift: "Fuzzy blanket"},
                { name: "Jasmine", gift: "Fuzzy pillow"},
                { name: "Jasper", gift: "Fuzzy chair"}];

function loadTestData() {
    data.forEach( playergift => {
        const gift = {
            gid: 'gift' + String(Math.floor(Math.random() * 1000000)),   // Generate a random gift ID
            steals: 0,
            description: playergift.gift,
            holder: playergift.name,
            lastUpdate: new Date(),
            lastSteal: new Date(),
            updates: []
        };
        addGiftToList(gift);
    });
}

settings = document.getElementById('settingsPopup');
const testdataBtn = document.createElement('button');
testdataBtn.id = 'loadTestData';
testdataBtn.textContent = 'Test Data';
settings.appendChild(testdataBtn);

document.getElementById('loadTestData').addEventListener('click', function() {
    loadTestData();
});
