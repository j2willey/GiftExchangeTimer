// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let gifts = [];

// RESTful API endpoints
app.get('/api/gifts', (req, res) => {
    res.json(gifts);
});

app.post('/api/gifts', (req, res) => {
    const gift = req.body;
    gifts.push(gift);
    broadcast(JSON.stringify({ type: 'new-gift', gift }));
    res.status(201).json(gift);
});

app.put('/api/gifts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedGift = req.body;
    gifts = gifts.map((gift, index) => (index === id ? updatedGift : gift));
    broadcast(JSON.stringify({ type: 'update-gift', id, updatedGift }));
    res.json(updatedGift);
});

// WebSocket connection
wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'init', gifts }));
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Serve the dynamic webpage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});