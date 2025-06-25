const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`✅ Baileys version: ${version.join('.')}, latest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Disconnected. Reconnect:', shouldReconnect);
      if (shouldReconnect) {
        startSock();
      }
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    console.log(`📩 Message from ${from}: ${text}`);

    if (text && text.toLowerCase() === 'hello') {
      await sock.sendMessage(from, { text: 'Hi there! 🤖 Emex-Buraun Bot here.' });
    }
  });

  sock.ev.on('creds.update', saveCreds);
};

startSock();
