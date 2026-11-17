const mineflayer = require('mineflayer');
const express = require('express');

// --- APNI ATERNOS SERVER DETAILS YAHAN DALEIN ---
const SERVER_HOST = 'yourserver.aternos.me'; // Apna Aternos IP dalein
const SERVER_PORT = 25565;                   // Apna Aternos Port dalein
const BOT_USERNAME = 'AFK_Bot_01';           // Bot ka naam
const MC_VERSION = '1.20.4';                 // Apne server ka version (jaise 1.20.1, 1.21.1)

// Koyeb ko active rakhne ke liye web server (Port 8000)
const app = express();
app.get('/', (req, res) => {
  res.send('AFK Bot is running!');
});
app.listen(8000, () => {
  console.log('Web server running on port 8000');
});

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: MC_VERSION
  });

  bot.on('login', () => {
    console.log(`${BOT_USERNAME} server mein join ho gaya hai!`);
  });

  // Anti-AFK movement (har 15 second mein jump karega)
  bot.on('spawn', () => {
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 15000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot ko kick kiya gaya:', reason);
  });

  bot.on('error', (err) => {
    console.log('Error aaya:', err.message);
  });

  // Disconnect hone par 10 second baad dobara join karega
  bot.on('end', () => {
    console.log('Disconnected. 10 seconds mein reconnect ho raha hai...');
    setTimeout(createBot, 10000);
  });
}

createBot();
